'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';

export default function ManagePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [gadgets, setGadgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
    if (user) {
      api.get('/gadgets/my')
        .then((res) => setGadgets(res.data.data))
        .catch((err) => console.error('Failed to fetch gadgets:', err))
        .finally(() => setLoading(false));
    }
  }, [user, isLoading, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gadget?')) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/gadgets/${id}`);
      setGadgets(gadgets.filter((g) => g._id !== id));
    } catch (err) {
      alert('Failed to delete gadget');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Package className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Manage Gadgets</h1>
            <p className="text-slate-600 text-sm">
              {gadgets.length} {gadgets.length === 1 ? 'gadget' : 'gadgets'} found
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/items/add')}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition"
        >
          + Add New
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-card shadow-md border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading gadgets...</p>
        </div>
      ) : gadgets.length === 0 ? (
        <div className="bg-white rounded-card shadow-md border border-slate-200 p-12 text-center">
          <AlertCircle className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No gadgets found</h3>
          <p className="text-slate-600 mb-6">You haven't added any gadgets yet.</p>
          <button
            onClick={() => router.push('/items/add')}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition"
          >
            Add Your First Gadget
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-card shadow-md border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {gadgets.map((g) => (
                  <tr key={g._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <img
                        src={g.image}
                        alt={g.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{g.title}</div>
                      <div className="text-sm text-slate-500">{g.brand}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {g.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary text-lg">${g.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/gadgets/${g._id}`)}
                          className="p-2 text-slate-600 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(g._id)}
                          disabled={deletingId === g._id}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === g._id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {gadgets.map((g) => (
              <div
                key={g._id}
                className="bg-white rounded-card shadow-md border border-slate-200 p-4"
              >
                <div className="flex gap-4">
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">{g.title}</h3>
                    <p className="text-sm text-slate-500">{g.brand}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {g.category}
                      </span>
                      <span className="font-bold text-primary">${g.price}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => router.push(`/gadgets/${g._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(g._id)}
                    disabled={deletingId === g._id}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                  >
                    {deletingId === g._id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}