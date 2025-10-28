'use server'
import { getCases } from "./cases";

export async function getCalendarText(): Promise<string> {
    const cases = await getCases();
    const events = cases.flatMap(caseItem => {
        if (caseItem.status !== 'Closed' && caseItem.history?.length) {
            const start = caseItem.history.at(0)?.nextDate;
            return start ? [{
                uid: caseItem.id,
                start: start.replace(/-/g, ''),
                end: start.replace(/-/g, ''),
                title: `Court Hearing: ${caseItem.title}`,
                description: `Case Number: ${caseItem.case_number}\nCNR: ${caseItem.cnr}\nStatus: ${caseItem.status}\n\nDetails:\n${caseItem.description}`
            }] : [];
        }
        return [];
    });

    const icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//MyLegalBuddy//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
    ];

    events.forEach(event => {
        icsLines.push('BEGIN:VEVENT');
        icsLines.push(`UID:${event.uid}`);
        icsLines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
        icsLines.push(`DTSTART;VALUE=DATE:${event.start.substring(0, 8)}`);
        icsLines.push(`DTEND;VALUE=DATE:${event.end.substring(0, 8)}`);
        icsLines.push(`SUMMARY:${event.title}`);
        icsLines.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
        icsLines.push('END:VEVENT');
    });

    icsLines.push('END:VCALENDAR');

    return icsLines.join('\n');
}