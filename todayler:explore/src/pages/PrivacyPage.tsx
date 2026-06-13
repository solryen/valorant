import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function PrivacyPage() {
  const { language } = useLanguage();
  const isGreek = language === 'el';

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-10 py-16">
      <h1 className="font-serif text-4xl text-stone-900 mb-8 italic">
        {isGreek ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}
      </h1>
      <div className="prose prose-stone max-w-none text-stone-700">
        <p className="text-sm font-medium mb-8">Todayler · Last updated: March 14, 2026</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">1. Overview</h2>
        <p>Todayler is a baby development app for parents and caregivers. This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using Todayler, you agree to this Policy.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">2. Information We Collect</h2>
        <p>We collect information you provide directly, including account information (such as email), baby profile information (name, date of birth, gender, prematurity settings), app preferences (notification settings), and feedback you send. We also collect usage data needed to run core features, such as completed activities, streaks, and in app interactions. If enabled, third party sign in providers may share account identifiers with us. We may also collect information related to push notifications, including your notification preferences and whether you have enabled or disabled notifications on your device.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">3. How We Use Information</h2>
        <p>We use information to provide and improve Todayler features, personalize activities and guidance by age and profile, maintain progress and journey history, provide support, communicate service related updates, and protect the app from abuse, fraud, or misuse.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">4. AI Features</h2>
        <p>Todayler includes AI powered features (for example, chat assistance). Messages you send to AI features may be processed by our model providers to generate responses. Do not include sensitive personal information in AI prompts.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">5. Legal Basis and Consent</h2>
        <p>Where required, we process personal data under applicable legal bases including consent, contract performance, legitimate interests, and legal obligations. You may withdraw consent where applicable, though this may affect feature availability.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">6. Children’s Privacy</h2>
        <p>Todayler is intended for adults (parents/caregivers). We do not allow children to create accounts. Baby profile data is provided by the parent/caregiver for personal use inside the app.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">7. Sharing of Information</h2>
        <p>We do not sell your personal data. We may share data with trusted service providers that help us operate the app (for example, hosting, analytics, authentication, communications, and AI providers), with app store platforms for subscription management, or when legally required.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">8. Data Retention</h2>
        <p>We retain data while your account is active or as needed to provide services, resolve disputes, enforce agreements, and comply with law. You may request deletion of account data, subject to legal retention requirements.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">9. Security</h2>
        <p>We use reasonable technical and organizational safeguards to protect information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">10. International Transfers</h2>
        <p>Your information may be processed in countries other than your own. Where required, we use appropriate safeguards for cross border data transfers.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">11. Your Rights</h2>
        <p>Depending on your location, you may have rights to access, correct, delete, or export personal data, and to object to or restrict certain processing. You may also have rights related to marketing preferences.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">12. Subscriptions and Payments</h2>
        <p>Subscription purchases are handled by the Apple App Store. We do not process raw card details directly in the app for those in app purchases.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">13. Policy Changes</h2>
        <p>We may update this Policy from time to time. Material updates will be reflected by a revised date and, where appropriate, in app notice.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">14. California Privacy Rights (CCPA)</h2>
        <p>If you are a California resident, you have the right to know what personal information we collect, disclose, and sell. We do not sell your personal information. For more information or to exercise your California privacy rights, contact us at <a href="mailto:todaylerapp@gmail.com" className="text-orange-600 hover:underline">todaylerapp@gmail.com</a>.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">15. Contact</h2>
        <p>If you have privacy questions or requests, contact us at <a href="mailto:todaylerapp@gmail.com" className="text-orange-600 hover:underline">todaylerapp@gmail.com</a>.</p>
      </div>
    </div>
  );
}
