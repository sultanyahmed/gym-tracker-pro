import React from 'react';
import { useAuthStore } from '../store/authStore';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileStats from '../components/profile/ProfileStats';
import NavigationMenu from '../components/NavigationMenu';

export default function Profile() {
  const { profile } = useAuthStore();

  return (
    <div className="space-y-6">
      <NavigationMenu />
      
      <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProfileForm />
        </div>
        <div>
          <ProfileStats />
        </div>
      </div>
    </div>
  );
}