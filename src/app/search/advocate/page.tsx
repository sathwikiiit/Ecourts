'use client';

import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchCasesByAdvocate } from '@/app/actions';
import type { Case } from '@/lib/types';
import CaseSearchResults from '@/components/dashboard/case-search-results';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { districts, complexes } from '@/app/data';

export default function SearchByAdvocatePage() {
  const [advocateName, setAdvocateName] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [complexId, setComplexId] = useState('');
  const [stage, setStage] = useState<'PENDING' | 'DISPOSED' | 'BOTH'>('PENDING');
  const [results, setResults] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advocateName) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    const searchResults = await searchCasesByAdvocate({ name: advocateName, districtId, complexId, stage });
    setResults(searchResults);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Search by Advocate</CardTitle>
                <CardDescription>Find cases by the name of the advocate, with optional filters.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="space-y-4 mb-6">
                    <div>
                        <Label htmlFor="advocateName">Advocate Name *</Label>
                        <Input
                            id="advocateName"
                            type="text"
                            placeholder="Enter advocate name..."
                            value={advocateName}
                            onChange={(e) => setAdvocateName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="district">District</Label>
                            <Select value={districtId} onValueChange={setDistrictId}>
                                <SelectTrigger id="district">
                                    <SelectValue placeholder="All Districts" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Districts</SelectItem>
                                    {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="complex">Court Complex</Label>
                            <Select value={complexId} onValueChange={setComplexId}>
                                <SelectTrigger id="complex">
                                    <SelectValue placeholder="All Complexes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Complexes</SelectItem>
                                    {complexes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="stage">Case Stage</Label>
                            <Select value={stage} onValueChange={(v) => setStage(v as any)}>
                                <SelectTrigger id="stage">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="DISPOSED">Disposed</SelectItem>
                                    <SelectItem value="BOTH">Both</SelectItem>
                                </SelectContent>
                            </Select>
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
