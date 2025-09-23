'use client';

import { useEffect, useState } from 'react';

interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  notes: string;
  sessionType?: string;
  duration?: number;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllBookings = async () => {
    if (confirm('Are you sure you want to clear all bookings? This will keep only the example booking.')) {
      try {
        const response = await fetch('/api/bookings?action=clear-all', {
          method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
          await fetchBookings(); // Refresh the list
          alert('All bookings cleared!');
        }
      } catch (error) {
        console.error('Error clearing bookings:', error);
        alert('Error clearing bookings');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
          <p className="mt-2 text-gray-600">
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-600 mb-6">Once you book a tutoring session, it will appear here.</p>
            <a
              href="/find-tutors"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find Tutors
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.subject} Session
                    </h3>
                    <p className="text-sm text-gray-600">
                      Booking ID: {booking.id}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'CONFIRMED' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block">Start Time:</span>
                    <span className="font-medium">
                      {new Date(booking.startTime).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">End Time:</span>
                    <span className="font-medium">
                      {new Date(booking.endTime).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Total Amount:</span>
                    <span className="font-medium">
                      ${(booking.totalAmount / 100).toFixed(2)}
                    </span>
                  </div>
                  {booking.duration && (
                    <div>
                      <span className="text-gray-600 block">Duration:</span>
                      <span className="font-medium">
                        {booking.duration} hour{booking.duration !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  {booking.sessionType && (
                    <div>
                      <span className="text-gray-600 block">Session Type:</span>
                      <span className="font-medium capitalize">
                        {booking.sessionType}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600 block">Created:</span>
                    <span className="font-medium">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-gray-600 block text-sm">Notes:</span>
                    <p className="text-gray-900 mt-1">{booking.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center space-x-4">
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Bookings
          </button>
          <button
            onClick={clearAllBookings}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear All Bookings
          </button>
        </div>
      </div>
    </div>
  );
}
