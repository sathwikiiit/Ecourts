'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getUpcomingHearings } from '@/lib/actions/hearings';
import CaseSearch from '@/components/dashboard/case-search';
import UpcomingHearings from '@/components/dashboard/upcoming-hearings';
import { Logo } from '@/components/logo';
import { useEffect, useState } from 'react';
import type { Hearing } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PanelRight } from 'lucide-react';

export default function HomePage() {
  const [upcomingHearings, setUpcomingHearings] = useState<Hearing[]>([]);
  const [showHearings, setShowHearings] = useState(true);

  useEffect(() => {
    getUpcomingHearings().then(setUpcomingHearings);
  }, []);

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
          <CaseSearch />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <h2 className="text-xl font-semibold font-headline">Dashboard</h2>
          <div className='ml-auto'>
            <Button variant="outline" size="icon" onClick={() => setShowHearings(s => !s)}>
                <PanelRight />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">
            <h1 className="text-2xl font-bold">Welcome to CourtSync</h1>
            <p className="text-muted-foreground">Select an option from the sidebar to get started.</p>
        </main>
      </SidebarInset>
      {showHearings && (
        <Sidebar side="right" className="hidden lg:block" variant='sidebar' collapsible='none'>
            <SidebarHeader>
                <h2 className="text-xl font-semibold font-headline">Upcoming Hearings</h2>
            </SidebarHeader>
            <SidebarContent>
                <div className='p-2'>
                    <UpcomingHearings initialHearings={upcomingHearings} />
                </div>
            </SidebarContent>
        </Sidebar>
      )}
    </SidebarProvider>
  );
}
