'use client';

export default function CompanyDetailsModal({ details, onClose }) {
    if (!details) return null;

    const { network, recent_requests = [], recent_messages = [] } = details;

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'allocated': return 'bg-green-100 text-green-800';
            case 'nda_signed': return 'bg-blue-100 text-blue-800';
            case 'approved': return 'bg-yellow-100 text-yellow-800';
            case 'nda_pending': return 'bg-purple-100 text-purple-800';
            case 'pending': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {network.company_a_name} ↔ {network.company_b_name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* NDA Status */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            NDA Status
                        </h3>
                        {network.nda_signed ? (
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center text-green-600 font-medium">
                                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Signed
                                </span>
                                <span className="text-sm text-gray-500">
                                    on {new Date(network.nda_signed_at).toLocaleDateString()}
                                </span>
                            </div>
                        ) : (
                            <span className="inline-flex items-center text-yellow-600 font-medium">
                                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Not Signed
                            </span>
                        )}
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-primary-50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-primary-600">{network.total_requests || 0}</div>
                            <div className="text-sm text-gray-600">Total Requests</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-green-600">{network.total_allocations || 0}</div>
                            <div className="text-sm text-gray-600">Allocations</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-blue-600">{network.total_messages || 0}</div>
                            <div className="text-sm text-gray-600">Messages</div>
                        </div>
                    </div>

                    {/* Recent Requests */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Recent Requests
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {recent_requests.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No requests yet</p>
                            ) : (
                                recent_requests.map(req => (
                                    <div key={req.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{req.resource_listing_title}</div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    {req.requesting_company_name} → {req.resource_company_name}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeClass(req.status)}`}>
                                                {req.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2 flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(req.requested_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Messages/Chats */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Recent Messages
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {recent_messages.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No messages yet</p>
                            ) : (
                                recent_messages.map(msg => (
                                    <div key={msg.id} className="border-l-4 border-primary-500 pl-3 py-2 bg-gray-50 rounded">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-sm text-gray-900">{msg.sender_company}</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(msg.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{msg.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
