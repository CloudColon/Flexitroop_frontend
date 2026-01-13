'use client';

import { useState, useEffect, useRef } from 'react';
import { messageAPI } from '@/lib/api';
import styles from '@/styles/ChatOverlay.module.css';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

export default function ChatOverlay({
    resourceRequestId,
    isOpen,
    onToggle,
    recipientCompanyName,
    currentUserCompanyId
}) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const pollingInterval = useRef(null);

    // Fetch messages on mount and when request ID changes
    useEffect(() => {
        if (resourceRequestId) {
            fetchMessages(0, true);
            fetchUnreadCount();

            // Start polling for new messages every 10 seconds
            pollingInterval.current = setInterval(() => {
                if (isOpen) {
                    fetchNewMessages();
                } else {
                    fetchUnreadCount();
                }
            }, 10000);
        }

        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [resourceRequestId, isOpen]);

    // Scroll to bottom when messages change (if it's a new message or initial load)
    useEffect(() => {
        if (page === 0) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Mark messages as read when overlay is opened
    useEffect(() => {
        if (isOpen && resourceRequestId) {
            markAllAsRead();
        }
    }, [isOpen, resourceRequestId]);

    const fetchMessages = async (offset = 0, reset = false) => {
        try {
            if (reset) setLoading(true);

            const response = await messageAPI.getByRequestPaginated(resourceRequestId, null, 20, offset);

            if (reset) {
                setMessages(response.data.results);
            } else {
                setMessages(prev => [...response.data.results, ...prev]);
            }

            setHasMore(response.data.has_more);
            setPage(prev => reset ? 0 : prev + 1);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            if (reset) setLoading(false);
        }
    };

    const fetchNewMessages = async () => {
        try {
            // Just fetch the latest page to check for new messages
            // In a real app, we'd use a cursor or timestamp
            const response = await messageAPI.getByRequestPaginated(resourceRequestId, null, 20, 0);

            // Simple diff check - if latest message ID is different
            if (response.data.results.length > 0) {
                const latestMsg = response.data.results[response.data.results.length - 1];
                const currentLatest = messages.length > 0 ? messages[messages.length - 1] : null;

                if (!currentLatest || latestMsg.id !== currentLatest.id) {
                    // We have new messages, update the list
                    // This is a simplified approach; ideally we'd merge intelligently
                    setMessages(response.data.results);
                    if (isOpen) markAllAsRead();
                }
            }
        } catch (err) {
            console.error('Failed to fetch new messages:', err);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await messageAPI.getUnreadByRequest(resourceRequestId);
            setUnreadCount(response.data.unread_count);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await messageAPI.markAllRead(resourceRequestId);
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark messages as read:', err);
        }
    };

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        setSending(true);
        try {
            const response = await messageAPI.create({
                resource_request: resourceRequestId,
                message: text.trim(),
            });

            // Add new message to list immediately
            const newMessage = {
                ...response.data,
                is_sender: true // We just sent it
            };

            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
        } catch (err) {
            console.error('Failed to send message:', err);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScroll = (e) => {
        // Load more messages when scrolled to top
        if (e.target.scrollTop === 0 && hasMore && !loading) {
            // Save current scroll height to restore position after loading
            const scrollHeight = e.target.scrollHeight;

            fetchMessages((page + 1) * 20).then(() => {
                // Restore scroll position
                if (messagesContainerRef.current) {
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - scrollHeight;
                }
            });
        }
    };

    return (
        <>
            {/* Minimized Chat Button (Mobile/Tablet or when closed) */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="fixed bottom-6 right-6 z-40 bg-white text-primary-600 p-4 rounded-full shadow-lg border border-primary-100 hover:bg-primary-50 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                    <div className="relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                    <span className="font-medium hidden sm:inline">Message {recipientCompanyName}</span>
                </button>
            )}

            {/* Chat Overlay Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200 ${styles.overlay} ${isOpen ? styles.overlayVisible : styles.overlayHidden}`}
            >
                {/* Header */}
                <div className={`px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-white z-10 ${styles.glass}`}>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                                {recipientCompanyName?.charAt(0) || 'C'}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 leading-tight">{recipientCompanyName}</h3>
                            <p className="text-xs text-gray-500">Resource Partner</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggle}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div
                    ref={messagesContainerRef}
                    className={`flex-1 overflow-y-auto p-4 bg-gray-50 ${styles.messagesContainer}`}
                    onScroll={handleScroll}
                >
                    {loading && page === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <>
                            {hasMore && (
                                <div className="text-center py-2">
                                    <button
                                        onClick={() => fetchMessages((page + 1) * 20)}
                                        className="text-xs text-primary-600 hover:underline"
                                    >
                                        Load older messages
                                    </button>
                                </div>
                            )}

                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="font-medium">No messages yet</p>
                                    <p className="text-sm text-center max-w-xs">Start the conversation with {recipientCompanyName} about this resource request.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((msg, index) => {
                                        // Check if previous message was from same sender to group them
                                        const isSequence = index > 0 && messages[index - 1].sender === msg.sender;
                                        return (
                                            <MessageBubble
                                                key={msg.id}
                                                message={msg}
                                                isOwn={msg.is_sender}
                                                isSequence={isSequence}
                                            />
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <ChatInput onSend={handleSendMessage} disabled={sending} />
                </div>
            </div>
        </>
    );
}
