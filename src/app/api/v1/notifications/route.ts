import { NextRequest } from 'next/server';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { notificationService } from '@/services/notification.service';
import { jsonResponse, errorResponse } from '@/lib/response';
import { NotificationType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type') as NotificationType | 'ALL' | null;
    const branchId = searchParams.get('branchId') || undefined;
    const departmentId = searchParams.get('departmentId') || undefined;
    const search = searchParams.get('search') || undefined;

    const result = await notificationService.getNotifications(companyId, {
      type: type || undefined,
      branchId,
      departmentId,
      search,
    });

    return jsonResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();

    if (body.action === 'MARK_READ' && body.notificationId) {
      await notificationService.markAsRead(companyId, body.notificationId);
      return jsonResponse({ success: true }, 200, 'Notification marked as read');
    }

    if (body.action === 'MARK_ALL_READ') {
      await notificationService.markAllAsRead(companyId);
      return jsonResponse({ success: true }, 200, 'All notifications marked as read');
    }

    const notification = await notificationService.createNotification(companyId, body);
    return jsonResponse(notification, 201, 'Notification created successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
