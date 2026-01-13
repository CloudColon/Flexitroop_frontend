'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');

  // Handle search - navigate to listings page with search params
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.append('search', searchQuery);
    }
    if (selectedSkill) {
      params.append('skill', selectedSkill);
    }
    if (selectedAvailability) {
      params.append('availability', selectedAvailability);
    }

    // Navigate to listings page with search parameters
    const queryString = params.toString();
    router.push(`/listings${queryString ? `?${queryString}` : ''}`);
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const slides = [
    '/photo1.jpg',
    '/photo2.jpg',
    '/photo3.jpg',
    '/photo4.jpg',
    '/photo5.jpg',
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (

    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navigation */}

      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
           
            
              <div className="flex items-center">
                <Link href="/" className="flex items-center px-0">
                  <span className="text-3xl font-bold text-blue-600">Flexitroop</span>
                  <span className="text-4xl font-bold text-blue-600  py-3 rounded-lg rotate-2 -ml-2">⌝</span>
                </Link>
              </div>
              { !user && (
              <>
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
              
              </>
            )}

              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <Link href="/employees" className="text-gray-700 hover:text-primary-600 font-medium">
                      Employees
                    </Link>
                    <Link href="/companies" className="text-gray-700 hover:text-primary-600 font-medium">
                      Companies
                    </Link>
                    <Link href="/requests" className="text-gray-700 hover:text-primary-600 font-medium">
                      Requests
                    </Link>
                    <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                      Dashboard
                    </Link>
                    <span className="text-gray-600">
                      {user.first_name} {user.last_name}
                    </span>
                    <button onClick={logout} className="btn btn-secondary">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn btn-secondary">
                      Login
                    </Link>
                    <Link href="/register" className="btn btn-primary">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="bg-gradient-to-b from-blue-800 to-blue-600 rounded-3xl shadow-lg px-8 pt-12 pb-24 text-center">
              {/* Badge */}
              <div className="text-green-500 font-semibold text-lg mb-4 bg-white rounded-3xl inline-block px-4 py-2 shadow-md">
                ✨ Top Talent Available Now
              </div>

              {/* Heading */}
              <h1 className="text-6xl font-bold text-white mb-6">
                Find Diverse Bench Talent<span><br />On-Demand</span>
              </h1>

              {/* Search Bar */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="bg-white rounded-lg px-6 py-3 flex-0">
                  <input
                    type="text"
                    className="px-5 py-3 rounded-lg border-0 outline-none text-base placeholder-gray-500 bg-white"
                    placeholder="Search skill or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />

                  <select
                    className="px-5 py-3 rounded-lg border-0 outline-none text-base bg-white text-gray-700 cursor-pointer"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                  >
                    <option value="">All Skills</option>
                    <option value="Salesforce">Salesforce</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="AWS">AWS</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                    <option value="DevOps">DevOps</option>
                    <option value=".NET">.NET</option>
                    <option value="Angular">Angular</option>
                  </select>

                  <select
                    className="px-5 py-3 rounded-lg border-0 outline-none text-base bg-white text-gray-700 cursor-pointer"
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                  >
                    <option value="">Any Time</option>
                    <option value="available">Available Now</option>
                    <option value="requested">Requested</option>
                  </select>

                  <button
                    className="px-5 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-800 transition whitespace-nowrap ml-4"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
              <p className="font-semibold text-white max-w-3xl mx-auto mb-12 p-10 mt-6">
                A modern platform for managing and sharing bench employee availability across companies. Connect talented professionals with opportunities seamlessly.
              </p>
            </div>

            {/* Overlapping Carousel Section */}
            <div className=" max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-16">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="relative w-full h-[600px]">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                      <img
                        src={slide}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className='text-center mb-16'>
            <h2 className="text-3xl font-bold text-gray-900">How Flexitroop Can Help You</h2>
          </div>
          {/* card 1 */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition flex flex-col" style={{ transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-30px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600">
                <img src="/photo6.jpg" alt="Team" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-5xl font-bold text-blue-600 mb-4 text-center"></div>
                <h3 className="text-2xl font-bold text-blue-900 mb-3">Manage Employees</h3>
                <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                  List and manage your bench employees with detailed profiles, skills, and availability.
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  👥 400+ employees
                </div>
              </div>
            </div>
            {/* card 2 */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition flex flex-col" style={{ transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-30px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div className="w-full h-64 bg-gradient-to-br from-purple-400 to-purple-600">
                <img src="photo7.jpg" alt="Collaboration" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-5xl font-bold text-purple-600 mb-4 text-center"></div>
                <h3 className="text-2xl font-bold text-blue-900 mb-3">Company Network</h3>
                <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                  Connect with other companies and discover talented professionals ready for new opportunities.
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  👥 400+ employees
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  📍 UK, Ukraine, USA, and India
                </div>
              </div>
            </div>
            {/* card 3 */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition flex flex-col" style={{ transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-30px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div className="w-full h-64 bg-gradient-to-br from-red-400 to-red-600">
                <img src="/photo8.jpg" alt="Meeting" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-5xl font-bold text-purple-600 mb-4 text-center"></div>
                <h3 className="text-2xl font-bold text-blue-900 mb-3">Request System</h3>
                <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                  Streamlined request and approval workflow for hiring bench employees across organizations.
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  👥 105 employees
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  📍 Charleston SC, USA
                </div>
              </div>
            </div>
          </div>


          {/* New Section - Features */}
          <div className="bg-white w-full ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="grid grid-cols-2 gap-12 items-center">
                {/* Left Side - Content */}
                <div>
                  <p className="text-blue-600 font-semibold mb-4">Bench Management Made Easy</p>
                  <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
                    Streamline Bench Employee Management Across Organizations
                  </h2>

                  <div className="space-y-6 mb-8">
                    <div className="flex gap-4">
                      <div className="text-blue-600 text-2xl flex-shrink-0">✓</div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">Unified Platform:</h3>
                        <p className="text-gray-700">Manage all your bench employees in one centralized system, eliminating the complexity of tracking availability across multiple spreadsheets and communication channels.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-blue-600 text-2xl flex-shrink-0">✓</div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">Consistent Processes:</h3>
                        <p className="text-gray-700">Connect with other companies to discover available talent and fill project requirements instantly. Real-time visibility ensures smoother resource allocation.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-blue-600 text-2xl flex-shrink-0">✓</div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">Efficient Request Workflow:</h3>
                        <p className="text-gray-700">Streamlined approval processes for hiring bench employees reduces administrative overhead and gets talent deployed faster.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
                      Browse Talent →
                    </button>
                    <button className="border-2 border-gray-300 text-gray-900 px-8 py-3 rounded-full font-semibold hover:border-gray-400 transition">
                      List your Team
                    </button>
                  </div>
                </div>

                {/* Right Side - Image & Info */}
                <div className="relative">
                  <div className="bg-white rounded-2xl p-8 space-y-6">
                    <h4 className="text-gray-600 font-semibold">Available Resources</h4>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Sr.</span>
                        <span className="text-gray-600">Employee Name</span>
                        <span className="text-gray-600">Skills</span>
                        <span className="text-gray-600">Status</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-700">01</span>
                          <div className="flex items-center gap-2">
                            <img src="https://i.pravatar.cc/40?img=5" alt="Jack" className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="font-semibold text-gray-900">Jack S.</p>
                              <p className="text-xs text-gray-500">Oracle PFM</p>
                            </div>
                          </div>
                          <div className="text-xs">Java-Backend</div>
                          <span className="text-xs text-green-600 font-semibold">Available</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-700">02</span>
                          <div className="flex items-center gap-2">
                            <img src="https://i.pravatar.cc/40?img=6" alt="William" className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="font-semibold text-gray-900">William M.</p>
                              <p className="text-xs text-gray-500">CloudColon</p>
                            </div>
                          </div>
                          <div className="text-xs">Salesforce Developer</div>
                          <span className="text-xs text-green-600 font-semibold">Available</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-700">03</span>
                          <div className="flex items-center gap-2">
                            <img src="https://i.pravatar.cc/40?img=7" alt="Rita" className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="font-semibold text-gray-900">Rita J.</p>
                              <p className="text-xs text-gray-500">TecnoHub & co</p>
                            </div>
                          </div>
                          <div className="text-xs">UX Consultant</div>
                          <span className="text-xs text-yellow-500 font-semibold">Requested</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Stats Box */}
                  <div className="bg-white rounded-2xl shadow-xl p-5 w-full mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Total Available Talent</p>
                        <h3 className="text-3xl font-bold text-gray-900">250+ Employees</h3>
                        <p className="text-blue-600 text-sm">From 50+ Companies</p>
                      </div>
                    </div>



                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-2">Quick Stats</p>
                        <div className="flex gap-2">
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">45 Available Now</span>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">12 Pending</span>
                          <span className="text-xs bg-red-100 text-cyan-500 px-3 py-1 rounded-full">30+ Successfully Onboarded</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Flow Section */}
          <div className="bg-gray-200 py-20 mb-16 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">How It Works</h2>

              <div className="grid grid-cols-2 gap-12">
                {/* Provider Flow - Left */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">For Resource Providers</h3>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img
                      src="/provider.jpg"
                      alt="Provider Flow"
                      className="w-full"
                    />
                    <div className="p-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">1️⃣</span>
                          <p className="text-gray-700">Add Employee with availability</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">2️⃣</span>
                          <p className="text-gray-700">List them, everyone can see</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">3️⃣</span>
                          <p className="text-gray-700">Receive Employee request</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">4️⃣</span>
                          <p className="text-gray-700">Sign NDA and Provide your Employee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Flow - Right */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">For Resource Requesters</h3>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img
                      src="/Client.jpg"
                      alt="Client Flow"
                      className="w-full"
                    />
                    <div className="p-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">1️⃣</span>
                          <p className="text-gray-700">Search Best fitted employee</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">2️⃣</span>
                          <p className="text-gray-700">Request for employee</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">3️⃣</span>
                          <p className="text-gray-700">After approval Upload NDA</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">4️⃣</span>
                          <p className="text-gray-700">After NDA sign, Allocate employee to your project</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {/* CTA Section */}
            {!user && (
              <div className="card bg-primary-600 text-white text-center mt-16">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-lg mb-6 opacity-90">
                  Join Flexitroop today and start connecting with talented professionals.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/register" className="bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg">
                    Create Account
                  </Link>
                  <Link href="/login" className="bg-primary-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-900 transition-colors shadow-lg">
                    Sign In
                  </Link>
                </div>
              </div>

            )}
          </div>

          {user && (
            <div className="card text-center">
              <h2 className="text-3xl font-bold mb-4">Welcome back, {user.first_name}!</h2>
              <p className="text-lg text-gray-600 mb-6">
                What would you like to do today?
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/employees" className="btn btn-primary">
                  Browse Employees
                </Link>
                <Link href="/employees/add" className="btn btn-secondary">
                  Add Employee
                </Link>
                <Link href="/requests" className="btn btn-secondary">
                  View Requests
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <span>&copy; 2026 Flexitroop. All rights reserved.</span>
            <span> | </span>
            <Link href='/Private-policy'>Private Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}