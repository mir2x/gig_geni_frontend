import { SettingsPage } from '@/components/settings/SettingsPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - GiG Geni',
  description: 'Manage your account settings and preferences',
};

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  );
}