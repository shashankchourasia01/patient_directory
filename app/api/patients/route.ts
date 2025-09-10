import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = (url.searchParams.get('search') || '').trim().toLowerCase();
    const conditionParam = (url.searchParams.get('condition') || '').trim().toLowerCase();
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';
    const limit = Math.max(1, Number(url.searchParams.get('limit') || '12'));
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));

    const filePath = path.join(process.cwd(), 'data', 'data.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const all = JSON.parse(file) as any[]; // assume array of patient objects

    // Filtering
    const filtered = all.filter((p) => {
      // search across name, email, address, condition
      if (search) {
        const hay =
          ((p.name || '') + ' ' + (p.email || '') + ' ' + (p.address || '') + ' ' + (p.condition || ''))
            .toLowerCase();
        if (!hay.includes(search)) return false;
      }
      // condition filter: support comma separated exact match
      if (conditionParam) {
        const conditions = conditionParam.split(',').map(s => s.trim()).filter(Boolean);
        if (conditions.length > 0) {
          const pc = (p.condition || '').toLowerCase();
          if (!conditions.includes(pc)) return false;
        }
      }
      return true;
    });

    // Sorting
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      if (sortBy === 'age') {
        const av = Number(a.age || 0);
        const bv = Number(b.age || 0);
        return (av - bv) * multiplier;
      }
      // default: name (string)
      const an = (a.name || '').toString();
      const bn = (b.name || '').toString();
      return an.localeCompare(bn) * multiplier;
    });

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return NextResponse.json({ data, total, page, limit });
  } catch (err) {
    console.error('API /api/patients error:', err);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
