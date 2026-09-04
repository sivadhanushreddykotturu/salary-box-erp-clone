import { withTenantContext } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';

export interface CreateAnnouncementInput {
  title: string;
  description: string;
  branchIds?: string[];
}

export class AnnouncementService {
  async getAnnouncements(companyId: string, branchId?: string) {
    return withTenantContext(companyId, async (tx) => {
      const announcements = await tx.announcement.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });

      if (!branchId || branchId === 'ALL') {
        return announcements;
      }

      // Filter for announcements targeting all branches (empty array) or specific branchId
      return announcements.filter(
        (a) => a.branchIds.length === 0 || a.branchIds.includes(branchId)
      );
    });
  }

  async createAnnouncement(
    companyId: string,
    input: CreateAnnouncementInput,
    userId?: string
  ) {
    return withTenantContext(companyId, async (tx) => {
      const announcement = await tx.announcement.create({
        data: {
          companyId,
          title: input.title,
          description: input.description,
          branchIds: input.branchIds || [],
          createdByUserId: userId,
        },
      });

      // Synchronize into Notification feed for team visibility
      await tx.notification.create({
        data: {
          companyId,
          type: NotificationType.ANNOUNCEMENT,
          title: `Announcement: ${input.title}`,
          message: input.description,
          location: input.branchIds && input.branchIds.length > 0 
            ? `Targeted Branches: ${input.branchIds.join(', ')}` 
            : 'All Branches',
        },
      });

      return announcement;
    });
  }

  async deleteAnnouncement(companyId: string, announcementId: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.announcement.deleteMany({
        where: { id: announcementId, companyId },
      });
    });
  }
}

export const announcementService = new AnnouncementService();
