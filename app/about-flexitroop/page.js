import Image from 'next/image';
import Link from 'next/link';
import { Cloud, Users, Zap, Globe, ArrowRight, Target } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
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
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="btn btn-secondary">
                                Login
                            </Link>
                            <Link href="/register" className="btn btn-primary">
                                Register
                            </Link>
                        </div>
                    </div>

                </div>

            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Build. Manage. Optimize.
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Revolutionizing talent management by connecting skilled professionals on the bench with companies seeking immediate expertise. We bridge the gap between opportunity and talent.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/login">
                                <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 flex items-center gap-2">
                                    Get Started <ArrowRight size={20} />
                                </button>
                            </Link>

                        </div>

                    </div>

                    {/* Right Image */}
                    <div className="relative h-96 lg:h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl"></div>
                        <div className="relative h-full flex items-center justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop"
                                alt="About Flexitroop"
                                className="rounded-3xl shadow-lg w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl border border-gray-200">
                            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <Users className="text-blue-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Connect Talent</h3>
                            <p className="text-gray-600">
                                Bridge the gap between skilled professionals and meaningful project opportunities in real-time.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-gray-200">
                            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <Zap className="text-blue-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Optimize Resources</h3>
                            <p className="text-gray-600">
                                Maximize workforce utilization and reduce bench time with intelligent matching algorithms.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl border border-gray-200">
                            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <Globe className="text-blue-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Scale</h3>
                            <p className="text-gray-600">
                                Access a worldwide network of professionals and opportunities in one integrated platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Mission Section */}
                <div className="grid md:grid-cols-[7fr_3fr] gap-6 items-center mb-24">
                    <div>
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">Our mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            At WorkWall, we empower tech firms through a dynamic platform where innovation thrives,
                            collaborations flourish, and resources seamlessly exchange. We're dedicated to fostering tech
                            venture growth and creating a vibrant community that propels collective success.
                        </p>
                    </div>
                    <div>
                        <div className="flex justify-end">
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
                                alt="Professional woman working"
                                className="rounded-3xl shadow-lg w-full max-w-md h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Vision Section */}
                <div className="grid md:grid-cols-[3fr_7fr] gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <img
                            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop"
                            alt="Professional man working"
                            className="rounded-3xl shadow-lg w-full max-w-md h-auto object-cover"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">Our vision</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            WorkWall envisions a future where every tech teams, irrespective of size, accesses a unified platform—our
                            epicenter for collaboration, resource exchange, and unparalleled innovation. We aspire to drive transformative
                            projects, reshape the tech landscape, and empower professionals to reach their full potential.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-[55%_45%] gap-12 items-center">
                    <div>
                        <div className="text-blue-600 font-semibold text-lg mb-4">Features</div>
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">What we offer?</h2>
                        <p className="text-gray-600 text-lg mb-12 leading-relaxed">
                            Connect, collaborate, and thrive in a dynamic ecosystem where projects come to life,
                            resources are exchanged seamlessly, and opportunities for professional growth
                            abound. Elevate your tech journey with us.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-900 font-medium">Find niche tech firms</span>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-900 font-medium">Access to global talent pool</span>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-900 font-medium">Deals on SAAS products</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-900 font-medium">Post tech requirements</span>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-900 font-medium">Free demos</span>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-900 font-medium">Seamless cross border payments</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 relative">
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop"
                                alt="Happy professional"
                                className="rounded-2xl w-full h-auto"
                            />
                            <div className="absolute bottom-12 left-8 right-8 bg-white rounded-2xl shadow-xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    "Thanks to Flexitroop for connecting us with skilled professionals quickly."
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Flexitroop gave me access to tech pool with a seamless process. A great platform to
                                    bring the tech firms closer.
                                </p>
                                <div className="text-gray-900 font-semibold">Lilly Woods</div>
                                <div className="text-blue-600 text-sm">Deliver Manager, Codestars LLP</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gray-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">50K+</div>
                            <p className="text-gray-400">Active Users</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">10K+</div>
                            <p className="text-gray-400">Opportunities</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <p className="text-gray-400">Companies</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">95%</div>
                            <p className="text-gray-400">Satisfaction Rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 lg:p-16 text-center text-white">
                    <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Workforce?</h2>
                    <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of companies using Flexitroop to optimize their bench management and scale their operations.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link href="/login">
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100">
                                Get Started Free
                            </button>
                        </Link>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><Link href="/about">About</Link></li>
                                <li><Link href="/pricing">Pricing</Link></li>
                                <li><Link href="/blog">Blog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Product</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><Link href="#">Features</Link></li>
                                <li><Link href="#">Security</Link></li>
                                <li><Link href="#">Roadmap</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><Link href="#">Documentation</Link></li>
                                <li><Link href="#">Support</Link></li>
                                <li><Link href="#">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><Link href="#">Privacy</Link></li>
                                <li><Link href="#">Terms</Link></li>
                                <li><Link href="#">Cookies</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 text-center text-gray-600 text-sm">
                        <p>&copy; 2024 Flexitroop. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}