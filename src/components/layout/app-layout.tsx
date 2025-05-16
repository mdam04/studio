import type { ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Header } from './header';

interface AppLayoutProps {
  sidebarContent: ReactNode;
  children: ReactNode;
}

export function AppLayout({ sidebarContent, children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
          <SidebarRail />
          <SidebarHeader className="p-4">
            {/* Sidebar header content if any, or can be empty */}
          </SidebarHeader>
          <SidebarContent className="p-2 pt-0">
            {sidebarContent}
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 overflow-y-auto">
          <main className="container mx-auto max-w-5xl flex-1 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
