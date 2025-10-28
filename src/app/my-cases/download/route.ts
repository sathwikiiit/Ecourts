import { getCalendarText } from "@/lib/actions/calender";
export const runtime = 'edge';
export async function GET() {
    const icsText = await getCalendarText();
    if (!icsText) {
        return new Response('No calendar data available', { status: 404 });
    }
    return new Response(icsText, {
        headers: {
            'Content-Type': 'text/calendar',
            'Content-Disposition': 'attachment; filename="calendar.ics"',
            'Cache-Control': 'no-cache'
        }
    });
}