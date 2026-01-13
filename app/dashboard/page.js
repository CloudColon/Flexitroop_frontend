"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { employeeAPI, companyAPI, resourceRequestAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import ProfileDropdown from "@/components/ProfileDropdown";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    availableEmployees: 0,
    requestedEmployees: 0,
    allocatedEmployees: 0,
    pendingRequests: 0,
    totalCompanies: 0,
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch employees with different statuses
      const [allEmployees, availableEmp, companies, requests] =
        await Promise.all([
          employeeAPI.getAll({ page_size: 100 }),
          employeeAPI.getAvailable(),
          companyAPI.getAll({ page_size: 100 }),
          resourceRequestAPI.getReceived(),
        ]);

      // Calculate statistics
      const employees = allEmployees.data.results || [];
      const requestedCount = employees.filter(
        (e) => e.status === "requested",
      ).length;
      const allocatedCount = employees.filter(
        (e) => e.status === "allocated",
      ).length;

      setStats({
        totalEmployees: allEmployees.data.count || 0,
        availableEmployees: availableEmp.data.length || 0,
        requestedEmployees: requestedCount,
        allocatedEmployees: allocatedCount,
        pendingRequests: requests.data.length || 0,
        totalCompanies: companies.data.count || 0,
      });

      // Get recent employees (first 5)
      setRecentEmployees(employees.slice(0, 5));

      // Get recent requests (first 5)
      setRecentRequests(requests.data.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "available":
        return "badge-available";
      case "requested":
        return "badge-requested";
      case "allocated":
        return "badge-allocated";
      case "pending":
        return "badge-pending";
      case "approved":
        return "badge-approved";
      case "rejected":
        return "badge-rejected";
      default:
        return "badge-available";
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
              <Link href="/employees" className="text-gray-700 hover:text-primary-600 font-medium">
                Employees
              </Link>
              <Link href="/listings" className="text-gray-700 hover:text-primary-600 font-medium">
                Listings
              </Link>
              <Link href="/resource-tracking" className="text-gray-700 hover:text-primary-600 font-medium">
                Resource Tracking
              </Link>
              <Link href="/dashboard" className="text-primary-600 font-medium">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s an overview of your bench management system
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-blue-300 to-blue-100 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black text-sm font-medium">
                      Total Employees
                    </p>
                    <p className=" text-black text-3xl font-bold mt-2">
                      {stats.totalEmployees}
                    </p>
                  </div>
                  <div className="text-5xl opacity-70"><img
                    src="/employee.png"
                    alt="star"
                    width={50}
                    height={50}
                  /></div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/employees"
                    className="text-sm text-black hover:text-white font-medium"
                  >
                    View all →
                  </Link>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-300 to-green-100 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black text-sm font-medium">
                      Available
                    </p>
                    <p className="text-black text-3xl font-bold mt-2">
                      {stats.availableEmployees}
                    </p>
                  </div>
                  <div className="text-5xl opacity-70"><img
                    src="/convenience.png"
                    alt="star"
                    width={50}
                    height={50}
                  /></div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/employees?status=available"
                    className="text-sm text-black hover:text-white font-medium"
                  >
                    View available →
                  </Link>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-orange-300 to-orange-100 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black text-sm font-medium">
                      Pending Requests
                    </p>
                    <p className="text-black text-3xl font-bold mt-2">
                      {stats.pendingRequests}
                    </p>
                  </div>
                  <div className="text-5xl opacity-70"><img
                    src="/wall-clock.png"
                    alt="star"
                    width={50}
                    height={50}
                  /></div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/requests?status=pending"
                    className="text-sm text-black hover:text-white font-medium"
                  >
                    Review requests →
                  </Link>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-300 to-purple-100 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black text-sm font-medium">
                      Companies
                    </p>
                    <p className="text-black text-3xl font-bold mt-2">
                      {stats.totalCompanies}
                    </p>
                  </div>
                  <div className="text-5xl opacity-70"><img
                    src='/workplace.png'
                    alt='star'
                    width={50}
                    height={50}
                  /></div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/companies"
                    className="text-sm text-black hover:text-white font-medium"
                  >
                    View companies →
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Employees */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Employees
                  </h2>
                  <Link
                    href="/employees"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View all →
                  </Link>
                </div>

                {recentEmployees.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">👤</div>
                    <p>No employees yet</p>
                    <Link
                      href="/employees/add"
                      className="btn btn-primary mt-4"
                    >
                      Add Employee
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {employee.full_name}
                          </h3>
                          <span className="text-sm text-gray-600">
                            {employee.experience_years} Years Experience
                          </span>
                          <span className="text-xs text-gray-500 mt-1 ml-7">
                            {employee.company_name}
                          </span>
                          <span className="ml-7 text-xs"> {employee.is_listed ? (
                            <span className="badge px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              Listed
                            </span>
                          ) : (
                            <span className="badge px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                              Unlisted
                            </span>
                          )}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`badge ${getStatusBadgeClass(employee.status)}`}
                          >
                            {employee.status}
                          </span>
                          <Link
                            href={`/employees/${employee.id}`}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Requests */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pending Requests
                  </h2>
                  <Link
                    href="/resource-tracking"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View all →
                  </Link>
                </div>

                {recentRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📋</div>
                    <p>No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {request.employee_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {request.employee_job_title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            From: {request.requesting_company_name}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`badge ${getStatusBadgeClass(request.status)}`}
                          >
                            {request.status}
                          </span>
                          <Link
                            href={`/requests/${request.id}`}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Employee Status Distribution */}
            <div className="card mb-8 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Employee Status Distribution
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.availableEmployees}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Available</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">
                    {stats.requestedEmployees}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Requested</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.allocatedEmployees}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Allocated</div>
                </div>
              </div>
            </div>


            {/* Quick Actions */}
            <div className="card mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  href="/employees/add"
                  className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center group"
                >
                  <div className="text-4xl mb-3">➕</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                    Add Employee
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Add a new bench employee
                  </p>
                </Link>
                <Link
                  href="/companies/add"
                  className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center group"
                >
                  <div className="text-4xl mb-3">🏢</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                    Add Company
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Register a new company
                  </p>
                </Link>
                <Link
                  href="/employees?status=available"
                  className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center group"
                >
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                    Browse Available
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Find available employees
                  </p>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
