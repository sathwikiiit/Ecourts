'use client';

import { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchCasesByFilingNumber } from '@/lib/actions/search';
import { getStates, getDistricts, getComplexes } from '@/lib/actions/static';
import type { Case, District, Complex, State } from '@/lib/types';
import CaseSearchResults from '@/components/dashboard/case-search-results';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '@/components/ui/select';

export default function SearchByFilingNumberPage() {
  const [filingNumber, setFilingNumber] = useState('');
  const [filingYear, setFilingYear] = useState(new Date().getFullYear().toString());
  const [stateId, setStateId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [complexId, setComplexId] = useState('');
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
        setDistrictId('');
        setDistricts([]);
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
        setComplexId('');
        setComplexes([]);
        const complexesData = await getComplexes(districtId);
        setComplexes(complexesData);
        setLoadingComplexes(false);
    }
    loadComplexes();
  }, [districtId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filingNumber || !filingYear) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    const searchResults = await searchCasesByFilingNumber({filingNumber, filingYear, districtId, complexId});
    setResults(searchResults);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Search by Filing Number</CardTitle>
                <CardDescription>Find a case using its filing number, year, and optional filters.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="filingNumber">Filing Number *</Label>
                            <Input
                                id="filingNumber"
                                type="text"
                                placeholder="Enter filing number..."
                                value={filingNumber}
                                onChange={(e) => setFilingNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="filingYear">Filing Year *</Label>
                            <Input
                                id="filingYear"
                                type="text"
                                placeholder="Enter filing year..."
                                value={filingYear}
                                onChange={(e) => setFilingYear(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="state">State</Label>
                            <Select value={stateId} onValueChange={(value) => setStateId(value === 'all' ? '' : value)} disabled={loadingStates}>
                                <SelectTrigger id="state">
                                    <SelectValue placeholder={loadingStates ? "Loading..." : "Select State"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.length > 0 ? (
                                        <>
                                            <SelectItem value="all">All States</SelectItem>
                                            <SelectSeparator />
                                            {states.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                        </>
                                    ) : (
                                        <SelectItem value="none" disabled>No states found</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="district">District</Label>
                             <Select value={districtId} onValueChange={(value) => setDistrictId(value === 'all' ? '' : value)} disabled={!stateId || loadingDistricts}>
                                <SelectTrigger id="district">
                                    <SelectValue placeholder={loadingDistricts ? "Loading..." : "Select District"} />
                                </SelectTrigger>
                                <SelectContent>
                                     {districts.length > 0 ? (
                                        <>
                                            <SelectItem value="all">All Districts</SelectItem>
                                            <SelectSeparator />
                                            {districts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                        </>
                                     ) : (
                                        <SelectItem value="none" disabled>{stateId ? 'No districts found' : 'Select a state first'}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="complex">Court Complex</Label>
                            <Select value={complexId} onValueChange={(value) => setComplexId(value === 'all' ? '' : value)} disabled={!districtId || loadingComplexes}>
                                <SelectTrigger id="complex">
                                    <SelectValue placeholder={loadingComplexes ? "Loading..." : "Select Complex"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {complexes.length > 0 ? (
                                        <>
                                            <SelectItem value="all">All Complexes</SelectItem>
                                            <SelectSeparator />
                                            {complexes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                        </>
                                    ) : (
                                        <SelectItem value="none" disabled>{districtId ? 'No complexes found' : 'Select a district first'}</SelectItem>
                                    )}
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
