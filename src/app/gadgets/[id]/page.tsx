'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, ShoppingCart, Check, ArrowLeft, Share2, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import api from '../../../lib/axios';
import GadgetCard from '../../../components/GadgetCard';
import Link from 'next/link';

export default function GadgetDetails() {
  const { id } = useParams();
  const [gadget, setGadget] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/gadgets/${id}`)
        .then((res) => {
          setGadget(res.data.data);
          return api.get(`/gadgets?category=${res.data.data.category}&limit=4`);
        })
        .then((r) => {
          setRelated(r.data.data.filter((g: any) => g._id !== id));
        })
        .catch((err) => {
          setError('Failed to load gadget details');
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="h-96 bg-slate-200 rounded-card animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-slate-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
            <div className="h-12 bg-slate-200 rounded w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !gadget) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Gadget Not Found</h2>
        <p className="text-slate-600 mb-6">{error || 'The gadget you are looking for does not exist.'}</p>
        <Link href="/explore" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-800 transition">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-600 mb-8">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <Link href="/explore" className="hover:text-primary transition">Explore</Link>
        <span>/</span>
        <Link href={`/explore?category=${gadget.category}`} className="hover:text-primary transition">{gadget.category}</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate">{gadget.title}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="relative group">
          <div className="bg-neutral rounded-card overflow-hidden">
            <img
              src={gadget.image}
              alt={gadget.title}
              className="w-full h-96 md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
            {gadget.category}
          </span>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:scale-110 transition"
          >
            <Heart
              size={20}
              className={wishlisted ? 'text-red-500 fill-red-500' : 'text-slate-600'}
            />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-slate-500 mb-2">Brand: <span className="font-semibold text-slate-700">{gadget.brand}</span></p>
            <h1 className="text-4xl font-bold text-slate-800 mb-3">{gadget.title}</h1>
            <p className="text-slate-600 text-lg">{gadget.shortDesc}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.floor(gadget.rating) ? 'currentColor' : 'none'}
                  className={i < Math.floor(gadget.rating) ? '' : 'text-slate-300'}
                />
              ))}
            </div>
            <span className="text-slate-600 font-medium">({gadget.rating} / 5)</span>
            <span className="text-sm text-slate-500">• 128 reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <p className="text-5xl font-bold text-primary">${gadget.price}</p>
            {gadget.stock > 0 && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                In Stock ({gadget.stock})
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Quantity:</span>
            <div className="flex items-center border border-slate-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-slate-100 transition"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(gadget.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-slate-100 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition flex items-center justify-center gap-2">
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition">
              Buy Now
            </button>
          </div>

          {/* Benefits */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Truck size={18} className="text-secondary flex-shrink-0" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <RotateCcw size={18} className="text-secondary flex-shrink-0" />
              <span>30-day hassle-free returns</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Shield size={18} className="text-secondary flex-shrink-0" />
              <span>1-year manufacturer warranty</span>
            </div>
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 pt-4">
            <span className="text-sm text-slate-600">Share:</span>
            <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
              <Share2 size={16} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Description</h2>
        <div className="bg-neutral rounded-card p-6">
          <p className="text-slate-700 leading-relaxed">{gadget.fullDesc}</p>
        </div>
      </section>

      {/* Specifications */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Specifications</h2>
        <div className="bg-white rounded-card shadow-md border border-slate-200 overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-semibold text-slate-700 w-1/3">Brand</td>
                <td className="px-6 py-4 text-slate-600">{gadget.brand}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-semibold text-slate-700">Category</td>
                <td className="px-6 py-4 text-slate-600">{gadget.category}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-semibold text-slate-700">Price</td>
                <td className="px-6 py-4 font-bold text-primary">${gadget.price}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-semibold text-slate-700">Rating</td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(gadget.rating) ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span>{gadget.rating} / 5</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-semibold text-slate-700">Availability</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${gadget.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {gadget.stock > 0 ? `${gadget.stock} in stock` : 'Out of stock'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Customer Reviews</h2>
        <div className="bg-neutral rounded-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{gadget.rating}</div>
              <div className="flex text-yellow-500 justify-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(gadget.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-1">Based on 128 reviews</p>
            </div>
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{star} ★</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 5}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-600">
                    {star === 5 ? '70%' : star === 4 ? '20%' : '5%'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-slate-500 text-sm">
            Login to leave your review
          </p>
        </div>
      </section>

      {/* Related Gadgets */}
      {related.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Related Gadgets</h2>
            <Link href="/explore" className="text-primary font-medium hover:underline flex items-center gap-1">
              View All <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((g) => (
              <GadgetCard key={g._id} gadget={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}