'use client';

import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchCases } from '@/app/actions';
import type { Case } from '@/lib/types';
import CaseSearchResults from '@/components/dashboard/case-search-results';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SearchByPartyPage() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    const searchResults = await searchCases(keyword);
    setResults(searchResults);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-background p-4">
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Search by Party Name</CardTitle>
                <CardDescription>Find cases by the name of a petitioner or respondent.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 mb-6">
                    <Input
                    type="text"
                    placeholder="Search by party name..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
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
