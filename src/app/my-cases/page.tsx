import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

// This is mock data. In a real app, you would fetch this from a database.
const myCases = [
    { id: '1', title: 'State v. John Doe', case_number: 'CV-2023-1234', status: 'Open' },
    { id: '2', title: 'Smith vs. Acme Corp', case_number: 'CR-2024-0012', status: 'Pending' },
];

export default function MyCasesPage() {
  return (
    <div className="flex justify-center items-start min-h-screen bg-background p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Briefcase /> My Cases
          </CardTitle>
          <CardDescription>A list of cases you have saved.</CardDescription>
        </CardHeader>
        <CardContent>
          {myCases.length > 0 ? (
            <div className="space-y-4">
              {myCases.map((caseItem) => (
                <Card key={caseItem.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{caseItem.title}</p>
                      <p className="text-sm text-muted-foreground">{caseItem.case_number}</p>
                    </div>
                    <span className="text-sm font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{caseItem.status}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
                <p className="text-muted-foreground">You have not added any cases yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
