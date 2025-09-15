'use client';

import { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchCasesByAdvocate } from '@/lib/actions/search';
import { getStates, getDistricts, getComplexes } from '@/lib/actions/static';
import type { Case, District, Complex, State } from '@/lib/types';
import CaseSearchResults from '@/components/dashboard/case-search-results';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '@/components/ui/select';

export default function SearchByAdvocatePage() {
  const [advocateName, setAdvocateName] = useState('');
  const [stateId, setStateId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [complexId, setComplexId] = useState('');
  const [stage, setStage] = useState<'PENDING' | 'DISPOSED' | 'BOTH'>('PENDING');
  const [results, setResults] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [complexes, setComplexes] = useState<Complex[]>([]);

  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingComplexes, setLoadingComplexes] = useState(false);

  useEffect(() => {
    async function loadStates() {
      setLoadingStates(true);
      const statesData = await getStates();
      setStates(statesData);
      setLoadingStates(false);
    }
    loadStates();
  }, []);

  useEffect(() => {
    async function loadDistricts() {
        if (!stateId) {
            setDistricts([]);
            setDistrictId('');
            return;
        }
        setLoadingDistricts(true);
        const districtsData = await getDistricts(stateId);
        setDistricts(districtsData);
        setLoadingDistricts(false);
    }
    loadDistricts();
  }, [stateId]);

  useEffect(() => {
    async function loadComplexes() {
        if (!districtId) {
            setComplexes([]);
            setComplexId('');
            return;
        }
        setLoadingComplexes(true);
        const complexesData = await getComplexes(districtId);
        setComplexes(complexesData);
        setLoadingComplexes(false);
    }
    loadComplexes();
  }, [districtId]);

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
                            <Label htmlFor="state">State</Label>
                            <Select value={stateId} onValueChange={(value) => setStateId(value === 'all' ? '' : value)} disabled={loadingStates}>
                                <SelectTrigger id="state">
                                    <SelectValue placeholder={loadingStates ? "Loading..." : "All States"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All States</SelectItem>
                                    <SelectSeparator />
                                    {states.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="district">District</Label>
                            <Select value={districtId} onValueChange={(value) => setDistrictId(value === 'all' ? '' : value)} disabled={!stateId || loadingDistricts}>
                                <SelectTrigger id="district">
                                    <SelectValue placeholder={loadingDistricts ? "Loading..." : "All Districts"} />
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
                             <Select value={complexId} onValueChange={(value) => setComplexId(value === 'all' ? '' : value)} disabled={!districtId || loadingComplexes}>
                                <SelectTrigger id="complex">
                                    <SelectValue placeholder={loadingComplexes ? "Loading..." : "All Complexes"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Complexes</SelectItem>
                                    <SelectSeparator />
                                    {complexes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
