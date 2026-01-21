import { UserRole } from "@/app/generated/prisma/enums";

export type UserModelType = {
  email: string;
  id: string;
  role: UserRole;
  companyName: string;
  contactInfo: {
    phone: string;
    address: string;
    contactPerson: string;
  } | null;
  capabilities: string[];
  isActive: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};
