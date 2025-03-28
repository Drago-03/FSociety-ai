import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <div className="prose prose-indigo max-w-none">
        <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using FSociety AI's content moderation system, you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>

        <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily access the FSociety AI content moderation system for personal and business use, subject to the following conditions:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>The system must be used in accordance with all applicable laws and regulations</li>
          <li>Usage must not violate our content guidelines and ethical AI principles</li>
          <li>Access credentials must not be shared with unauthorized users</li>
        </ul>

        <h2 className="text-xl font-semibold mb-4">3. Service Limitations</h2>
        <p className="mb-4">
          FSociety AI reserves the right to modify, suspend, or discontinue any part of the service without prior notice. We are not liable for any modification, suspension, or discontinuation of the service.
        </p>

        <h2 className="text-xl font-semibold mb-4">4. API Usage</h2>
        <p className="mb-4">
          Use of our API is subject to rate limiting and fair usage policies. Users must not attempt to circumvent these limitations or use the API in a way that could damage or overload our systems.
        </p>

        <h2 className="text-xl font-semibold mb-4">5. Data Privacy</h2>
        <p className="mb-4">
          All data processed through our system is handled in accordance with our Privacy Policy and applicable data protection regulations. Users are responsible for ensuring they have the necessary rights and permissions for any content submitted for moderation.
        </p>

        <h2 className="text-xl font-semibold mb-4">6. Disclaimer</h2>
        <p className="mb-4">
          The service is provided "as is" without warranties of any kind. FSociety AI is not responsible for any decisions made based on the moderation results provided by our system.
        </p>

        <h2 className="text-xl font-semibold mb-4">7. Updates to Terms</h2>
        <p className="mb-4">
          FSociety AI reserves the right to update these terms at any time. Users will be notified of any significant changes to these terms.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService; 