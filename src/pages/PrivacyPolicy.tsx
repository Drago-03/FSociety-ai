import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-indigo max-w-none">
        <h2 className="text-xl font-semibold mb-4">1. Information Collection</h2>
        <p className="mb-4">
          FSociety AI collects and processes information necessary for content moderation purposes. This includes:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Content submitted for moderation</li>
          <li>User account information</li>
          <li>Usage statistics and system performance data</li>
          <li>API access logs and authentication data</li>
        </ul>

        <h2 className="text-xl font-semibold mb-4">2. Data Usage</h2>
        <p className="mb-4">
          We use collected information to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide and improve our content moderation services</li>
          <li>Train and enhance our AI models</li>
          <li>Generate analytics and performance reports</li>
          <li>Ensure system security and prevent abuse</li>
        </ul>

        <h2 className="text-xl font-semibold mb-4">3. Data Protection</h2>
        <p className="mb-4">
          FSociety AI implements industry-standard security measures to protect your data. This includes encryption, secure data storage, and regular security audits. We do not sell or share your data with third parties except as required for service operation.
        </p>

        <h2 className="text-xl font-semibold mb-4">4. User Rights</h2>
        <p className="mb-4">
          Users have the right to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access their personal data</li>
          <li>Request data correction or deletion</li>
          <li>Export their data</li>
          <li>Opt-out of certain data processing activities</li>
        </ul>

        <h2 className="text-xl font-semibold mb-4">5. Data Retention</h2>
        <p className="mb-4">
          We retain data only for as long as necessary to provide our services and comply with legal obligations. Users can request data deletion at any time through their account settings.
        </p>

        <h2 className="text-xl font-semibold mb-4">6. Cookies and Tracking</h2>
        <p className="mb-4">
          FSociety AI uses cookies and similar technologies for authentication, preferences, and analytics purposes. Users can control cookie settings through their browser preferences.
        </p>

        <h2 className="text-xl font-semibold mb-4">7. Updates to Privacy Policy</h2>
        <p className="mb-4">
          We may update this privacy policy periodically. Users will be notified of significant changes, and continued use of the service constitutes acceptance of the updated policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 