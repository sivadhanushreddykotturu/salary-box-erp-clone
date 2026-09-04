import React from 'react';
import { AdminShell } from '@/components/layout/AdminShell';
import { AnnouncementsView } from '@/components/announcements/AnnouncementsView';

export default function AnnouncementsPage() {
  return (
    <AdminShell>
      <AnnouncementsView />
    </AdminShell>
  );
}
