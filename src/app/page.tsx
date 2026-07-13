'use client';

import { ArrowRight, Truck, Shield, Headphones, Zap, Award, Users, Package, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '../lib/axios';
import GadgetCard from '../components/GadgetCard';
import Link from 'next/link';

export default function Home() {
  const [gadgets, setGadgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api.get('/gadgets?limit=4')
      .then((res) => {
        setGadgets(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch gadgets:', error);
         // 401 error হলে
      if (error.response?.status === 401) {
        console.error('Authentication required! Check if route is protected.');
      }
        setGadgets([]);
        setLoading(false);
      });
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  const faqs = [
    { title: 'What is your return policy?', content: 'We offer a 30-day return policy on all products. Items must be in original condition.' },
    { title: 'Do you ship internationally?', content: 'Yes, we ship to over 50 countries worldwide. Shipping times vary by location.' },
    { title: 'Are your products authentic?', content: 'Absolutely. We are authorized retailers for all brands we carry. 100% genuine products guaranteed.' },
    { title: 'How can I track my order?', content: "Once shipped, you'll receive a tracking number via email to monitor your delivery." },
  ];

  return (
    <div>
      {/* HERO - 65vh */}
      <section className="h-[65vh] relative flex items-center bg-gradient-to-r from-primary-400 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-blue-800 space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Discover Premium <span className="text-secondary">Smart Gadgets</span>
            </h1>
            <p className="text-lg text-blue-600 font-extrabold ">
              Explore the latest technology and elevate <br /> your lifestyle with our curated collection of premium electronics.
            </p>
            <div className="flex gap-4">
              <Link
                href="/explore"
                className="px-6 py-3 bg-secondary text-black border-2 rounded-lg font-medium hover:bg-blue-600 transition flex items-center gap-2"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="hidden md:block relative h-96">
            <Image
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600"
              alt="Hero"
              fill
              className="rounded-card shadow-2xl object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Section 1: Features */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over $100' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure payment gateway' },
              { icon: Headphones, title: '24/7 Support', desc: 'Round the clock customer service' },
            ].map((f, i) => (
              <div key={i} className="rounded-card p-6 bg-neutral text-center hover:shadow-lg transition-shadow">
                <div className="bg-primary/10 p-4 rounded-full mb-4 inline-block">
                  <f.icon className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-xl mb-2 text-slate-800">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Categories */}
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Smartwatches', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
              { name: 'Headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
              { name: 'Laptops', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
              { name: 'Smartphones', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
            ].map((cat, i) => (
              <Link key={i} href="/explore" className="rounded-card overflow-hidden group bg-white shadow-md hover:shadow-xl transition">
                <div className="relative h-40">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center font-bold text-slate-800">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Trending Gadgets */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Trending Gadgets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-card p-4 bg-slate-100 animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-lg mb-4" />
                  <div className="h-4 bg-slate-200 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-slate-200 rounded mb-2 w-1/2" />
                  <div className="h-10 bg-slate-200 rounded mt-4" />
                </div>
              ))
            ) : gadgets.length > 0 ? (
              gadgets.map((g) => <GadgetCard key={g._id} gadget={g} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-blue-800 text-lg">No gadgets available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: Statistics */}
      <section className="py-16 bg-gray-100 text-blue-400">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-white">
          {[
            { icon: Users, num: '10K+', label: 'Happy Customers' },
            { icon: Package, num: '500+', label: 'Products' },
            { icon: Award, num: '99%', label: 'Satisfaction' },
            { icon: Zap, num: '24/7', label: 'Support' },
          ].map((s, i) => (
            <div key={i}>
              <s.icon size={40} className="mx-auto mb-3 text-secondary" />
              <div className="text-4xl font-bold mb-1">{s.num}</div>
              <div className="text-blue-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Johnson', role: 'Tech Enthusiast', text: 'Amazing quality and fast delivery. GadgetVerse is my go-to store for all electronics.' },
              { name: 'Michael Chen', role: 'Photographer', text: 'The customer service is outstanding. They helped me choose the perfect camera gear.' },
              { name: 'Emily Rodriguez', role: 'Student', text: 'Great prices and authentic products. Highly recommend to anyone looking for gadgets.' },
            ].map((t, i) => (
              <div key={i} className="rounded-card p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                <p className="text-slate-700 mb-4 italic">"{t.text}"</p>
                <div className="font-bold text-primary">{t.name}</div>
                <div className="text-sm text-slate-500">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Newsletter */}
      <section className="py-16 bg-white text-blue-400">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6">Get the latest updates on new products and exclusive offers.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-800 transition"
            >
              {subscribed ? '✓ Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>

      {/* Section 7: FAQ */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-card overflow-hidden hover:border-primary/30 transition">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-50 transition"
                >
                  <span className="font-semibold text-slate-800">{faq.title}</span>
                  <ChevronDown
                    size={20}
                    className={`text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-slate-600 border-t border-slate-100">
                    {faq.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}