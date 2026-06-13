import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function TermsPage() {
  const { language } = useLanguage();
  const isGreek = language === 'el';

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-10 py-16">
      <h1 className="font-serif text-4xl text-stone-900 mb-8 italic">
        {isGreek ? 'Όροι Χρήσης' : 'Terms of Service'}
      </h1>
      <div className="prose prose-stone max-w-none text-stone-700">
        <p className="text-sm font-medium mb-8">Todayler · Last updated: March 14, 2026</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">1. Agreement</h2>
        <p>These Terms govern your use of Todayler. By creating an account, purchasing a subscription, or using the app, you agree to these Terms.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">2. Eligibility</h2>
        <p>You must be at least 18 years old (or the age of majority in your location) to use Todayler. You are responsible for maintaining the confidentiality of your account credentials.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">3. Service Description</h2>
        <p>Todayler provides baby development activities, progress tracking, stories, and AI assisted guidance for parents/caregivers. Features may change over time.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">4. No Medical Advice</h2>
        <p>Todayler is for informational and educational support only and is not medical advice, diagnosis, or treatment. In emergencies, contact local emergency services immediately.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">5. User Responsibilities</h2>
        <p>You agree not to misuse the app, interfere with service operations, or upload unlawful or harmful content. You are responsible for ensuring the safety and appropriateness of activities for your child.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">6. AI Feature Disclaimer</h2>
        <p>AI generated responses may be imperfect and should be used with judgment. Todayler does not guarantee that AI outputs are complete, accurate, or suitable for every situation.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">7. Subscriptions and Billing</h2>
        <p>Todayler offers auto renewing subscriptions. Subscription title, billing period, and price are shown in app and in the Apple purchase sheet before you confirm payment. Payment is charged to your Apple ID account at confirmation of purchase. Your subscription automatically renews unless canceled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage your subscription and turn off auto renewal at any time in your App Store account settings. Cancellation takes effect at the end of the current billing period. Refunds are handled by Apple under its policies.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">8. Free Trials</h2>
        <p>Todayler may offer free trials for eligible new subscribers. Trial availability, length, and conversion pricing are shown in app and in the Apple purchase sheet before confirmation. If you do not cancel before the trial ends, your subscription automatically converts to the paid plan shown at purchase. Free trials are subject to Apple eligibility rules.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">9. Intellectual Property</h2>
        <p>All app content, design, branding, and software are owned by Todayler or licensors and protected by law. You may not copy, reverse engineer, redistribute, or create derivative works except as permitted by law.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">10. Termination</h2>
        <p>We may suspend or terminate access if you violate these Terms or misuse the service. You may stop using Todayler at any time.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">11. Disclaimers</h2>
        <p>To the fullest extent permitted by law, Todayler is provided "as is" and "as available" without warranties of any kind, express or implied.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">12. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Todayler and its affiliates will not be liable for indirect, incidental, special, consequential, or punitive damages, or loss of data, profits, or goodwill.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">13. Indemnification</h2>
        <p>You agree to indemnify and hold harmless Todayler from claims arising out of your misuse of the app, violation of these Terms, or violation of applicable law.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">14. Governing Law</h2>
        <p>These Terms are governed by the laws of England and Wales, unless mandatory consumer law in your country requires otherwise.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">15. Changes to Terms</h2>
        <p>We may update these Terms from time to time. Continued use of Todayler after updates means you accept the revised Terms.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">16. Contact</h2>
        <p>Questions about these Terms can be sent to <a href="mailto:todaylerapp@gmail.com" className="text-orange-600 hover:underline">todaylerapp@gmail.com</a>.</p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-stone-900">17. Apple Standard EULA</h2>
        <p>Todayler uses Apple's Standard End User License Agreement (EULA).</p>
        <p><a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline inline-flex items-center gap-2">Open Apple Standard EULA &rarr;</a></p>
      </div>
    </div>
  );
}
