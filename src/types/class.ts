export interface ClassFilters {
  category: string;
  difficulty: string;
  time: string;
}

export interface ClassItem {
  id: string;
  name: string;
  instructor: string;
  category: string;
  difficulty: string;
  start_time: string;
  end_time?: string;
  max_participants: number;
  location: string;
  class_bookings: ClassBooking[];
}

export interface ClassBooking {
  id: string;
  class_id: string;
  user_id: string;
  status: 'confirmed' | 'cancelled' | 'waitlist';
}