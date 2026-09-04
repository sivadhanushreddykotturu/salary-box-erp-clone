import React from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { NotificationsView } from '@/components/notifications/NotificationsView';

export default function NotificationsPage() {
  return (
    <AdminShell>
      <NotificationsView />
    </AdminShell>
  );
}
