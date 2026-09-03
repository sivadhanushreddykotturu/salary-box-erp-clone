import { withTenantContext } from '@/lib/prisma';

export interface CreateLeadInput {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  leadValue?: number;
}

export interface CreateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  gstin?: string;
}

export class CRMService {
  async getLeads(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.cRMLead.findMany({
        where: { companyId },
        include: { activities: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  }

  async createLead(companyId: string, input: CreateLeadInput) {
    return withTenantContext(companyId, async (tx) => {
      return tx.cRMLead.create({
        data: {
          companyId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          companyName: input.companyName,
          leadValue: input.leadValue,
          status: 'NEW',
        },
      });
    });
  }

  async getCustomers(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.cRMCustomer.findMany({
        where: { companyId },
        include: { activities: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  }

  async createCustomer(companyId: string, input: CreateCustomerInput) {
    return withTenantContext(companyId, async (tx) => {
      return tx.cRMCustomer.create({
        data: {
          companyId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          companyName: input.companyName,
          gstin: input.gstin,
        },
      });
    });
  }
}

export const crmService = new CRMService();