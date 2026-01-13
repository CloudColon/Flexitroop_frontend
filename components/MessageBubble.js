'use client';

export default function MessageBubble({ message, isOwn, isSequence }) {
    const timeString = new Date(message.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    return (
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} ${isSequence ? 'mt-1' : 'mt-4'}`}>
            {!isSequence && !isOwn && (
                <span className="text-xs text-gray-500 ml-1 mb-1 font-medium">
                    {message.sender_name} • {message.sender_company_name}
                </span>
            )}

            <div
                className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm relative group ${isOwn
                    ? 'bg-primary-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
            >
                <p className="whitespace-pre-wrap break-words leading-relaxed">{message.message}</p>

                <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isOwn ? 'text-primary-100' : 'text-gray-400'}`}>
                    <span>{timeString}</span>
                    {isOwn && (
                        <span>
                            {message.is_read ? (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                            ) : (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
