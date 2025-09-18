'use client';

import { Gavel, PlusCircle, Search, Users, Briefcase } from 'lucide-react';
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
  } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CaseSearch() {
    const pathname = usePathname();
  return (
    <div className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/my-cases" passHref>
                    <SidebarMenuButton tooltip="My Cases" isActive={pathname === '/my-cases'}>
                        <Briefcase />
                        <span>My Cases</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/my-cases/new" passHref>
                    <SidebarMenuButton tooltip="Add a new case" isActive={pathname === '/cases/new'}>
                        <PlusCircle />
                        <span>Add New Case</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/search/party" passHref>
                    <SidebarMenuButton tooltip="Search by Party" isActive={pathname === '/search/party'}>
                        <Users />
                        <span>Search by Party</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/search/advocate" passHref>
                    <SidebarMenuButton tooltip="Search by Advocate" isActive={pathname === '/search/advocate'}>
                        <Gavel />
                        <span>Search by Advocate</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/search/filing" passHref>
                    <SidebarMenuButton tooltip="Search by Filing No." isActive={pathname === '/search/filing'}>
                        <Search />
                        <span>Search by Filing No.</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
    </div>
  );
}
