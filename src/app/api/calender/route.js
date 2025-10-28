import { NextResponse } from "next/server";
import { getCalendarText } from "@/lib/actions/calender";

export const runtime = "edge"; // optional — keeps it lightweight

export async function GET() {
  try {
    const icsContent = await getCalendarText();

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="case_calendar.ics"',
      },
    });
  } catch (error) {
    console.error("Error generating calendar:", error);
    return NextResponse.json(
      { error: "Failed to generate calendar feed" },
      { status: 500 }
    );
  }
}
