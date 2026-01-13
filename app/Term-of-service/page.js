import React from 'react';
import Link from 'next/link';


export default function TermsOfService() {
  return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navigation */}
      
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* { !user && (
              <> */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center px-0">
                <span className="text-3xl font-bold text-blue-600">Flexitroop</span>
                <span className="text-4xl font-bold text-blue-600  py-3 rounded-lg rotate-2 -ml-2">⌝</span>
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
                        <span className="text-2xl"><img
                          src="/Techteam.png"
                          alt="star"
                          width={80}
                          height={80}
                        /></span>
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
                      <h4 className="text-lg font-bold text-blue-600 mb-4">For Bussiness</h4>
                      <div className="flex gap-3">
                        <span className="text-2xl"><img
                          src="/Techteam1.png"
                          alt="star"
                          width={80}
                          height={80}
                        /></span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Tech Teams</p>
                          <p className="text-xs text-gray-600">Discover talent faster — whether internal bench resources or external talent. Easily view skills, availability, and experience to staff projects quickly and efficiently.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <span className="text-2xl">⭐</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Resource & Workforce Managers</p>
                          <p className="text-xs text-gray-600">Publish available bench talent to the platform, match them to upcoming projects, and reduce downtime. Improve utilization with real-time visibility into resource status.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <span className="text-2xl">⭐</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Startups</p>
                          <p className="text-xs text-gray-600">Access verified talent within your network or from posted bench profiles. Build and scale teams on demand without lengthy hiring cycles.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <span className="text-2xl">⭐</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Enterprises</p>
                          <p className="text-xs text-gray-600">Streamline global workforce allocation. Share bench talent across departments, regions, or partner networks to maximize cost savings and workforce efficiency.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-blue-600 mb-4">For Teams</h4>
                      <div className="flex gap-3">
                        <span className="text-2xl">📋</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">HR & Talent Acquisition</p>
                          <p className="text-xs text-gray-600">Automate internal mobility before hiring externally. Source from your own bench first, then expand to external talent only when needed.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <span className="text-2xl">📋</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Hiring Managers</p>
                          <p className="text-xs text-gray-600">Post open roles, view matching bench profiles instantly, and shortlist candidates based on skills, project history, and availability.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <span className="text-2xl">📋</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Project & Delivery Managers</p>
                          <p className="text-xs text-gray-600">Plan staffing proactively. Assign talent ahead of project kickoff using intelligent skill-to-requirement matching and availability forecasting.</p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <span className="text-2xl">📋</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Finance & Operations</p>
                          <p className="text-xs text-gray-600">Reduce idle cost and monitor utilization in real time. Bench posting enables better resource circulation and supports cost-optimized workforce decisions.</p>
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
                        <span className="text-2xl"><img
                          src="/Techteam1.png"
                          alt="star"
                          width={80}
                          height={80}
                        /></span>
                        <div>
                          <a href='/about-flexitroop' className="font-semibold text-gray-900 text-sm mb-2">About Flexitroop</a>
                          <p className="text-xs text-gray-600">Flexitroop is a Marketplace connecting bench resources with project opportunities, enabling efficient talent utilization and workforce optimization.</p>
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
                      <div className="flex gap-3 mt-6">
                        <span className="text-2xl">📋</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Events</p>
                          <p className="text-xs text-gray-600">Join webinars, virtual meetups, and industry conferences to connect and grow.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <span className="text-2xl">📋</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm mb-2">Social wall</p>
                          <p className="text-xs text-gray-600">Real-time updates, success stories, and community highlights from our platform.</p>
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
                      <span className="text-2xl"><img
                        src="/Techteam.png"
                        alt="star"
                        width={40}
                        height={40}
                      /></span>
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
            {/* </>
            )} */}
                  
            <div className="flex items-center gap-4">
               
               
                <>
                  <Link href="/login" className="btn btn-secondary">
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-primary">
                    Register
                  </Link>
                </>
              
            </div>
          </div>
        </div>
      </nav>
    
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
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
              Welcome to Flexitroop. By accessing or using our platform, you agree to be bound by these Terms of Service. 
              Flexitroop provides a marketplace platform for managing and sharing bench employee availability across companies, 
              connecting talented professionals with opportunities seamlessly.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Definitions</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>"Platform"</strong> refers to the Flexitroop website and services.</li>
              <li><strong>"Resource Providers"</strong> are companies or entities listing bench employees.</li>
              <li><strong>"Resource Requesters"</strong> are companies or entities seeking talent.</li>
              <li><strong>"Bench Employees"</strong> are professionals available for temporary assignment.</li>
              <li><strong>"Users"</strong> collectively refers to all parties using the Platform.</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To use Flexitroop, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Ensure you have authority to represent your company</li>
            </ul>
          </section>

          {/* Platform Usage */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Platform Usage</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">4.1 For Resource Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-2">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>List only employees who have consented to be on the platform</li>
              <li>Provide accurate information about employee skills and availability</li>
              <li>Update employee status promptly when circumstances change</li>
              <li>Respond to requests in a timely manner</li>
              <li>Honor commitments made through the platform</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 For Resource Requesters</h3>
            <p className="text-gray-700 leading-relaxed mb-2">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Submit requests in good faith for legitimate business needs</li>
              <li>Complete required documentation including NDAs</li>
              <li>Treat bench employees professionally and ethically</li>
              <li>Comply with all applicable employment laws</li>
              <li>Not solicit employees for permanent positions without proper authorization</li>
            </ul>
          </section>

          {/* NDA and Confidentiality */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. NDA and Confidentiality</h2>
            <p className="text-gray-700 leading-relaxed">
              All parties agree to sign and comply with Non-Disclosure Agreements when engaging through the platform. 
              You must protect confidential information including employee details, company information, and project specifics. 
              Unauthorized disclosure may result in immediate account suspension and legal action.
            </p>
          </section>

          {/* Payment and Fees */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment and Fees</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Flexitroop operates on a subscription and transaction-based model:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>The first 100 partners receive permanent free access</li>
              <li>Subscription fees and payment terms will be clearly communicated</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>Compensation arrangements between parties are separate from platform fees</li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-3">You may not:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Circumvent the platform to conduct direct transactions</li>
              <li>Post false or misleading information</li>
              <li>Discriminate based on protected characteristics</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to the platform</li>
              <li>Scrape or harvest data from the platform</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              Flexitroop and its original content, features, and functionality are owned by Flexitroop and are protected 
              by international copyright, trademark, and other intellectual property laws. You retain ownership of content 
              you post, but grant Flexitroop a license to use it for platform operations.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Flexitroop acts as a platform connecting parties and is not responsible for the actual employment relationships, 
              work quality, or disputes between Resource Providers and Requesters. We provide the platform "as is" without 
              warranties of any kind. Our liability is limited to the amount paid by you in the past 12 months.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violations of these Terms. 
              You may terminate your account at any time by contacting support. Upon termination, your right to use 
              the platform ceases immediately, though certain provisions survive termination.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify these Terms at any time. We will notify users of significant changes via email or platform 
              notification. Continued use of the platform after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by and construed in accordance with applicable laws. Any disputes will be 
              resolved through binding arbitration, except where prohibited by law.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-800 font-medium">Flexitroop Support</p>
              <p className="text-gray-700">Email: support@flexitroop.com</p>
              <p className="text-gray-700">Available: 24/7</p>
            </div>
          </section>

          {/* Acceptance */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-gray-600 text-sm italic">
              By using Flexitroop, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}