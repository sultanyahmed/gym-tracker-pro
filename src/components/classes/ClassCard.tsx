import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { ClassItem } from '../../types/class';
import type { User } from '@supabase/supabase-js';

interface ClassCardProps {
  classItem: ClassItem;
  user: User | null;
  onUpdate: () => void;
}

export default function ClassCard({ classItem, user, onUpdate }: ClassCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBooking = async () => {
    if (!user) return;
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from('class_bookings')
        .insert({
          class_id: classItem.id,
          user_id: user.id,
          status: 'confirmed'
        });

      if (error) throw error;
      alert('Class booked successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error booking class:', error);
      alert('Failed to book class. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancellation = async () => {
    if (!user) return;
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from('class_bookings')
        .delete()
        .match({ class_id: classItem.id, user_id: user.id });

      if (error) throw error;
      alert('Class cancelled successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error cancelling class:', error);
      alert('Failed to cancel class. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isBooked = classItem.class_bookings?.some(
    booking => booking.user_id === user?.id && booking.status === 'confirmed'
  );
  const isFull = (classItem.class_bookings?.filter(b => b.status === 'confirmed').length || 0) >= classItem.max_participants;

  // Format time to display both start and end time
  const formatClassTime = () => {
    const startTime = new Date(classItem.start_time).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    if (classItem.end_time) {
      const endTime = new Date(classItem.end_time).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return `${startTime} - ${endTime}`;
    }
    
    return startTime;
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg">{classItem.name}</h3>
          <p className="text-gray-600">{classItem.instructor}</p>
        </div>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
          {classItem.category}
        </span>
      </div>
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(new Date(classItem.start_time))}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {formatClassTime()}
        </div>
      </div>
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {classItem.class_bookings?.filter(b => b.status === 'confirmed').length || 0}/{classItem.max_participants}
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {classItem.location}
        </div>
      </div>
      {isBooked ? (
        <button
          onClick={handleCancellation}
          disabled={isProcessing}
          className="mt-3 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Cancel Booking'}
        </button>
      ) : (
        <button
          onClick={handleBooking}
          disabled={isProcessing || isFull}
          className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : (isFull ? 'Class Full' : 'Book Class')}
        </button>
      )}
    </div>
  );
}