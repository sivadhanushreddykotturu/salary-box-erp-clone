import { NextRequest } from 'next/server';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { announcementService } from '@/services/announcement.service';
import { jsonResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  branchIds: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId') || undefined;

    const announcements = await announcementService.getAnnouncements(companyId, branchId);
    return jsonResponse(announcements);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const validated = createAnnouncementSchema.parse(body);

    const announcement = await announcementService.createAnnouncement(
      companyId,
      validated,
      user.userId
    );
    return jsonResponse(announcement, 201, 'Announcement sent successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
