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
    if (!initialHearings) return [];
    const today = startOfToday();
    const futureDate = addWeeks(today, parseInt(weeksToShow, 10));
    return initialHearings.filter((hearing) => {
      const hearingDate = new Date(hearing.date);
      return isWithinInterval(hearingDate, { start: today, end: futureDate });
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [initialHearings, weeksToShow]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Display:</span>
          <Select value={weeksToShow} onValueChange={setWeeksToShow}>
              <SelectTrigger className="w-full">
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
      
      {filteredHearings.length > 0 ? (
        <div className="grid gap-2">
          {filteredHearings.map((hearing) => (
            <Card key={hearing.id} className="flex flex-col">
                <CardHeader className="p-4">
                    <CardTitle className="font-headline text-base">{hearing.type}</CardTitle>
                    <CardDescription className="flex items-center gap-2 pt-1 text-xs">
                        <Briefcase className="h-3.5 w-3.5" /> 
                        {hearing.case_title || `Case #${hearing.case_number}`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow space-y-2">
                    <div className="flex items-start gap-2 text-xs">
                        <CalendarDays className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">{format(new Date(hearing.date), 'E, MMM d, yyyy')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                        <Clock className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">{format(new Date(`1970-01-01T${hearing.time}`), 'h:mm a')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">{hearing.location}</p>
                        </div>
                    </div>
                </CardContent>
                <div className="px-4 pb-4">
                    <SyncDialog hearing={hearing}>
                        <Button className="w-full" size="sm">
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            Sync
                        </Button>
                    </SyncDialog>
                </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="col-span-full flex flex-col items-center justify-center py-10 text-center">
            <CardContent className='p-6'>
                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="mt-4 text-base font-semibold font-headline">No Upcoming Hearings</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                    There are no hearings scheduled in the selected timeframe.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
