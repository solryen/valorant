#!/bin/zsh -f

set -euo pipefail

TARGET=${1:?target path required}
APP="$TARGET/artifacts/todayler"
ATTACHED="$TARGET/attached_assets"
STAGE=$(mktemp -d)

cleanup() {
  rm -rf "$STAGE"
}
trap cleanup EXIT

if [[ ! -d "$APP/src" ]]; then
  echo "Missing app source at $APP/src" >&2
  exit 1
fi

if [[ ! -f "$APP/index.html" ]]; then
  echo "Missing app entry at $APP/index.html" >&2
  exit 1
fi

cp -R "$APP/src" "$STAGE/src"
cp -R "$APP/public" "$STAGE/public"
cp "$APP/index.html" "$STAGE/index.html"
cp "$APP/components.json" "$STAGE/components.json"
mkdir -p "$STAGE/src/assets"
cp "$ATTACHED/logo.jpg" "$STAGE/src/assets/logo.jpg"
cp "$ATTACHED/1paywallphoto_1779089972449.png" "$STAGE/src/assets/1paywallphoto_1779089972449.png"

perl -0pi -e 's|from "@assets/logo\.jpg"|from "@/assets/logo.jpg"|g; s|from "@assets/1paywallphoto_1779089972449\.png"|from "@/assets/1paywallphoto_1779089972449.png"|g' \
  "$STAGE/src/components/layout/Navbar.tsx" \
  "$STAGE/src/components/layout/Footer.tsx" \
  "$STAGE/src/components/sections/Hero.tsx"

perl -0pi -e 's|Build something amazing with Replit|Todayler, baby development support for parents|g; s|Replit|Todayler|g' \
  "$STAGE/index.html"

cat > "$STAGE/package.json" <<'EOF'
{
  "name": "todayler",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-collapsible": "^1.1.4",
    "@radix-ui/react-context-menu": "^2.2.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-hover-card": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-menubar": "^1.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.6",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.4",
    "@radix-ui/react-scroll-area": "^1.2.4",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slider": "^1.2.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-toggle": "^1.1.3",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@tanstack/react-query": "^5.90.21",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.23.24",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.545.0",
    "next-themes": "^0.4.6",
    "react": "19.1.0",
    "react-day-picker": "^9.11.1",
    "react-dom": "19.1.0",
    "react-hook-form": "^7.55.0",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1",
    "vaul": "^1.1.2",
    "wouter": "^3.3.5",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.1.14",
    "@types/node": "^25.3.3",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.0.4",
    "tailwindcss": "^4.1.14",
    "tw-animate-css": "^1.4.0",
    "typescript": "~5.9.3",
    "vite": "^7.3.2"
  }
}
EOF

cat > "$STAGE/tsconfig.json" <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["node", "vite/client"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

cat > "$STAGE/vite.config.ts" <<'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
    dedupe: ["react", "react-dom"]
  },
  server: {
    host: "0.0.0.0"
  },
  preview: {
    host: "0.0.0.0"
  }
});
EOF

cat > "$STAGE/vercel.json" <<'EOF'
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF

cat > "$STAGE/.gitignore" <<'EOF'
node_modules/
dist/
.DS_Store
*.tsbuildinfo
.env
.env.*
.vscode/
.idea/
EOF

cat > "$STAGE/README.md" <<'EOF'
# Todayler

Standalone Vite + React + TypeScript frontend for Todayler.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
EOF

find "$TARGET" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R "$STAGE"/. "$TARGET"/

echo "Converted $TARGET"
