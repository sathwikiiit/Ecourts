'use client';

import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchCasesByAdvocate } from '@/app/actions';
import type { Case } from '@/lib/types';
import CaseSearchResults from '@/components/dashboard/case-search-results';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SearchByAdvocatePage() {
  const [advocateName, setAdvocateName] = useState('');
  const [results, setResults] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advocateName) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    const searchResults = await searchCasesByAdvocate(advocateName);
    setResults(searchResults);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-background p-4">
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Search by Advocate</CardTitle>
                <CardDescription>Find cases by the name of the advocate.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 mb-6">
                    <Input
                    type="text"
                    placeholder="Enter advocate name..."
                    value={advocateName}
                    onChange={(e) => setAdvocateName(e.target.value)}
                    />
                    <Button type="submit" size="icon" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <Search />}
                    </Button>
                </form>

                <CaseSearchResults loading={loading} results={results} searched={searched} />
            </CardContent>
        </Card>
    </div>
  );
}
