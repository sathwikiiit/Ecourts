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

export default async function HomePage() {
  const upcomingHearings = await getUpcomingHearings();

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
          <h2 className="text-xl font-semibold font-headline">Upcoming Hearings</h2>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <UpcomingHearings initialHearings={upcomingHearings} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
