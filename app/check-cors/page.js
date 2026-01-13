'use client';

import { useState } from 'react';

export default function CheckCorsPage() {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);
  const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const endpoints = [
    { name: 'Root API', url: '/api/', method: 'GET', requiresAuth: false },
    { name: 'Swagger JSON', url: '/swagger.json', method: 'GET', requiresAuth: false },
    { name: 'Auth - Register Company User', url: '/api/auth/register/company-user/', method: 'OPTIONS', requiresAuth: false },
    { name: 'Auth - Register Admin', url: '/api/auth/register/admin/', method: 'OPTIONS', requiresAuth: false },
    { name: 'Auth - Login', url: '/api/auth/login/', method: 'OPTIONS', requiresAuth: false },
    { name: 'Auth - Token Refresh', url: '/api/auth/token/refresh/', method: 'OPTIONS', requiresAuth: false },
    { name: 'Admin Requests', url: '/api/auth/admin-requests/', method: 'OPTIONS', requiresAuth: true },
    { name: 'Companies List', url: '/api/companies/', method: 'OPTIONS', requiresAuth: true },
    { name: 'Employees List', url: '/api/employees/', method: 'OPTIONS', requiresAuth: true },
    { name: 'Bench Requests', url: '/api/requests/', method: 'OPTIONS', requiresAuth: true },
    { name: 'Resource Listings', url: '/api/resource-listings/', method: 'OPTIONS', requiresAuth: true },
    { name: 'Resource Requests', url: '/api/resource-requests/', method: 'OPTIONS', requiresAuth: true },
    { name: 'Static Files (Admin CSS)', url: '/static/admin/css/base.css', method: 'GET', requiresAuth: false },
  ];

  const testEndpoint = async (endpoint) => {
    const startTime = Date.now();
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
      };

      const response = await fetch(`${API_URL}${endpoint.url}`, {
        method: endpoint.method,
        headers,
        mode: 'cors',
      });

      const duration = Date.now() - startTime;
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials'),
      };

      return {
        ...endpoint,
        status: response.status,
        statusText: response.statusText,
        success: response.status < 500,
        duration,
        corsHeaders,
        error: null,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        ...endpoint,
        status: 0,
        statusText: 'Network Error',
        success: false,
        duration,
        corsHeaders: {},
        error: error.message,
      };
    }
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);
    setSummary({ total: 0, passed: 0, failed: 0 });

    const testResults = [];
    let passed = 0;
    let failed = 0;

    for (const endpoint of endpoints) {
      const result = await testEndpoint(endpoint);
      testResults.push(result);
      setResults([...testResults]);

      if (result.success) {
        passed++;
      } else {
        failed++;
      }

      setSummary({
        total: testResults.length,
        passed,
        failed,
      });
    }

    setTesting(false);
  };

  const getStatusColor = (success) => {
    return success ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (success) => {
    return success ? '✓' : '✗';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CORS & API Connectivity Check</h1>
          <p className="text-gray-600">
            Test backend API endpoints to verify CORS configuration and connectivity
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Backend URL:</strong> {API_URL}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Frontend Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
            </p>
          </div>
        </div>

        {/* Test Button and Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={runTests}
              disabled={testing}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                testing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {testing ? 'Testing...' : 'Run CORS Tests'}
            </button>

            {summary.total > 0 && (
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
            )}
          </div>

          {testing && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span>Testing endpoints... ({results.length}/{endpoints.length})</span>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>

            {results.map((result, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                  result.success ? 'border-green-500' : 'border-red-500'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${getStatusColor(
                          result.success
                        )}`}
                      >
                        {getStatusIcon(result.success)}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{result.name}</h3>
                        <p className="text-sm text-gray-600">
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {result.method}
                          </span>{' '}
                          {result.url}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-semibold ${
                          result.success ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {result.status} {result.statusText}
                      </div>
                      <div className="text-xs text-gray-500">{result.duration}ms</div>
                    </div>
                  </div>

                  {result.error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm font-semibold text-red-800 mb-1">Error:</p>
                      <p className="text-sm text-red-700 font-mono">{result.error}</p>
                    </div>
                  )}

                  {/* CORS Headers */}
                  <div className="mt-3">
                    <details className="cursor-pointer">
                      <summary className="text-sm font-semibold text-gray-700 hover:text-gray-900">
                        CORS Headers
                      </summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded text-sm font-mono space-y-1">
                        {Object.entries(result.corsHeaders).map(([key, value]) => (
                          <div key={key} className="flex">
                            <span className="text-gray-600 w-64">{key}:</span>
                            <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                              {value || 'not set'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>

                  {result.requiresAuth && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        Requires Authentication
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        {results.length === 0 && !testing && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">How to use this tool:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click &ldquo;Run CORS Tests&rdquo; to test all backend API endpoints</li>
              <li>Check if CORS headers are properly configured</li>
              <li>Identify any connectivity issues between frontend and backend</li>
              <li>Green results indicate successful CORS setup</li>
              <li>Red results indicate CORS or connectivity problems that need fixing</li>
            </ol>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Some endpoints may return 401/403 errors, which is normal
                if you are not authenticated. The important thing is that the CORS headers are
                present and the request is not blocked by the browser.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
