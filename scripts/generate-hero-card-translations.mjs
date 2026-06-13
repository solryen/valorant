import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import translate from '@vitalets/google-translate-api'
import { heroDailyActivities } from '../src/data/heroDailyActivities.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/heroDailyActivities.el.js')
const BATCH_SIZE = 10

function chunk(array, size) {
  const chunks = []
  for (let index = 0; index < array.length; index += size) {
    chunks.push(array.slice(index, index + size))
  }
  return chunks
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function unescapeHtml(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function buildBatchMarkup(batch) {
  return batch
    .map(
      (activity) => `
<item id="${activity.id}">
  <title>${escapeHtml(activity.title)}</title>
  <instruction>${escapeHtml(activity.instruction)}</instruction>
</item>`.trim(),
    )
    .join('\n')
}

function parseTranslatedBatch(markup) {
  const itemPattern = /<item id="([^"]+)">[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<instruction>([\s\S]*?)<\/instruction>[\s\S]*?<\/item>/g
  const translationMap = {}
  let match

  while ((match = itemPattern.exec(markup)) !== null) {
    const [, id, title, instruction] = match
    translationMap[id] = {
      title: unescapeHtml(title.trim()),
      instruction: unescapeHtml(instruction.trim()),
    }
  }

  return translationMap
}

async function translateBatch(batch, batchIndex, totalBatches) {
  const markup = buildBatchMarkup(batch)

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      console.log(`Translating batch ${batchIndex + 1}/${totalBatches} (attempt ${attempt})`)
      const response = await translate.translate(markup, { to: 'el' })
      return parseTranslatedBatch(response.text)
    } catch (error) {
      const message = String(error?.message ?? error)
      if (attempt === 5) {
        throw error
      }

      if (/429|rate|quota|blocked|captcha/i.test(message)) {
        await sleep(2000 * attempt)
        continue
      }

      await sleep(1000 * attempt)
    }
  }

  return {}
}

async function main() {
  const translationMap = {}
  const batches = chunk(heroDailyActivities, BATCH_SIZE)

  for (const [batchIndex, batch] of batches.entries()) {
    const translatedBatch = await translateBatch(batch, batchIndex, batches.length)

    for (const item of batch) {
      if (translatedBatch[item.id]?.title && translatedBatch[item.id]?.instruction) {
        translationMap[item.id] = translatedBatch[item.id]
      }
    }
  }

  await fs.writeFile(OUTPUT_PATH, `export default ${JSON.stringify(translationMap, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${Object.keys(translationMap).length} translations to ${OUTPUT_PATH}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
