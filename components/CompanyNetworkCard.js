'use client';

export default function CompanyNetworkCard({ network, currentCompanyId, onClick }) {
    // Determine which company to display (the other one)
    const isCompanyA = network.company_a_id === currentCompanyId;
    const displayCompanyName = isCompanyA ? network.company_b_name : network.company_a_name;
    const displayCompanyId = isCompanyA ? network.company_b_id : network.company_a_id;

    return (
        <div
            onClick={() => onClick(network)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer p-6 border border-gray-200 hover:border-primary-400"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{displayCompanyName}</h3>
                {network.nda_signed ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        <svg className=" w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        NDA Signed
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        NDA Pending
                    </span>
                )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-primary-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">{network.total_requests || 0}</div>
                    <div className="text-xs text-gray-600 mt-1">Requests</div>
                </div>
                <div className="text-center p-3 bg-green-50 roundedlg">
                    <div className="text-2xl font-bold text-green-600">{network.total_allocations || 0}</div>
                    <div className="text-xs text-gray-600 mt-1">Allocations</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{network.total_messages || 0}</div>
                    <div className="text-xs text-gray-600 mt-1">Messages</div>
                </div>
            </div>

            <div className="text-xs text-gray-500 border-t pt-3 space-y-1">
                <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    First interaction: {new Date(network.first_interaction_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Last interaction: {new Date(network.last_interaction_at).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
