import React from 'react';
import { Calendar } from 'lucide-react';

export default function UpcomingClasses() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
      <div className="space-y-4">
        {[
          { name: 'Yoga Flow', time: '09:00 AM', instructor: 'Sarah Johnson' },
          { name: 'Spinning', time: '02:00 PM', instructor: 'Mike Thompson' },
          { name: 'Boxing', time: '05:30 PM', instructor: 'Alex Rodriguez' },
        ].map((class_, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <div>
                <div className="font-medium">{class_.name}</div>
                <div className="text-sm text-gray-600">{class_.instructor}</div>
              </div>
            </div>
            <span className="text-sm text-gray-600">{class_.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}