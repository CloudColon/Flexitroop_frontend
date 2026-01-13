'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { resourceRequestAPI } from '@/lib/api';
import Loading from '@/components/Loading';

/**
 * Smart Router for Resource Requests
 *
 * This page automatically detects if the current user is:
 * - The REQUESTER (requesting company) → Redirect to /rq/resource-requests/[id]
 * - The RESOURCE OWNER (resource provider) → Redirect to /ro/resource-requests/[id]
 * - Neither → Show error
 */
export default function ResourceRequestRouterPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && params.id) {
      determineRoleAndRedirect();
    }
  }, [user, params.id]);

  const determineRoleAndRedirect = async () => {
    try {
      setLoading(true);
      const response = await resourceRequestAPI.getById(params.id);
      const request = response.data;

      console.log('🔍 DEBUG - Full user object:', user);
      console.log('🔍 Determining user role for request:', {
        requestId: params.id,
        resourceCompany: request.resource_company,
        resourceCompanyName: request.resource_company_name,
        requestingCompany: request.requesting_company,
        requestingCompanyName: request.requesting_company_name,
        currentUser: user?.email,
      });

      // Get user's companies - try different possible formats
      let userCompanyIds = [];

      if (user.accessible_companies) {
        // Format 1: accessible_companies array (correct format from backend!)
        userCompanyIds = user.accessible_companies.map(c => typeof c === 'object' ? c.id : c);
      } else if (user.managed_companies) {
        // Format 2: managed_companies array (legacy)
        userCompanyIds = user.managed_companies.map(c => typeof c === 'object' ? c.id : c);
      } else if (user.company_id) {
        // Format 3: single company_id
        userCompanyIds = [user.company_id];
      } else if (user.company) {
        // Format 4: single company object
        userCompanyIds = [typeof user.company === 'object' ? user.company.id : user.company];
      }

      console.log('👤 User companies:', userCompanyIds);
      console.log('🔍 Checking against - Resource Company:', request.resource_company, 'Requesting Company:', request.requesting_company);

      // Determine role
      const isResourceOwner = userCompanyIds.includes(request.resource_company);
      const isRequester = userCompanyIds.includes(request.requesting_company);

      console.log('🎭 Role determination:', {
        isResourceOwner,
        isRequester,
        userCompanyIds,
        resourceCompanyId: request.resource_company,
        requestingCompanyId: request.requesting_company,
      });

      if (isResourceOwner && isRequester) {
        // Edge case: user belongs to both companies (rare)
        // Default to resource owner view
        console.log('⚠️ User belongs to both companies, showing resource owner view');
        router.replace(`/ro/resource-requests/${params.id}`);
      } else if (isResourceOwner) {
        console.log('✅ Redirecting to RESOURCE OWNER view');
        router.replace(`/ro/resource-requests/${params.id}`);
      } else if (isRequester) {
        console.log('✅ Redirecting to REQUESTER view');
        router.replace(`/rq/resource-requests/${params.id}`);
      } else {
        console.error('❌ User has no access to this request');
        console.error('User company IDs:', userCompanyIds);
        console.error('Resource company:', request.resource_company);
        console.error('Requesting company:', request.requesting_company);
        setError('You do not have permission to view this resource request.');
      }
    } catch (err) {
      console.error('Failed to fetch request:', err);
      setError('Failed to load resource request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/resource-tracking')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Go to Resource Requests
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Loading />;
}
