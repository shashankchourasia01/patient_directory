'use client';
import React, { useCallback, useEffect, useState } from 'react';
import PatientCard from './PatientCard';
import { useDebounce } from './hooks/useDebounce';
import type { Patient } from '../types/patient';

type ApiResp = { data: Patient[]; total: number; page: number; limit: number };

export default function PatientDirectory() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [condition, setCondition] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'age'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (p: number, reset = false) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set('page', String(p));
        params.set('limit', String(limit));
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (condition) params.set('condition', condition);
        params.set('sortBy', sortBy);
        params.set('sortOrder', sortOrder);

        const res = await fetch(`/api/patients?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json: ApiResp = await res.json();
        if (reset) setPatients(json.data);
        else setPatients(prev => (p === 1 ? json.data : prev.concat(json.data)));
        setTotal(json.total);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, condition, sortBy, sortOrder, limit]
  );

  useEffect(() => {
    setPage(1);
    fetchPage(1, true);
  }, [debouncedSearch, condition, sortBy, sortOrder, fetchPage]);

  useEffect(() => {
    if (page === 1) return;
    fetchPage(page, false);
  }, [page, fetchPage]);

  const loadMore = () => {
    if (patients.length >= total) return;
    setPage(prev => prev + 1);
  };

  const clearFilters = () => {
    setSearch('');
    setCondition('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const sampleConditions = ['Fever', 'Rash', 'Sprained ankle', 'Headache'];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <header className="mb-6 text-center md:text-left">
        <h1 className="text-3xl font-bold text-sky-700">🩺 Patient Directory</h1>
        <div className="text-sm text-slate-500 mt-1">{total} Patient(s) found</div>
      </header>

      {/* Filters */}
      <section className="mb-6 flex flex-col md:flex-row md:items-center gap-4 bg-white shadow-sm rounded-xl p-4">
        <div className="flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by name, email, address, condition..."
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-sky-400"
          >
            <option value="">All conditions</option>
            {sampleConditions.map(c => (
              <option key={c} value={c.toLowerCase()}>{c}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'age')}
            className="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-sky-400"
          >
            <option value="name">Sort: Name</option>
            <option value="age">Sort: Age</option>
          </select>

          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="border rounded-lg px-3 py-2 shadow-sm hover:bg-sky-50 transition"
            title="Toggle order"
          >
            {sortOrder === 'asc' ? '⬆ Asc' : '⬇ Desc'}
          </button>

          <button
            onClick={clearFilters}
            className="text-sm underline text-slate-600 hover:text-sky-600"
          >
            Clear
          </button>
        </div>
      </section>

      {/* Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {patients.map(p => (
          <div
            key={p.id || Math.random()}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-4"
          >
            <PatientCard patient={p} />
          </div>
        ))}
      </section>

      {/* Footer / Pagination */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        {loading && <div className="text-slate-600 animate-pulse">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && patients.length < total && (
          <button
            onClick={loadMore}
            className="px-6 py-2 border rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition shadow-sm"
          >
            Load more ({patients.length}/{total})
          </button>
        )}

        {!loading && patients.length >= total && (
          <div className="text-slate-500">✅ All results loaded</div>
        )}
      </div>
    </div>
  );
}
