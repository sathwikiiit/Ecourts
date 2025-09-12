'use client';

import { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchCases } from '@/lib/actions/search';
import { getDistricts, getComplexes } from '@/lib/actions/static';
import type { Case, District, Complex } from '@/lib/types';
import CaseSearchResults from '@/components/dashboard/case-search-results';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '@/components/ui/select';

export default function SearchByPartyPage() {
  const [keyword, setKeyword] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [complexId, setComplexId] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [stage, setStage] = useState<'PENDING' | 'DISPOSED' | 'BOTH'>('PENDING');
  const [results, setResults] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [districts, setDistricts] = useState<District[]>([]);
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    async function loadFilters() {
      setLoadingFilters(true);
      const [districtsData, complexesData] = await Promise.all([getDistricts(), getComplexes()]);
      setDistricts(districtsData);
      setComplexes(complexesData);
      setLoadingFilters(false);
    }
    loadFilters();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    const searchResults = await searchCases({ name: keyword, districtId, complexId, year, stage });
    setResults(searchResults);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Search by Party Name</CardTitle>
                <CardDescription>Find cases by the name of a petitioner or respondent, with optional filters.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="space-y-4 mb-6">
                     <div>
                        <Label htmlFor="partyName">Party Name *</Label>
                        <Input
                            id="partyName"
                            type="text"
                            placeholder="Search by party name..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="district">District</Label>
                            <Select value={districtId} onValueChange={(value) => setDistrictId(value === 'all' ? '' : value)} disabled={loadingFilters}>
                                <SelectTrigger id="district">
                                    <SelectValue placeholder={loadingFilters ? "Loading..." : "All Districts"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Districts</SelectItem>
                                    <SelectSeparator />
                                    {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="complex">Court Complex</Label>
                            <Select value={complexId} onValueChange={(value) => setComplexId(value === 'all' ? '' : value)} disabled={loadingFilters}>
                                <SelectTrigger id="complex">
                                    <SelectValue placeholder={loadingFilters ? "Loading..." : "All Complexes"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Complexes</SelectItem>
                                    <SelectSeparator />
                                    {complexes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                type="text"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="stage">Case Stage</Label>
                            <Select value={stage} onValueChange={(v) => setStage(v as any)}>
                                <SelectTrigger id="stage">
                                    <SelectValue/>
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
