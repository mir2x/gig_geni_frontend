import { NotificationsPage } from '@/components/notifications/NotificationsPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications - GiG Geni',
  description: 'View and manage your notifications',
};

export default function Notifications() {
  return (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  );
}