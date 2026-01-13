import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center px-0">
                <span className="text-3xl font-bold text-blue-600">Flexitroop</span>
                <span className="text-4xl font-bold text-blue-600 py-3 rounded-lg rotate-2 -ml-2">⌝</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-8 ml-48">
              <div className="relative group">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                  Marketplace
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <div className="absolute -left-10 mt-2 w-[900px] bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-12">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-blue-600 mb-4">Talent Marketplace</h4>
                      <div className="flex gap-3">
                        <span className="text-2xl"><img src="/Techteam.png" alt="star" width={80} height={80} /></span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Browse talent for your projects.</p>
                          <p className="text-xs text-gray-600">Browse top talent from diverse firms and accomplish your projects seamlessly.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-blue-600 mb-4">Work Marketplace</h4>
                      <div className="flex gap-3">
                        <span className="text-2xl">📋</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Browse work marketplace for bench resources</p>
                          <p className="text-xs text-gray-600">Find verified projects and connect with companies worldwide.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                  Why Flexitroop
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <div className="absolute -left-40 mt-2 h-108 w-[800px] bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-12">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-blue-600 mb-4">For Business</h4>
                      <div className="flex gap-3">
                        <span className="text-2xl"><img src="/Techteam1.png" alt="star" width={80} height={80} /></span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Tech Teams</p>
                          <p className="text-xs text-gray-600">Discover talent faster — whether internal bench resources or external talent.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-blue-600 mb-4">For Teams</h4>
                      <div className="flex gap-3">
                        <span className="text-2xl">📋</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">HR & Talent Acquisition</p>
                          <p className="text-xs text-gray-600">Automate internal mobility before hiring externally.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                  Pricing
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg">Option 1</a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Option 2</a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg">Option 3</a>
                </div>
              </div>
              <div className="relative group">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                  Resources
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <div className="absolute -left-80 mt-2 h-108 w-[800px] bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-12">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-blue-600 mb-4">Company</h4>
                      <div className="flex gap-3">
                        <span className="text-2xl"><img src="/Techteam1.png" alt="star" width={80} height={80} /></span>
                        <div>
                          <a href='/about-flexitroop' className="font-semibold text-gray-900 text-sm mb-2">About Flexitroop</a>
                          <p className="text-xs text-gray-600">Flexitroop is a Marketplace connecting bench resources with project opportunities.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-blue-600 mb-4">Resource</h4>
                      <div className="flex gap-3">
                        <span className="text-2xl">📋</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Blogs</p>
                          <p className="text-xs text-gray-600">Insights, tips, and best practices for navigating the modern tech talent landscape.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                Contact
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <div className="absolute -left-[700px] mt-2 w-[900px] bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-12">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-blue-600 mb-4">Partner</h4>
                    <div className="flex gap-3">
                      <span className="text-2xl"><img src="/Techteam.png" alt="star" width={40} height={40} /></span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm mb-2">Become Partner.</p>
                        <p className="text-xs text-gray-600">First 100 partners will get permanent free access</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-blue-600 mb-4">Reach Us</h4>
                    <div className="flex gap-3">
                      <span className="text-2xl">📋</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm mb-2">Our 24/7 Support</p>
                        <p className="text-xs text-gray-600">Email: support@example.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="btn btn-secondary">Login</Link>
              <Link href="/register" className="btn btn-primary">Register</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Privacy Policy Content */}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600 mt-2">Last updated: December 8, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                At Flexitroop, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. 
                By using Flexitroop, you consent to the data practices described in this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">2.1 Information You Provide</h3>
              <p className="text-gray-700 leading-relaxed mb-2">We collect information that you voluntarily provide when you:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Create an account (name, email, company details, contact information)</li>
                <li>List bench employees (employee profiles, skills, experience, availability)</li>
                <li>Submit or respond to requests (project requirements, communication)</li>
                <li>Upload documents (NDAs, contracts, certifications)</li>
                <li>Contact our support team (correspondence, feedback)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 leading-relaxed mb-2">When you use our platform, we automatically collect:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, features used, time spent on platform)</li>
                <li>Cookies and tracking technologies (session data, preferences)</li>
                <li>Log data (access times, errors, performance metrics)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.3 Information from Third Parties</h3>
              <p className="text-gray-700 leading-relaxed">
                We may receive information from third-party services you connect to your account, business partners, 
                or public databases to verify company information and enhance platform functionality.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">We use collected information to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide, operate, and maintain our platform services</li>
                <li>Facilitate connections between Resource Providers and Requesters</li>
                <li>Process requests, approvals, and transactions</li>
                <li>Verify identities and prevent fraud</li>
                <li>Send notifications about account activity, matches, and platform updates</li>
                <li>Improve and personalize user experience</li>
                <li>Analyze platform usage and develop new features</li>
                <li>Comply with legal obligations and enforce our Terms of Service</li>
                <li>Provide customer support and respond to inquiries</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Share Your Information</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">4.1 With Other Users</h3>
              <p className="text-gray-700 leading-relaxed">
                When you list bench employees or submit requests, relevant information is shared with other platform users 
                to facilitate connections. Profile information becomes visible to potential requesters, and your company 
                information is shared when engaging in transactions.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 With Service Providers</h3>
              <p className="text-gray-700 leading-relaxed mb-2">We share information with trusted third-party service providers who assist us with:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Cloud hosting and data storage</li>
                <li>Payment processing</li>
                <li>Email communication services</li>
                <li>Analytics and performance monitoring</li>
                <li>Customer support tools</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3 Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed">
                We may disclose information when required by law, to respond to legal processes, to protect our rights or 
                property, to prevent fraud or security issues, or to protect the safety of users or the public.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.4 Business Transfers</h3>
              <p className="text-gray-700 leading-relaxed">
                If Flexitroop is involved in a merger, acquisition, or sale of assets, your information may be transferred 
                as part of that transaction. We will notify you of any such change.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure servers and regular security audits</li>
                <li>Access controls and authentication protocols</li>
                <li>Regular backups and disaster recovery procedures</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your 
                information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide services. 
                We may retain certain information after account closure for legal compliance, dispute resolution, 
                and fraud prevention. You may request deletion of your data, subject to legal and operational requirements.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Privacy Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-3">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Objection:</strong> Object to certain processing of your information</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                To exercise these rights, contact us at privacy@flexitroop.com. We will respond within 30 days.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the platform</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                You can control cookies through your browser settings, but disabling certain cookies may affect platform functionality.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Links</h2>
              <p className="text-gray-700 leading-relaxed">
                Our platform may contain links to third-party websites or services. We are not responsible for the privacy 
                practices of these external sites. We encourage you to review their privacy policies before providing any 
                personal information.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Flexitroop is not intended for individuals under 18 years of age. We do not knowingly collect personal 
                information from children. If we become aware that we have collected information from a child, we will 
                take steps to delete it promptly.
              </p>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
                safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
                We will notify you of significant changes via email or platform notification. The "Last updated" date at 
                the top indicates when the policy was last revised.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-3 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-800 font-medium">Flexitroop Privacy Team</p>
                <p className="text-gray-700">Email: privacy@flexitroop.com</p>
                <p className="text-gray-700">Support: support@flexitroop.com</p>
                <p className="text-gray-700">Available: 24/7</p>
              </div>
            </section>

            {/* Acceptance */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-gray-600 text-sm italic">
                By using Flexitroop, you acknowledge that you have read and understood this Privacy Policy and agree to 
                the collection, use, and disclosure of your information as described herein.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}