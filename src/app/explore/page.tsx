'use client';

import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X, Package } from 'lucide-react';
import api from '../../lib/axios';
import GadgetCard from '../../components/GadgetCard';

interface Gadget {
  _id: string;
  title: string;
  shortDesc: string; 
  image: string;
  price: number;
  rating: number;
  category: string;
  brand: string;  
}

export default function ExplorePage() {
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState('default');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'all',
    'Smartwatch',
    'Headphones',
    'Smartphone',
    'Laptop',
    'Earbuds',
    'Tablet',
    'Drone',
  ];

  // Reset page whenever filter changes
  useEffect(() => {
    setPage(1);
  }, [search, category, minPrice, maxPrice, sort]);

  useEffect(() => {
    const fetchGadgets = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (search.trim()) {
          params.append('search', search.trim());
        }

        if (category !== 'all') {
          params.append('category', category);
        }

        params.append('minPrice', String(minPrice));
        params.append('maxPrice', String(maxPrice));

        if (sort !== 'default') {
          params.append('sort', sort);
        }

        params.append('page', String(page));
        params.append('limit', '8');

        const res = await api.get(`/gadgets?${params.toString()}`);

        setGadgets(res.data?.data || []);
        setTotalPages(res.data?.pagination?.pages || 1);
        setTotalResults(res.data?.pagination?.total || 0);
      } catch (error) {
        console.error('Failed to fetch gadgets:', error);
        setGadgets([]);
        setTotalPages(1);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchGadgets();
  }, [search, category, minPrice, maxPrice, sort, page]);

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setMinPrice(0);
    setMaxPrice(2000);
    setSort('default');
  };

  const hasActiveFilters =
    search || category !== 'all' || minPrice > 0 || maxPrice < 2000 || sort !== 'default';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Explore Gadgets</h1>
        <p className="text-slate-600">
          Discover our collection of premium smart gadgets and electronics
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 p-6 rounded-card mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary-800 font-medium flex items-center gap-1"
            >
              <X size={14} />
              Clear All
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search gadgets by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Price Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max={maxPrice}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                placeholder="Min"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                min={minPrice}
                max="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                placeholder="Max"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>
            <p className="text-xs text-slate-500">
              ${minPrice} - ${maxPrice}
            </p>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {!loading && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-slate-800">{gadgets.length}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalResults}</span> gadgets
          </p>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-card border border-slate-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="h-10 bg-slate-200 rounded w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Grid */}
          {gadgets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gadgets.map((gadget) => (
                <GadgetCard key={gadget._id} gadget={gadget} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-card border border-slate-200 p-12 text-center">
              <Package className="mx-auto text-slate-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No gadgets found</h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      page === pageNum
                        ? 'bg-primary text-white'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}