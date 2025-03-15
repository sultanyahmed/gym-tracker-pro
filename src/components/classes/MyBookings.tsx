import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, MapPin } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import type { ClassBooking } from '../../types/class';

interface BookingWithClass extends ClassBooking {
  class_schedules: {
    name: string;
    instructor: string;
    start_time: string;
    location: string;
  };
}

export default function MyBookings() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<BookingWithClass[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First check if the location column exists in class_schedules
      const { data: columns, error: columnsError } = await supabase
        .from('class_schedules')
        .select('location')
        .limit(1);
      
      if (columnsError) {
        console.error('Error checking columns:', columnsError);
        // If there's an error, we'll try without the location column
        const { data, error } = await supabase
          .from('class_bookings')
          .select(`
            *,
            class_schedules (
              name,
              instructor,
              start_time
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'confirmed');

        if (error) throw error;
        setBookings(data || []);
      } else {
        // Location column exists, include it in the query
        const { data, error } = await supabase
          .from('class_bookings')
          .select(`
            *,
            class_schedules (
              name,
              instructor,
              start_time,
              location
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'confirmed');

        if (error) throw error;
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancellation = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('class_bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      // Refresh bookings after cancellation
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">My Bookings</h2>
        <div className="text-center py-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">My Bookings</h2>
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No bookings found</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{booking.class_schedules.name}</h3>
                  <p className="text-sm text-gray-600">{booking.class_schedules.instructor}</p>
                </div>
                <button 
                  onClick={() => handleCancellation(booking.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Cancel booking"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(new Date(booking.class_schedules.start_time))}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(booking.class_schedules.start_time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {booking.class_schedules.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {booking.class_schedules.location}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}