'use client';

import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchCasesByFilingNumber } from '@/app/actions';
import type { Case } from '@/lib/types';
import CaseSearchResults from '@/components/dashboard/case-search-results';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function SearchByFilingNumberPage() {
  const [filingNumber, setFilingNumber] = useState('');
  const [filingYear, setFilingYear] = useState(new Date().getFullYear().toString());
  const [results, setResults] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filingNumber || !filingYear) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    const searchResults = await searchCasesByFilingNumber(filingNumber, filingYear);
    setResults(searchResults);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-background p-4">
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Search by Filing Number</CardTitle>
                <CardDescription>Find a case using its filing number and year.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <Label htmlFor="filingNumber">Filing Number</Label>
                            <Input
                                id="filingNumber"
                                type="text"
                                placeholder="Enter filing number..."
                                value={filingNumber}
                                onChange={(e) => setFilingNumber(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="filingYear">Filing Year</Label>
                            <Input
                                id="filingYear"
                                type="text"
                                placeholder="Enter filing year..."
                                value={filingYear}
                                onChange={(e) => setFilingYear(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        Search
                    </Button>
                </form>

                <CaseSearchResults loading={loading} results={results} searched={searched} />
            </CardContent>
        </Card>
    </div>
  );
}
