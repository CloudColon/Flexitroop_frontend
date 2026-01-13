'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { employeeAPI } from '@/lib/api';
import ProfileDropdown from '@/components/ProfileDropdown';

function ListingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [filters, setFilters] = useState({
    is_listed: 'true', // Only show listed employees
    status: '',
    experience_level: '',
    search: '',
  });
  const [expandedFilters, setExpandedFilters] = useState({
    availability: true,
    experience: false,
    skills: false,
  });

  // Read URL params on mount and update filters
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const skillFromUrl = searchParams.get('skill');
    const availabilityFromUrl = searchParams.get('availability');

    // Build initial search from URL params
    let initialSearch = '';
    if (searchFromUrl) {
      initialSearch = searchFromUrl;
    }
    if (skillFromUrl) {
      // Append skill to search query (backend searches in skills field)
      initialSearch = initialSearch ? `${initialSearch} ${skillFromUrl}` : skillFromUrl;
    }

    // Update filters if we have URL params
    if (searchFromUrl || skillFromUrl || availabilityFromUrl) {
      setFilters(prev => ({
        ...prev,
        search: initialSearch,
        status: availabilityFromUrl || '',
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [user, currentPage, filters]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      };

      const response = await employeeAPI.getAll(params);
      setEmployees(response.data.results || response.data);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1);
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    setFilters({
      is_listed: 'true',
      status: '',
      experience_level: '',
      search: '',
    });
    setCurrentPage(1);
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName[0].toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'requested':
        return 'text-yellow-600';
      case 'allocated':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="#" className="text-2xl font-bold text-primary-600">
                <span className="text-3xl font-bold text-blue-600">Flexitroop</span>
                <span className="text-4xl font-bold text-blue-600  py-3 rounded-lg rotate-2 -ml-2">⌝</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/employees" className="text-gray-700 hover:text-primary-600 font-medium">
                Employees
              </Link>
              <Link href="/listings" className="text-primary-600 font-medium">
                Listings
              </Link>
              <Link href="/resource-tracking" className="text-gray-700 hover:text-primary-600 font-medium">
                Resource Tracking
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                Dashboard
              </Link>
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Availability Section */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilterSection('availability')}
                  className="flex justify-between items-center w-full text-left mb-2"
                >
                  <span className="font-medium text-gray-900 text-sm">Availability</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedFilters.availability ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFilters.availability && (
                  <div className="space-y-2 pl-2">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={filters.status === ''}
                        onChange={() => handleFilterChange('status', '')}
                        className="mr-2"
                      />
                      <span className="text-gray-700">All</span>
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={filters.status === 'available'}
                        onChange={() => handleFilterChange('status', 'available')}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Available</span>
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={filters.status === 'requested'}
                        onChange={() => handleFilterChange('status', 'requested')}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Requested</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Experience Level Section */}
              <div className="mb-4 border-t pt-4">
                <button
                  onClick={() => toggleFilterSection('experience')}
                  className="flex justify-between items-center w-full text-left mb-2"
                >
                  <span className="font-medium text-gray-900 text-sm">Experience Level</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedFilters.experience ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFilters.experience && (
                  <div className="space-y-2 pl-2">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.experience_level === 'junior'}
                        onChange={(e) => handleFilterChange('experience_level', e.target.checked ? 'junior' : '')}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Junior</span>
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.experience_level === 'mid'}
                        onChange={(e) => handleFilterChange('experience_level', e.target.checked ? 'mid' : '')}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Mid-Level</span>
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.experience_level === 'senior'}
                        onChange={(e) => handleFilterChange('experience_level', e.target.checked ? 'senior' : '')}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Senior</span>
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.experience_level === 'lead'}
                        onChange={(e) => handleFilterChange('experience_level', e.target.checked ? 'lead' : '')}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Lead</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content - Employee Cards */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Find Experts</h1>
              <p className="text-gray-600 mt-1">
                {pagination.count} {pagination.count === 1 ? 'expert' : 'experts'} found
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="flex justify-center mb-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : employees.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No experts found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <>
                {/* Expert Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                    >
                      {/* Profile Photo with Favorite Icon */}
                      <div className="relative mb-4">
                        {/* Profile Photo */}
                        <div className="w-full h-40 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                          {getInitials(employee.full_name)}
                        </div>

                        {/* Favorite Icon - Positioned on top right */}
                        <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all hover:scale-110">
                          <svg className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      {/* Name and Title */}
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {employee.full_name}
                        </h3>
                        <p className="text-sm text-gray-600">{employee.job_title}</p>
                        <p className={`flex items-center gap-1 font-medium ${getStatusColor(employee.status)}`}>
                          ● {employee.status}
                        </p>
                      </div>

                      {/* Company and Experience */}
                      <div className="text-sm text-gray-600 mb-3 space-y-1 bg-gray-50 p-2 rounded">
                        <p className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {employee.company_name}
                        </p>
                        <p className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {employee.experience_years} years of experience
                        </p>
                        <p className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          Availability: {employee.bench_start_date}
                        </p>
                      </div>

                      {/* Skills */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        {employee.skills && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Top skills</p>
                            <div className="space-y-1">
                              {employee.skills.split(',').slice(0, 3).map((skill, idx) => {
                                const skillMap = {
                                  'javascript': '🔥',
                                  'js': '🔥',
                                  'python': '🐍',
                                  'react': '⚛️',
                                  'react.js': '⚛️',
                                  'vue': '💚',
                                  'vue.js': '💚',
                                  'angular': '🅰️',
                                  'typescript': '📘',
                                  'ts': '📘',
                                  'node.js': '🟩',
                                  'nodejs': '🟩',
                                  'node': '🟩',
                                  'html': '🏗️',
                                  'css': '🎨',
                                  'sass': '🎨',
                                  'next.js': '▲',
                                  'nextjs': '▲',
                                  'sql': '🗄️',
                                  'mongodb': '🍃',
                                  'postgresql': '🐘',
                                  'mysql': '🐬',
                                  'docker': '🐳',
                                  'git': '🌳',
                                  'aws': '☁️',
                                  'firebase': '🔥',
                                  'tailwind': '💨',
                                  'tailwindcss': '💨',
                                  'java': '☕',
                                  'c++': '⚙️',
                                  'csharp': '🔷',
                                  'php': '🐘',
                                  'ruby': '💎',
                                  'go': '🐹',
                                  'rust': '🦀',
                                  'swift': '🍎',
                                  'kotlin': '🎯',
                                  'flutter': '🦋',
                                  'mobile': '📱',
                                  'ai': '🤖',
                                  'ml': '🤖',
                                  'machine learning': '🤖',
                                  'api': '🔌',
                                  'rest': '🔌',
                                  'graphql': '◆',
                                  'websocket': '🔌',
                                  'design': '🎨',
                                  'ux': '👥',
                                  'ui': '🎨',
                                  'figma': '🎨',
                                };

                                const trimmedSkill = skill.trim().toLowerCase();
                                const emoji = skillMap[trimmedSkill] || '✨';

                                return (
                                  <div
                                    key={idx}
                                    className="px-3 py-1 text-xs font-medium bg-blue-200 text-blue-700 rounded border border-blue-200 w-max flex items-center gap-2"
                                  >
                                    <span>{emoji}</span>
                                    <span>{skill.trim()}</span>
                                  </div>
                                );
                              })}
                              {employee.skills.split(',').length > 3 && (
                                <div className="px-3 py-1 text-xs text-gray-600">
                                  +{employee.skills.split(',').length - 3} more skills
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Link
                          href={`/employees/${employee.id}`}
                          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-center"
                        >
                          View profile
                        </Link>
                        {employee.status === 'available' && (
                          <Link
                            href={`/employees/${employee.id}#request`}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 text-center"
                          >
                            Request
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {(pagination.next || pagination.previous) && (
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={!pagination.previous}
                      className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-gray-600">
                      Page {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={!pagination.next}
                      className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <ListingsPageContent />
    </Suspense>
  );
}
