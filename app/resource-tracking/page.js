'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { resourceRequestAPI, requestAPI, resourceListingAPI, employeeAPI, companyAPI, companyNetworkAPI } from '@/lib/api';
import ProfileDropdown from '@/components/ProfileDropdown';
import Loading from '@/components/Loading';
import CompanyNetworkCard from '@/components/CompanyNetworkCard';
import CompanyDetailsModal from '@/components/CompanyDetailsModal';

export default function ResourceTrackingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking', 'requests', 'post', 'networks'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State for Resource Tracking (Allocations) ---
  const [allocations, setAllocations] = useState([]);
  const [stats, setStats] = useState(null);
  const [trackingFilters, setTrackingFilters] = useState({
    start_date: '',
    end_date: '',
    status: ''
  });

  // --- State for Employee Requests ---
  const [requests, setRequests] = useState([]);
  const [requestFilter, setRequestFilter] = useState('all');
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseData, setResponseData] = useState({ status: '', response: '' });
  const [submittingResponse, setSubmittingResponse] = useState(false);



  // --- State for Networks Tab ---
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [networkDetails, setNetworkDetails] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      if (activeTab === 'tracking') fetchAllocations();
      if (activeTab === 'requests') fetchRequests();

      if (activeTab === 'networks') fetchNetworks();
    }
  }, [user, activeTab, trackingFilters]);



  // --- Resource Tracking Functions ---
  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await resourceRequestAPI.getTracking(trackingFilters);
      setAllocations(response.data.allocations || []);
      setStats(response.data.stats || null);
    } catch (err) {
      console.error('Failed to fetch allocations:', err);
      setError('Failed to load allocation tracking data');
    } finally {
      setLoading(false);
    }
  };

  const handleEndAllocation = async (allocationId) => {
    if (!confirm('Are you sure you want to end this allocation?')) return;
    const reason = prompt('Please provide a reason for ending this allocation:');
    if (!reason) return;

    try {
      await resourceRequestAPI.endAllocation(allocationId, reason);
      alert('Allocation ended successfully');
      fetchAllocations();
    } catch (err) {
      console.error('Failed to end allocation:', err);
      alert('Failed to end allocation');
    }
  };

  const isActive = (allocation) => {
    const today = new Date();
    const start = new Date(allocation.allocation_start_date);
    const end = new Date(allocation.allocation_end_date);
    return today >= start && today <= end;
  };

  // --- Employee Requests Functions ---
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch ResourceRequests received by the owner (not BenchRequests)
      const response = await resourceRequestAPI.getReceived();
      const data = response.data.results || response.data || [];
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError('Failed to load resource requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!respondingTo) return;
    setSubmittingResponse(true);
    try {
      // Use resourceRequestAPI instead of requestAPI
      await resourceRequestAPI.respond(respondingTo.id, responseData);
      setRespondingTo(null);
      setResponseData({ status: '', response: '' });
      fetchRequests();
    } catch (err) {
      console.error('Failed to respond:', err);
      alert('Failed to respond to request');
    } finally {
      setSubmittingResponse(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'approved': return 'badge-approved';
      case 'rejected': return 'badge-rejected';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'nda_pending': return 'bg-yellow-100 text-yellow-800';
      case 'nda_signed': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-purple-100 text-purple-800';
      case 'allocated': return 'bg-green-100 text-green-800';
      default: return 'badge-pending';
    }
  };



  // --- Networks Functions ---
  const fetchNetworks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyNetworkAPI.getMyNetworks();
      setNetworks(response.data || []);
    } catch (err) {
      console.error('Failed to fetch networks:', err);
      setError('Failed to load company networks');
    } finally {
      setLoading(false);
    }
  };

  const handleNetworkClick = async (network) => {
    try {
      const response = await companyNetworkAPI.getDetails(network.id);
      setNetworkDetails(response.data);
      setSelectedNetwork(network);
    } catch (err) {
      console.error('Failed to fetch network details:', err);
      alert('Failed to load network details');
    }
  };

  const handleCloseModal = () => {
    setNetworkDetails(null);
    setSelectedNetwork(null);
  };



  if (authLoading) return <Loading />;
  if (!user) return null;

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
              <Link href="/employees" className="text-gray-700 hover:text-primary-600 font-medium">Employees</Link>
              <Link href="/listings" className="text-gray-700 hover:text-primary-600 font-medium">Listings</Link>
              <Link href="/resource-tracking" className="text-primary-600 font-medium border-b-2 border-primary-600">Resource Tracking</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">Dashboard</Link>
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
          <p className="mt-2 text-gray-600">Manage your resource postings, requests, and active allocations.</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`${activeTab === 'tracking' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Resource Tracking
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`${activeTab === 'requests' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Employee Requests
            </button>

            <button
              onClick={() => setActiveTab('networks')}
              className={`${activeTab === 'networks' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Networks
            </button>
          </nav>
        </div>

        {/* Tab Content: Resource Tracking */}
        {activeTab === 'tracking' && (
          <div>
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm font-medium text-gray-500 mb-1">Total Allocations</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.total_allocations}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm font-medium text-gray-500 mb-1">Total Employees</div>
                  <div className="text-3xl font-bold text-primary-600">{stats.total_employees_allocated}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm font-medium text-gray-500 mb-1">Active Allocations</div>
                  <div className="text-3xl font-bold text-green-600">{stats.active_allocations}</div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="date" value={trackingFilters.start_date} onChange={(e) => setTrackingFilters(prev => ({ ...prev, start_date: e.target.value }))} className="input" />
                <input type="date" value={trackingFilters.end_date} onChange={(e) => setTrackingFilters(prev => ({ ...prev, end_date: e.target.value }))} className="input" />
                <select value={trackingFilters.status} onChange={(e) => setTrackingFilters(prev => ({ ...prev, status: e.target.value }))} className="input">
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="allocated">Allocated</option>
                </select>
              </div>
            </div>

            {loading ? <div className="text-center py-8">Loading...</div> : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource Listing</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allocations.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No allocations found</td></tr>
                    ) : (
                      allocations.map((allocation) => (
                        <tr key={allocation.id} className={isActive(allocation) ? 'bg-green-50' : ''}>
                          <td className="px-6 py-4 text-sm text-gray-900">{allocation.resource_listing_title}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{allocation.resource_company_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{allocation.requesting_company_name}</td>
                          <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${allocation.status === 'allocated' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{allocation.status}</span></td>
                          <td className="px-6 py-4 text-sm">
                            <Link href={`/resource-requests/${allocation.id}`} className="text-primary-600 hover:text-primary-900 mr-3">View</Link>
                            {allocation.status === 'allocated' && isActive(allocation) && (
                              <button onClick={() => handleEndAllocation(allocation.id)} className="text-red-600 hover:text-red-900">End</button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Employee Requests */}
        {activeTab === 'requests' && (
          <div>
            <div className="flex gap-2 mb-6">
              {['all', 'pending', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setRequestFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${requestFilter === status ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {status}
                </button>
              ))}
            </div>

            {loading ? <div className="text-center py-8">Loading...</div> : (
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No requests found</div>
                ) : (
                  requests.filter(r => requestFilter === 'all' || r.status === requestFilter).map((request) => (
                    <div key={request.id} className="card">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{request.resource_listing_title || 'Resource Request'}</h3>
                            <span className={`${getStatusBadgeClass(request.status)} text-xs`}>{request.status}</span>
                          </div>
                          <p className="text-sm text-gray-600">Resources: {request.total_resources || 'N/A'}</p>
                          <p className="text-sm text-gray-600">From: {request.requesting_company_name}</p>
                          {request.skills_summary && <p className="text-sm text-gray-600">Skills: {request.skills_summary}</p>}
                        </div>
                        {request.status === 'pending' && (
                          <button onClick={() => setRespondingTo(request)} className="btn btn-primary">Respond</button>
                        )}
                      </div>
                      {request.message && <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">Message: {request.message}</div>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}



        {/* Tab Content: Networks */}
        {activeTab === 'networks' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Networks</h2>
              <p className="text-gray-600">View your company relationships and interactions</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading networks...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800">{error}</p>
              </div>
            ) : networks.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No company networks yet</h3>
                <p className="mt-2 text-gray-500">Start making resource requests to build your network</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {networks.map(network => (
                  <CompanyNetworkCard
                    key={network.id}
                    network={network}
                    currentCompanyId={user?.accessible_companies?.[0]?.id || user?.managed_companies?.[0]?.id}
                    onClick={handleNetworkClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Response Modal */}
        {respondingTo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Respond to Request</h3>
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="font-medium">{respondingTo.resource_listing_title || 'Resource Request'}</p>
                <p className="text-sm text-gray-600">From: {respondingTo.requesting_company_name}</p>
              </div>
              <form onSubmit={handleRespond} className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center"><input type="radio" name="status" value="approved" onChange={e => setResponseData({ ...responseData, status: e.target.value })} className="mr-2" /> Approve</label>
                  <label className="flex items-center"><input type="radio" name="status" value="rejected" onChange={e => setResponseData({ ...responseData, status: e.target.value })} className="mr-2" /> Reject</label>
                </div>
                <textarea placeholder="Response message..." value={responseData.response} onChange={e => setResponseData({ ...responseData, response: e.target.value })} className="input w-full" rows="3" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setRespondingTo(null)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submittingResponse || !responseData.status}>Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Company Details Modal */}
      {networkDetails && (
        <CompanyDetailsModal details={networkDetails} onClose={handleCloseModal} />
      )}
    </div>
  );
}
