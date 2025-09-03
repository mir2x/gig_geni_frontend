import { ProfilePage } from '@/components/profile/ProfilePage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - GiG Geni',
  description: 'Manage your profile information and settings',
};

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}