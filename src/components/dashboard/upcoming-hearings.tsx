'use client';

import { useState, useMemo } from 'react';
import type { Hearing } from '@/lib/types';
import { addWeeks, isWithinInterval, startOfToday } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '../ui/button';
import { CalendarDays, Clock, MapPin, Briefcase, CalendarPlus } from 'lucide-react';
import { format } from 'date-fns';
import SyncDialog from './sync-dialog';

type UpcomingHearingsProps = {
  initialHearings: Hearing[];
};

export default function UpcomingHearings({ initialHearings }: UpcomingHearingsProps) {
  const [weeksToShow, setWeeksToShow] = useState('2');

  const filteredHearings = useMemo(() => {
    const today = startOfToday();
    const futureDate = addWeeks(today, parseInt(weeksToShow, 10));
    return initialHearings.filter((hearing) => {
      const hearingDate = new Date(hearing.date);
      return isWithinInterval(hearingDate, { start: today, end: futureDate });
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [initialHearings, weeksToShow]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Display:</span>
            <Select value={weeksToShow} onValueChange={setWeeksToShow}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select weeks to display" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">Next 1 Week</SelectItem>
                    <SelectItem value="2">Next 2 Weeks</SelectItem>
                    <SelectItem value="4">Next 4 Weeks</SelectItem>
                    <SelectItem value="8">Next 8 Weeks</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      
      {filteredHearings.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredHearings.map((hearing) => (
            <Card key={hearing.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-lg">{hearing.type}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                    <Briefcase className="h-4 w-4" /> 
                    {hearing.case_title || `Case #${hearing.case_number}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{format(new Date(hearing.date), 'EEEE, MMMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">Date</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{format(new Date(`1970-01-01T${hearing.time}`), 'h:mm a')}</p>
                    <p className="text-sm text-muted-foreground">Time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{hearing.location}</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                <SyncDialog hearing={hearing}>
                    <Button className="w-full">
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Sync to Calendar
                    </Button>
                </SyncDialog>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="col-span-full flex flex-col items-center justify-center py-20">
            <CalendarDays className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold font-headline">No Upcoming Hearings</h3>
            <p className="mt-2 text-center text-muted-foreground">
                There are no hearings scheduled in the selected timeframe. <br />
                Try selecting a wider date range or searching for a specific case.
            </p>
        </Card>
      )}
    </div>
  );
}
