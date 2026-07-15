'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import { Plus, Package } from 'lucide-react';

export default function AddItemPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  const onSubmit = async (data: any) => {
    try {
      setError('');
      setSuccess(false);
      await api.post('/gadgets', { 
        ...data, 
        price: Number(data.price), 
        stock: Number(data.stock) 
      });
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to add gadget');
    }
  };

  if (isLoading || !user) return null;

  const categories = ['Smartwatch', 'Headphones', 'Smartphone', 'Laptop', 'Earbuds', 'Tablet', 'Drone'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-full">
          <Package className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Add New Gadget</h1>
          <p className="text-slate-600 text-sm">Fill in the details to add a new gadget to your store</p>
        </div>
      </div>

      <div className="bg-white rounded-card shadow-xl border border-slate-100 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Apple Watch Series 9"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            {errors.title && <p className="text-red-500 text-sm">{String(errors.title.message)}</p>}
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Brief one-line description"
              {...register('shortDesc', { required: 'Short description is required' })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            {errors.shortDesc && <p className="text-red-500 text-sm">{String(errors.shortDesc.message)}</p>}
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Detailed description of the gadget..."
              {...register('fullDesc', { required: 'Full description is required' })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
            />
            {errors.fullDesc && <p className="text-red-500 text-sm">{String(errors.fullDesc.message)}</p>}
          </div>

          {/* Price & Stock */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price cannot be negative' }
                })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              {errors.price && <p className="text-red-500 text-sm">{String(errors.price.message)}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                {...register('stock', { 
                  required: 'Stock is required',
                  min: { value: 0, message: 'Stock cannot be negative' }
                })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              {errors.stock && <p className="text-red-500 text-sm">{String(errors.stock.message)}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white text-slate-700 cursor-pointer"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm">{String(errors.category.message)}</p>}
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">
              Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Apple, Sony, Samsung"
              {...register('brand', { required: 'Brand is required' })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            {errors.brand && <p className="text-red-500 text-sm">{String(errors.brand.message)}</p>}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register('image', { required: 'Image URL is required' })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            {errors.image && <p className="text-red-500 text-sm">{String(errors.image.message)}</p>}
          </div>

          {/* Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm font-medium">
              ✓ Gadget added successfully!
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-primary text-white rounded-lg font-bold hover:bg-primary-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={18} />
                Submit Gadget
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}