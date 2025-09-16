'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function HomePage() {

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="font-headline text-2xl font-bold">CourtSync</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
        <div className="p-4">
            <Link href="/cases/new" passHref>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Case
              </Button>
            </Link>
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <h2 className="text-xl font-semibold font-headline">Dashboard</h2>
        </header>
        <main className="flex-1 p-4 lg:p-6">
            <h1 className="text-2xl font-bold">Welcome to CourtSync</h1>
            <p className="text-muted-foreground">Select an option from the sidebar to get started.</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
