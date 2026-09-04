import { withTenantContext } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';

export interface GetNotificationsFilter {
  type?: NotificationType | 'ALL';
  branchId?: string;
  departmentId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateNotificationInput {
  employeeId?: string;
  branchId?: string;
  departmentId?: string;
  type: NotificationType;
  title: string;
  message?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
}

export class NotificationService {
  async getNotifications(companyId: string, filter?: GetNotificationsFilter) {
    return withTenantContext(companyId, async (tx) => {
      const where: any = { companyId };

      if (filter?.type && (filter.type as string) !== 'ALL') {
        where.type = filter.type;
      }
      if (filter?.branchId && filter.branchId !== 'ALL') {
        where.branchId = filter.branchId;
      }
      if (filter?.departmentId && filter.departmentId !== 'ALL') {
        where.departmentId = filter.departmentId;
      }
      if (filter?.search) {
        where.OR = [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { message: { contains: filter.search, mode: 'insensitive' } },
          { location: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      const notifications = await tx.notification.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeCode: true,
              avatarUrl: true,
              avatarColor: true,
              department: { select: { id: true, name: true } },
              branch: { select: { id: true, name: true } },
            },
          },
          branch: { select: { id: true, name: true } },
          department: { select: { id: true, name: true } },
        },
        orderBy: { timestamp: 'desc' },
        take: filter?.limit || 50,
        skip: filter?.offset || 0,
      });

      const unreadCount = await tx.notification.count({
        where: { companyId, isRead: false },
      });

      return {
        notifications,
        unreadCount,
        total: notifications.length,
      };
    });
  }

  async createNotification(companyId: string, input: CreateNotificationInput) {
    return withTenantContext(companyId, async (tx) => {
      return tx.notification.create({
        data: {
          companyId,
          employeeId: input.employeeId,
          branchId: input.branchId,
          departmentId: input.departmentId,
          type: input.type,
          title: input.title,
          message: input.message,
          location: input.location,
          latitude: input.latitude,
          longitude: input.longitude,
          photoUrl: input.photoUrl,
        },
        include: {
          employee: true,
          branch: true,
          department: true,
        },
      });
    });
  }

  async markAsRead(companyId: string, notificationId: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.notification.updateMany({
        where: { id: notificationId, companyId },
        data: { isRead: true },
      });
    });
  }

  async markAllAsRead(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.notification.updateMany({
        where: { companyId, isRead: false },
        data: { isRead: true },
      });
    });
  }
}

export const notificationService = new NotificationService();
