import { getCaseByCnr } from '@/lib/actions/cases';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export default async function CaseDetailsPage({ params }: { params: { cnr: string } }) {
  const caseDetails = await getCaseByCnr(params.cnr);

  if (!caseDetails) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
        <div className="w-full max-w-4xl mx-auto mb-4">
            <Link href="/my-cases" passHref>
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to My Cases
                </Button>
            </Link>
        </div>
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{caseDetails.title}</CardTitle>
                <CardDescription>{caseDetails.cnr}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Case Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Type:</strong> {caseDetails.details?.type}</p>
                            <p><strong>Filing Number:</strong> {caseDetails.details?.filingNumber}</p>
                            <p><strong>Filing Date:</strong> {new Date(caseDetails.details?.filingDate || '').toLocaleDateString()}</p>
                            <p><strong>Registration Number:</strong> {caseDetails.details?.registrationNumber}</p>
                            <p><strong>Registration Date:</strong> {new Date(caseDetails.details?.registrationDate || '').toLocaleDateString()}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Case Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Stage:</strong> {caseDetails.statusDetails?.caseStage}</p>
                            <p><strong>Disposal Nature:</strong> {caseDetails.statusDetails?.natureOfDisposal}</p>
                            <p><strong>Judge:</strong> {caseDetails.statusDetails?.courtNumberAndJudge}</p>
                            <p><strong>First Hearing:</strong> {new Date(caseDetails.statusDetails?.firstHearingDate || '').toLocaleDateString()}</p>
                            <p><strong>Next Hearing:</strong> {new Date(caseDetails.statusDetails?.nextHearingDate || '').toLocaleDateString()}</p>
                        </CardContent>
                    </Card>
                </div>

                <Accordion type="single" collapsible className="w-full" defaultValue="parties">
                    <AccordionItem value="parties">
                        <AccordionTrigger>Parties</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold">Petitioners</h4>
                                    <ul className="list-disc list-inside">
                                        {caseDetails.parties?.petitioners.map(p => <li key={p}>{p}</li>)}
                                    </ul>
                                    <h4 className="font-semibold mt-2">Advocates</h4>
                                    <ul className="list-disc list-inside">
                                        {caseDetails.parties?.petitionerAdvocates.map(a => <li key={a}>{a}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Respondents</h4>
                                    <ul className="list-disc list-inside">
                                        {caseDetails.parties?.respondents.map(r => <li key={r}>{r}</li>)}
                                    </ul>
                                    <h4 className="font-semibold mt-2">Advocates</h4>
                                    <ul className="list-disc list-inside">
                                        {caseDetails.parties?.respondentAdvocates.map(a => <li key={a}>{a}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="history">
                        <AccordionTrigger>History</AccordionTrigger>
                        <AccordionContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Business Date</TableHead>
                                        <TableHead>Judge</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Next Hearing</TableHead>
                                        <TableHead>Link</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {caseDetails.history?.map((h, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{new Date(h.businessDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{h.judge}</TableCell>
                                            <TableCell>{h.purpose}</TableCell>
                                            <TableCell>{new Date(h.nextDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button asChild variant="link" size="icon">
                                                    <a href={h.url} target="_blank" rel="noopener noreferrer"><LinkIcon className="h-4 w-4" /></a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="orders">
                        <AccordionTrigger>Orders</AccordionTrigger>
                        <AccordionContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order Date</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead>Link</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {caseDetails.orders?.map(o => (
                                        <TableRow key={o.number}>
                                            <TableCell>{new Date(o.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{o.name}</TableCell>
                                            <TableCell>
                                                <Button asChild variant="link" size="icon">
                                                    <a href={o.url} target="_blank" rel="noopener noreferrer"><LinkIcon className="h-4 w-4" /></a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </CardContent>
        </Card>
    </div>
  );
}