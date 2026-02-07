"use client";
import { useUser } from "@/providers/user-provider";
import BrandHomePage from "./brand-home/BrandHomePage";
import ManufacturerHomePage from "./manufacturer-home/ManufacturerHomePage";
import AdminHomePage from "./admin-home/AdminHomePage";
import SuperAdminHomePage from "./super-admin-home/SuperAdminHomePage";

export default function UserHomePage() {
  const { user } = useUser();
  return (
    <div className=''>
      {user.role === "BRAND" && <BrandHomePage />}
      {user.role === "MANUFACTURER" && <ManufacturerHomePage />}
      {user.role === "ADMIN" && <AdminHomePage />}
      {user.role === "SUPER_ADMIN" && <SuperAdminHomePage />}
    </div>
  );
}
