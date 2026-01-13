'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { employeeAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import ProfileDropdown from '@/components/ProfileDropdown';
import ConfirmModal from '@/components/ConfirmModal';

export default function EmployeesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    experience_level: '',
    is_listed: '',
    search: '',
    ordering: '-created_at',
  });
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    employee: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [listingAction, setListingAction] = useState({
    loading: false,
    employeeId: null,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [user, filters, currentPage]);

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
      setEmployees(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      experience_level: '',
      is_listed: '',
      search: '',
      ordering: '-created_at',
    });
    setCurrentPage(1);
  };

  const handleToggleListing = async (employeeId) => {
    setListingAction({ loading: true, employeeId });
    setError('');
    setSuccess('');

    try {
      await employeeAPI.toggleListing(employeeId);
      setSuccess('Employee listing status updated successfully');
      // Refresh the list
      await fetchEmployees();
    } catch (err) {
      console.error('Failed to toggle listing:', err);
      setError(err.response?.data?.error || 'Failed to update listing status. Please try again.');
    } finally {
      setListingAction({ loading: false, employeeId: null });
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'allocated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceBadgeClass = (level) => {
    switch (level) {
      case 'junior':
        return 'bg-gray-100 text-gray-800';
      case 'mid':
        return 'bg-blue-100 text-blue-800';
      case 'senior':
        return 'bg-purple-100 text-purple-800';
      case 'lead':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.employee) return;

    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      await employeeAPI.delete(deleteModal.employee.id);
      setSuccess(`Employee "${deleteModal.employee.full_name}" deleted successfully`);
      setDeleteModal({ isOpen: false, employee: null });
      await fetchEmployees();
    } catch (err) {
      console.error('Failed to delete employee:', err);
      const errorData = err.response?.data;

      if (errorData?.error) {
        let errorMessage = errorData.error;
        if (errorData.active_listings) {
          errorMessage += `\\nActive listings: ${errorData.active_listings.join(', ')}`;
        }
        setError(errorMessage);
      } else if (err.response?.status === 403) {
        setError('You do not have permission to delete this employee');
      } else {
        setError('Failed to delete employee. Please try again.');
      }

      setDeleteModal({ isOpen: false, employee: null });
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
              <Link href="/employees" className="text-primary-600 font-medium">
                Employees
              </Link>
              <Link href="/listings" className="text-gray-700 hover:text-primary-600 font-medium">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bench Employees</h1>
            <p className="text-gray-600 mt-2">
              Browse and manage bench employees across companies
            </p>
          </div>
          <Link href="/employees/add" className="btn btn-primary">
            + Add Employee
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                name="search"
                placeholder="Search by name, skills, job title..."
                value={filters.search}
                onChange={handleSearchChange}
                className="input"
              />
            </div>

            <div className="min-w-[150px]">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="requested">Requested</option>
                <option value="allocated">Allocated</option>
              </select>
            </div>

            <div className="min-w-[150px]">
              <select
                name="is_listed"
                value={filters.is_listed}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Listing Status</option>
                <option value="true">Listed</option>
                <option value="false">Unlisted</option>
              </select>
            </div>

            <div className="min-w-[150px]">
              <select
                name="experience_level"
                value={filters.experience_level}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Levels</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>

            <div className="min-w-[150px]">
              <select
                name="ordering"
                value={filters.ordering}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="bench_start_date">Bench Start Date</option>
                <option value="experience_years">Experience (Low-High)</option>
                <option value="-experience_years">Experience (High-Low)</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="btn btn-secondary whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading employees...</p>
          </div>
        )}

        {/* Employee Table */}
        {!loading && employees.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.status || filters.experience_level || filters.is_listed
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by adding your first bench employee.'}
            </p>
            <Link href="/employees/add" className="btn btn-primary">
              Add Employee
            </Link>
          </div>
        )}

        {!loading && employees.length > 0 && (
          <>
            <div className="card p-0 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Skills
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Listed
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 rounded-full">
                              <span className="text-primary-700 font-semibold">
                                {employee.full_name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.full_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {employee.job_title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.company_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {employee.skills?.split(',').slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                            {employee.skills?.split(',').length > 3 && (
                              <span className="px-2 py-1 text-xs font-medium text-gray-500">
                                +{employee.skills.split(',').length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.experience_years} years</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getExperienceBadgeClass(employee.experience_level)}`}>
                            {employee.experience_level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getStatusBadgeClass(employee.status)}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {employee.is_listed ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                              Listed
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600">
                              Unlisted
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/employees/${employee.id}`}
                              className="text-primary-600 hover:text-primary-900"
                              title="View Details"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleToggleListing(employee.id)}
                              disabled={listingAction.loading && listingAction.employeeId === employee.id}
                              className={`${employee.is_listed ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'} disabled:opacity-50`}
                              title={employee.is_listed ? 'Unlist Employee' : 'List Employee'}
                            >
                              {listingAction.loading && listingAction.employeeId === employee.id ? (
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : employee.is_listed ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteModal({ isOpen: true, employee })}
                              className="text-red-600 hover:text-red-900"
                              title="Delete employee"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, employee: null })}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteModal.employee?.full_name}? This action cannot be undone.`}
        confirmText="Delete Employee"
        isLoading={deleting}
      />
    </div>
  );
}
