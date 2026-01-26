import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUserData } from "@/data-acess/DAO/userDAO";
import { UserProvider } from "@/providers/user-provider";

export default async function homeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserData();
  return (
    <UserProvider user={user}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
            </div>
          </header>
          <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
