'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Truck,
  Shield,
  Headphones,
  Zap,
  Award,
  Users,
  Package,
  ChevronDown,
  Star,
  Search,
  Heart,
  Eye,
  Clock,
  Sparkles,
  Filter,
  Check,
  Copy,
  Plus,
  Minus,
  X,
  Grid,
  List as ListIcon,
  ShoppingBag,
  TrendingUp,
  Flame,
  ChevronRight,
  MessageSquarePlus,
  Tag
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

// Toast Notification Type
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info';
}

const FALLBACK_GADGET_IMAGE = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600';

function SafeGadgetImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_GADGET_IMAGE);

  useEffect(() => {
    setImgSrc(src || FALLBACK_GADGET_IMAGE);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (imgSrc !== FALLBACK_GADGET_IMAGE) {
          setImgSrc(FALLBACK_GADGET_IMAGE);
        }
      }}
      className={className}
    />
  );
}

interface Gadget {
  _id: string;
  title: string;
  shortDesc: string;
  fullDesc?: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  brand: string;
  stock?: number;
}

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  date: string;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  // State Management
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [priceRange, setPriceRange] = useState<'all' | 'under100' | '100to500' | 'over500'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Interactive UI States
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewGadget, setQuickViewGadget] = useState<Gadget | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [activeHeroTab, setActiveHeroTab] = useState(0);
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [allFaqsExpanded, setAllFaqsExpanded] = useState(false);
  
  // Newsletter & Promo
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Timeframe for Analytics
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'7d' | '30d' | '1y'>('30d');

  // Customer Reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Tech Enthusiast',
      rating: 5,
      text: 'Amazing build quality and next-day express delivery. GadgetVerse is my go-to tech hub for all electronics.',
      date: '2 days ago'
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Professional Photographer',
      rating: 5,
      text: 'The 24/7 technical customer support is outstanding. They helped me choose the perfect audio monitors and drone kit.',
      date: '1 week ago'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Computer Science Student',
      rating: 5,
      text: 'Competitive student pricing and 100% authentic genuine gadgets with official warranty coverage. Highly recommended!',
      date: '2 weeks ago'
    },
  ]);
  const [reviewRatingFilter, setReviewRatingFilter] = useState<'all' | 5 | 4>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', role: '', rating: 5, text: '' });

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Real-time Countdown Timer for Flash Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 24, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Gadgets from Backend API
  useEffect(() => {
    setLoading(true);
    api.get('/gadgets?limit=12')
      .then((res) => {
        setGadgets(res.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch gadgets:', error);
        setGadgets([]);
        setLoading(false);
      });
  }, []);

  // Hero Featured Slides
  const heroSlides = [
    {
      title: 'Apple Watch Series 9',
      tagline: 'Precision Health & Smart Living',
      desc: 'Featuring always-on Retina OLED, S9 SiP chip, and Double Tap gesture tracking. Elevate your everyday fitness.',
      price: 399,
      badge: 'Bestseller of the Week',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
      specs: ['Always-On Retina', 'Blood Oxygen & ECG', 'Up to 36h Battery']
    },
    {
      title: 'Sony WH-1000XM5',
      tagline: 'Industry-Leading Noise Cancellation',
      desc: 'Magnificent sound with dual processors, 8 microphones, and ultra-comfortable lightweight design.',
      price: 349,
      badge: 'Editor’s Choice',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      specs: ['Auto NC Optimizer', 'Hi-Res Audio Wireless', '30-Hour Battery Life']
    },
    {
      title: 'Dell XPS 15 InfinityEdge',
      tagline: 'Extreme Performance for Creators',
      desc: 'Stunning 4K OLED touch display, Intel Core i9 processor, and aerospace-inspired carbon fiber finish.',
      price: 1899,
      badge: 'Premium Flagship',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      specs: ['4K OLED Touch', 'Intel i9 & RTX 4070', '64GB Fast DDR5']
    }
  ];

  // Dynamic Categories extracted from items + defaults
  const categories = useMemo(() => {
    const list = Array.from(new Set(gadgets.map((g) => g.category))).filter(Boolean);
    return ['All', ...list];
  }, [gadgets]);

  // Filtered and Sorted Gadgets
  const filteredGadgets = useMemo(() => {
    let result = [...gadgets];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.shortDesc?.toLowerCase().includes(q) ||
          g.brand?.toLowerCase().includes(q)
      );
    }

    // Price range filter
    if (priceRange === 'under100') {
      result = result.filter((g) => g.price < 100);
    } else if (priceRange === '100to500') {
      result = result.filter((g) => g.price >= 100 && g.price <= 500);
    } else if (priceRange === 'over500') {
      result = result.filter((g) => g.price > 500);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [gadgets, selectedCategory, searchQuery, priceRange, sortBy]);

  // Wishlist toggle
  const toggleWishlist = (id: string, title: string) => {
    if (wishlist.includes(id)) {
      setWishlist((prev) => prev.filter((item) => item !== id));
      addToast(`Removed "${title}" from wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, id]);
      addToast(`Added "${title}" to wishlist ❤️`);
    }
  };

  // Add to cart simulation
  const handleAddToCart = (gadget: Gadget, qty = 1) => {
    addToast(`Added ${qty} × "${gadget.title}" to cart! 🛍️`);
    if (quickViewGadget) setQuickViewGadget(null);
  };

  // Analytics Dynamic Data based on Timeframe
  const chartData = useMemo(() => {
    if (analyticsTimeframe === '7d') {
      return [
        { label: 'Mon', sales: 2100, orders: 140 },
        { label: 'Tue', sales: 2800, orders: 190 },
        { label: 'Wed', sales: 3400, orders: 230 },
        { label: 'Thu', sales: 2900, orders: 180 },
        { label: 'Fri', sales: 4200, orders: 290 },
        { label: 'Sat', sales: 5100, orders: 350 },
        { label: 'Sun', sales: 4800, orders: 310 },
      ];
    } else if (analyticsTimeframe === '1y') {
      return [
        { label: 'Q1', sales: 18500, orders: 1250 },
        { label: 'Q2', sales: 24200, orders: 1680 },
        { label: 'Q3', sales: 31000, orders: 2150 },
        { label: 'Q4', sales: 42500, orders: 2980 },
      ];
    }
    // Default 30d monthly
    return [
      { label: 'Week 1', sales: 4000, orders: 240 },
      { label: 'Week 2', sales: 5200, orders: 320 },
      { label: 'Week 3', sales: 6100, orders: 390 },
      { label: 'Week 4', sales: 7400, orders: 480 },
    ];
  }, [analyticsTimeframe]);

  const categoryDistribution = [
    { name: 'Smartwatch', value: 32, color: '#7C3AED' },
    { name: 'Headphones', value: 26, color: '#06B6D4' },
    { name: 'Laptop', value: 22, color: '#EC4899' },
    { name: 'Smartphone', value: 20, color: '#F59E0B' },
  ];

  // FAQs
  const allFaqs = [
    {
      category: 'Shipping',
      title: 'What is your delivery timeframe and shipping rates?',
      content: 'We provide free standard shipping worldwide on orders above $100. Deliveries within metropolitan zones typically arrive in 2–3 business days with active live GPS parcel tracking.'
    },
    {
      category: 'Returns',
      title: 'What is the 30-day return & refund guarantee?',
      content: 'Enjoy peace of mind with our no-hassle 30-day return policy. If you are not 100% satisfied with your gadget, return it in original packaging for a full refund or direct exchange.'
    },
    {
      category: 'Warranty',
      title: 'Are products authentic with official warranty?',
      content: 'Every gadget sold on GadgetVerse is 100% genuine and comes directly from authorized brand distributors. All devices include a minimum 1 to 2-year official manufacturer warranty.'
    },
    {
      category: 'Orders',
      title: 'How can I monitor and track my delivery live?',
      content: 'As soon as your shipment departs our automated warehouse, you will receive an SMS and email notification with an instant tracking link to trace your delivery step-by-step.'
    },
    {
      category: 'Security',
      title: 'Which payment methods and security protocols are used?',
      content: 'We support all major credit cards, Google Pay, Apple Pay, PayPal, and verified bank transfers. All transactions are protected by bank-level 256-bit SSL encryption.'
    }
  ];

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return allFaqs;
    const q = faqSearch.toLowerCase();
    return allFaqs.filter(
      (f) => f.title.toLowerCase().includes(q) || f.content.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    );
  }, [faqSearch]);

  // Newsletter Submit
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'info');
      return;
    }
    setSubscribed(true);
    addToast('🎉 Welcome to the Club! Enjoy your 20% discount code: GADGET2026');
  };

  const copyCoupon = () => {
    navigator.clipboard.writeText('GADGET2026');
    setCopiedCode(true);
    addToast('Discount code "GADGET2026" copied to clipboard! 📋');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) {
      addToast('Please fill in your name and comment.', 'info');
      return;
    }
    const created: Review = {
      id: Math.random().toString(36).substring(2, 9),
      name: newReview.name,
      role: newReview.role || 'Verified Customer',
      rating: newReview.rating,
      text: newReview.text,
      date: 'Just now'
    };
    setReviews([created, ...reviews]);
    setShowReviewModal(false);
    setNewReview({ name: '', role: '', rating: 5, text: '' });
    addToast('🌟 Thank you! Your review has been published dynamically.');
  };

  const filteredReviews = useMemo(() => {
    if (reviewRatingFilter === 'all') return reviews;
    return reviews.filter((r) => r.rating === reviewRatingFilter);
  }, [reviews, reviewRatingFilter]);

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-800">
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all transform duration-300 ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-700'
                : 'bg-primary text-white border-primary-600'
            }`}
          >
            <Sparkles size={16} className="text-amber-400 shrink-0" />
            <span>{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-2 hover:opacity-75 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Top Dynamic Promo Bar */}
      <div className="bg-gradient-to-r from-primary via-purple-700 to-indigo-800 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Flame size={12} className="text-amber-300" /> Flash Promo
            </span>
            <span>Worldwide Free Express Shipping on orders over $100!</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-purple-200">
              Sale ends in:{' '}
              <strong className="text-white font-mono bg-black/20 px-2 py-0.5 rounded">
                {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
                {String(timeLeft.seconds).padStart(2, '0')}s
              </strong>
            </span>
            <button
              onClick={() => {
                const el = document.getElementById('products-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="underline text-amber-300 hover:text-white font-semibold cursor-pointer"
            >
              Shop Deals
            </button>
          </div>
        </div>
      </div>

      {/* Personalized Welcome Banner if User is Logged In */}
      {user && (
        <section className="bg-gradient-to-r from-purple-50/80 via-blue-50/80 to-white border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary text-white font-bold flex items-center justify-center shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">VIP Member Area</p>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Welcome back, <span className="text-primary">{user.name || user.email}</span>! 👋
                </h3>
              </div>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center gap-2">
              <Link
                href="/items/add"
                className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-600 transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus size={14} /> Add Gadget
              </Link>
              <Link
                href="/items/manage"
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition shadow-xs"
              >
                Manage Listings
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* HERO SECTION - Dynamic Tabs & Real-time Interactive Showcase */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-slate-50 border-b border-slate-200/60 py-12 lg:py-16">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading & Live Quick Search */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                <Sparkles size={14} className="text-primary" />
                Next-Gen Electronics Collection 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Discover Smart <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-secondary">
                  High-Performance
                </span>{' '}
                Gadgets
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Elevate your productivity, entertainment, and lifestyle with curated intelligent electronics, verified by top tech enthusiasts.
              </p>

              {/* Dynamic Live Search Bar in Hero */}
              <div className="relative max-w-lg">
                <div className="flex items-center bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition">
                  <div className="pl-3 text-slate-400">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search smartwatches, laptops, audio..."
                    className="w-full px-3 py-2 text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-slate-400 hover:text-slate-600 mr-1 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const el = document.getElementById('products-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-600 text-white rounded-lg text-sm font-semibold transition shadow-md shadow-primary/25 cursor-pointer shrink-0"
                  >
                    Search
                  </button>
                </div>

                {/* Quick categories jump */}
                <div className="flex items-center gap-2 mt-3 flex-wrap text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Trending:</span>
                  {['Smartwatch', 'Headphones', 'Laptop', 'Smartphone'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        const el = document.getElementById('products-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-primary hover:text-white rounded-md border border-slate-200 transition font-medium cursor-pointer shadow-2xs"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Trust Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/70 max-w-lg">
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-extrabold text-slate-900">500+</p>
                  <p className="text-xs text-slate-500 font-medium">Curated Items</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-extrabold text-primary">4.9 ★</p>
                  <p className="text-xs text-slate-500 font-medium">2,800+ Reviews</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-extrabold text-emerald-600">99.8%</p>
                  <p className="text-xs text-slate-500 font-medium">Satisfied Orders</p>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Featured Spotlight Carousel Card */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 relative overflow-hidden">
                {/* Carousel Tab Switchers */}
                <div className="flex gap-2 mb-4 pb-2 border-b border-slate-100 overflow-x-auto">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveHeroTab(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeHeroTab === idx
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {slide.title.split(' ')[0]} {slide.title.split(' ')[1] || ''}
                    </button>
                  ))}
                </div>

                {/* Active Slide Content */}
                <div className="grid sm:grid-cols-2 gap-6 items-center">
                  <div className="relative h-60 sm:h-72 rounded-xl overflow-hidden bg-slate-50 shadow-inner group">
                    <Image
                      src={heroSlides[activeHeroTab].image}
                      alt={heroSlides[activeHeroTab].title}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md">
                      {heroSlides[activeHeroTab].badge}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">
                        {heroSlides[activeHeroTab].tagline}
                      </p>
                      <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                        {heroSlides[activeHeroTab].title}
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed mt-2 line-clamp-3">
                        {heroSlides[activeHeroTab].desc}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      {heroSlides[activeHeroTab].specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Check size={14} className="text-emerald-500 shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-baseline gap-3">
                      <span className="text-3xl font-black text-slate-900">
                        ${heroSlides[activeHeroTab].price}
                      </span>
                      <span className="text-sm line-through text-slate-400 font-medium">
                        ${heroSlides[activeHeroTab].price + 80}
                      </span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded">
                        Save $80
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          const matched = gadgets.find((g) =>
                            g.title.toLowerCase().includes(heroSlides[activeHeroTab].title.toLowerCase().split(' ')[0])
                          );
                          if (matched) {
                            setQuickViewGadget(matched);
                          } else {
                            addToast(`Exploring ${heroSlides[activeHeroTab].title}`);
                            router.push('/explore');
                          }
                        }}
                        className="flex-1 py-2.5 bg-primary hover:bg-primary-600 text-white rounded-lg text-sm font-semibold transition text-center shadow-md shadow-primary/20 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Eye size={16} /> Quick View
                      </button>
                      <Link
                        href="/explore"
                        className="px-3.5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center justify-center"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUE PROPOSITIONS */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Express Fast Delivery', desc: 'Free worldwide tracked shipping over $100' },
              { icon: Shield, title: 'Official Brand Warranty', desc: '100% authentic devices with 2-year guarantee' },
              { icon: Headphones, title: '24/7 Expert Support', desc: 'Dedicated technical team ready to assist' },
              { icon: Zap, title: 'Instant 30-Day Returns', desc: 'Hassle-free direct refund or exchange policy' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-md transition-all duration-300 flex items-start gap-4"
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{feature.title}</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC PRODUCT EXPLORER & SHOWCASE */}
      <section id="products-section" className="py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Sparkles size={14} /> Live Inventory Catalog
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Explore Premium Gadgets
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Showing{' '}
                <span className="font-bold text-slate-800">{filteredGadgets.length}</span> verified products
                {selectedCategory !== 'All' ? ` in "${selectedCategory}"` : ''}
              </p>
            </div>

            {/* View Mode & Sorter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm shadow-2xs">
                <span className="text-slate-400 text-xs mr-2 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>

              {/* Price Filter Dropdown */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm shadow-2xs">
                <span className="text-slate-400 text-xs mr-2 font-medium">Price:</span>
                <select
                  value={priceRange}
                  onChange={(e: any) => setPriceRange(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="all">All Prices</option>
                  <option value="under100">Under $100</option>
                  <option value="100to500">$100 - $500</option>
                  <option value="over500">Above $500</option>
                </select>
              </div>

              {/* View Switcher Toggle */}
              <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === 'grid' ? 'bg-primary text-white shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition cursor-pointer ${
                    viewMode === 'list' ? 'bg-primary text-white shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="List View"
                >
                  <ListIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Search & Reset Filter Indicator */}
          {(searchQuery || selectedCategory !== 'All' || priceRange !== 'all') && (
            <div className="flex items-center justify-between bg-primary/5 border border-primary/15 rounded-xl px-4 py-2.5 text-xs text-primary font-medium">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Active Filters:</span>
                {searchQuery && (
                  <span className="bg-white px-2 py-0.5 rounded border border-primary/20 text-slate-700">
                    Query: "{searchQuery}"
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="bg-white px-2 py-0.5 rounded border border-primary/20 text-slate-700">
                    Category: {selectedCategory}
                  </span>
                )}
                {priceRange !== 'all' && (
                  <span className="bg-white px-2 py-0.5 rounded border border-primary/20 text-slate-700">
                    Price: {priceRange}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setPriceRange('all');
                  setSortBy('featured');
                  addToast('Filters reset to default', 'info');
                }}
                className="underline hover:text-primary-700 font-bold cursor-pointer shrink-0 ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid or List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs animate-pulse space-y-4">
                  <div className="h-48 bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 rounded-lg mt-4" />
                </div>
              ))}
            </div>
          ) : filteredGadgets.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredGadgets.map((gadget) => {
                const isFavorite = wishlist.includes(gadget._id);

                if (viewMode === 'list') {
                  // Compact List View Layout
                  return (
                    <div
                      key={gadget._id}
                      className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-50">
                          <SafeGadgetImage
                            src={gadget.image}
                            alt={gadget.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <span className="text-2xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {gadget.category}
                          </span>
                          <h4 className="font-bold text-slate-800 text-base mt-1 line-clamp-1">
                            {gadget.title}
                          </h4>
                          <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">
                            {gadget.shortDesc}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-amber-500 font-semibold">
                            <Star size={13} fill="currentColor" />
                            <span>{gadget.rating}</span>
                            <span className="text-slate-400 font-normal">| {gadget.brand}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-900">${gadget.price}</p>
                          <span className="text-2xs text-emerald-600 font-bold">In Stock</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWishlist(gadget._id, gadget.title)}
                            className={`p-2.5 rounded-lg border transition cursor-pointer ${
                              isFavorite
                                ? 'bg-red-50 text-red-500 border-red-200'
                                : 'text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                            title="Add to Wishlist"
                          >
                            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => setQuickViewGadget(gadget)}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            Quick View
                          </button>
                          <button
                            onClick={() => handleAddToCart(gadget)}
                            className="px-4 py-2.5 bg-primary hover:bg-primary-600 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Grid View Card Layout
                return (
                  <div
                    key={gadget._id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/70 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image & Interactive Badges */}
                      <div className="relative overflow-hidden h-52 bg-slate-50">
                        <SafeGadgetImage
                          src={gadget.image}
                          alt={gadget.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Category Badge */}
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md text-primary text-xs font-bold rounded-lg shadow-xs">
                          {gadget.category}
                        </span>

                        {/* Action Floating Buttons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <button
                            onClick={() => toggleWishlist(gadget._id, gadget.title)}
                            className={`p-2 rounded-full backdrop-blur-md transition shadow-md cursor-pointer ${
                              isFavorite
                                ? 'bg-red-500 text-white'
                                : 'bg-white/90 text-slate-600 hover:text-red-500 hover:bg-white'
                            }`}
                            title="Toggle Wishlist"
                          >
                            <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => setQuickViewGadget(gadget)}
                            className="p-2 rounded-full bg-white/90 text-slate-600 hover:text-primary hover:bg-white backdrop-blur-md transition shadow-md cursor-pointer"
                            title="Quick View Details"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-400 uppercase tracking-wider text-2xs">
                            {gadget.brand}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star size={13} fill="currentColor" />
                            <span>{gadget.rating}</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-base text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                          {gadget.title}
                        </h3>

                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                          {gadget.shortDesc}
                        </p>

                        <div className="pt-2 flex items-baseline justify-between">
                          <div>
                            <span className="text-2xl font-black text-slate-900">${gadget.price}</span>
                            <span className="text-xs text-emerald-600 font-semibold ml-2">● In Stock</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAddToCart(gadget)}
                        className="py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition text-center cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <ShoppingBag size={14} /> Add
                      </button>
                      <Link
                        href={`/gadgets/${gadget._id}`}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition text-center cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                      >
                        Details <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No matching gadgets found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                We couldn't find any gadgets matching your filter criteria. Try adjusting your query or resetting all filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setPriceRange('all');
                  setSortBy('featured');
                }}
                className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition shadow-xs cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SPOTLIGHT DEAL OF THE DAY */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                <Flame size={14} className="text-amber-400" /> Deal of the Day • 25% Off
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Apple Watch Series 9 GPS + Cellular
              </h2>

              <p className="text-slate-300 text-base max-w-xl leading-relaxed">
                Supercharged by the S9 SiP chip, Double Tap gesture, and a 2000-nit display that’s twice as bright in direct sunlight. Includes fast charging dock and sports loop band.
              </p>

              {/* Countdown Cards */}
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center min-w-[70px] border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-2xs uppercase tracking-wider text-slate-300">Hours</span>
                </div>
                <span className="text-2xl font-bold text-slate-500">:</span>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center min-w-[70px] border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-2xs uppercase tracking-wider text-slate-300">Mins</span>
                </div>
                <span className="text-2xl font-bold text-slate-500">:</span>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center min-w-[70px] border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-2xs uppercase tracking-wider text-slate-300">Secs</span>
                </div>
              </div>

              {/* Stock Claimed Progress */}
              <div className="max-w-md space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Claimed: 84% (42/50 units)</span>
                  <span className="text-amber-400 font-bold">Only 8 left!</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full w-[84%] animate-pulse" />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-white">$299</span>
                  <span className="text-base text-slate-400 line-through ml-2 font-medium">$399</span>
                </div>
                <button
                  onClick={() => {
                    addToast('🎉 Deal claimed! Special promo price locked in cart.');
                    router.push('/explore');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-xl font-bold hover:brightness-110 transition shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  Claim Deal Now
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800"
                alt="Deal of the day"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC PERFORMANCE & GROWTH ANALYTICS (Interactive Recharts) */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <TrendingUp size={14} /> Real-Time Analytics
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Ecosystem Growth & Performance
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Verified platform metrics, sales volume, and dynamic category breakdown
              </p>
            </div>

            {/* Timeframe selector */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              {(['7d', '30d', '1y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setAnalyticsTimeframe(tf)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    analyticsTimeframe === tf
                      ? 'bg-white text-primary shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tf === '7d' ? 'Last 7 Days' : tf === '30d' ? 'Last 30 Days' : 'Annual View'}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Active Happy Customers', num: '12,450+', change: '+18.4% this month', icon: Users, color: 'text-primary' },
              { label: 'Verified Devices Listed', num: '520+', change: '35 new this week', icon: Package, color: 'text-secondary' },
              { label: 'Order Satisfaction', num: '99.4%', change: 'Highest industry rating', icon: Award, color: 'text-emerald-600' },
              { label: 'Average Support Response', num: '< 5 Mins', change: '24/7 dedicated line', icon: Zap, color: 'text-amber-500' },
            ].map((metric, i) => (
              <div
                key={i}
                className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 hover:shadow-md transition duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{metric.label}</span>
                  <metric.icon size={20} className={metric.color} />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{metric.num}</div>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <span>●</span> {metric.change}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Charts Grid */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sales Trend LineChart */}
            <div className="lg:col-span-7 bg-slate-50/80 rounded-2xl p-6 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Sales & Order Trends</h3>
                  <p className="text-xs text-slate-500">Live aggregated volume over selected period</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-md">
                  {analyticsTimeframe === '7d' ? 'Daily' : analyticsTimeframe === '30d' ? 'Weekly' : 'Quarterly'}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={290}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      borderRadius: '10px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    name="Sales ($)"
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Share PieChart */}
            <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Category Market Share</h3>
                <p className="text-xs text-slate-500">Distribution of devices purchased by category</p>
              </div>
              <div className="my-auto">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        color: '#fff',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                {categoryDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                    <span className="font-bold text-slate-900 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC VERIFIED CUSTOMER REVIEWS & FEEDBACK */}
      <section className="py-16 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Star size={14} className="text-amber-400" /> Customer Community
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Verified Reviews & Feedback
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Real feedback from real tech enthusiasts around the world
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Rating Filter */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 text-xs shadow-2xs">
                <button
                  onClick={() => setReviewRatingFilter('all')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                    reviewRatingFilter === 'all' ? 'bg-primary text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({reviews.length})
                </button>
                <button
                  onClick={() => setReviewRatingFilter(5)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1 ${
                    reviewRatingFilter === 5 ? 'bg-primary text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  5 <Star size={12} fill="currentColor" className="text-amber-400" />
                </button>
              </div>

              {/* Write Review Button */}
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquarePlus size={15} /> Write a Review
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-2xs font-semibold text-slate-400">{rev.date}</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{rev.name}</h4>
                    <p className="text-2xs text-slate-500 font-medium">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC FAQ WITH REAL-TIME SEARCH */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Knowledge Hub
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm">
              Quick answers to common questions about orders, warranty, and authentic gadgets
            </p>
          </div>

          {/* Search FAQ */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search FAQ keywords (shipping, return, warranty)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              {faqSearch && (
                <button
                  onClick={() => setFaqSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setAllFaqsExpanded(!allFaqsExpanded);
                setOpenFaq(allFaqsExpanded ? null : 0);
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
            >
              {allFaqsExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = allFaqsExpanded || openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 hover:border-primary/40 transition duration-200"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-100/60 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 pr-4">
                        <span className="text-2xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {faq.category}
                        </span>
                        <span className="font-bold text-slate-800 text-sm sm:text-base">
                          {faq.title}
                        </span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-300 shrink-0 ${
                          isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-white">
                        {faq.content}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                No FAQs match your search query "{faqSearch}".
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DYNAMIC NEWSLETTER & PROMO REWARD */}
      <section className="py-16 bg-gradient-to-br from-purple-900 via-primary to-indigo-900 text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Tag size={14} /> VIP Club Membership
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Subscribe & Get 20% Off Your Next Order
          </h2>

          <p className="text-purple-100 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Join over 25,000 smart gadget enthusiasts receiving weekly drops, early bird promotions, and insider tech reviews.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl font-bold text-sm transition shadow-lg shadow-amber-400/25 cursor-pointer shrink-0"
              >
                Claim 20% OFF
              </button>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md mx-auto space-y-3 animate-fadeIn">
              <p className="text-emerald-300 font-bold text-base flex items-center justify-center gap-2">
                <Check size={20} /> Subscription Confirmed!
              </p>
              <p className="text-xs text-purple-200">
                Here is your exclusive 20% discount coupon code for your next checkout:
              </p>
              <div className="flex items-center justify-center gap-2 bg-black/30 p-2 rounded-xl border border-white/10">
                <span className="font-mono text-lg font-black text-amber-300 tracking-wider">
                  GADGET2026
                </span>
                <button
                  onClick={copyCoupon}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Copy size={13} /> {copiedCode ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      {quickViewGadget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 relative">
            <button
              onClick={() => setQuickViewGadget(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-50">
                <SafeGadgetImage
                  src={quickViewGadget.image}
                  alt={quickViewGadget.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded">
                    {quickViewGadget.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    {quickViewGadget.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-amber-500 font-semibold">
                    <Star size={14} fill="currentColor" />
                    <span>{quickViewGadget.rating}</span>
                    <span className="text-slate-400 font-normal">| {quickViewGadget.brand}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {quickViewGadget.fullDesc || quickViewGadget.shortDesc}
                </p>

                <div className="pt-2 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">${quickViewGadget.price}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Free Express Shipping
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-bold text-slate-600">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button
                      onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{quickViewQty}</span>
                    <button
                      onClick={() => setQuickViewQty((q) => q + 1)}
                      className="p-2 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleAddToCart(quickViewGadget, quickViewQty)}
                    className="flex-1 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl text-sm font-bold transition shadow-md shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} /> Add to Cart (${quickViewGadget.price * quickViewQty})
                  </button>
                  <Link
                    href={`/gadgets/${quickViewGadget._id}`}
                    onClick={() => setQuickViewGadget(null)}
                    className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition text-center cursor-pointer"
                  >
                    Full Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Leave a Review</h3>
            <p className="text-slate-500 text-xs mb-4">Share your honest experience with the community</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        size={22}
                        className={star <= newReview.rating ? 'text-amber-400' : 'text-slate-200'}
                        fill={star <= newReview.rating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Role / Headline</label>
                <input
                  type="text"
                  value={newReview.role}
                  onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                  placeholder="e.g. Tech Blogger / Audiophile"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Feedback</label>
                <textarea
                  required
                  rows={3}
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  placeholder="Tell us what you loved about your gadget..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-600 transition shadow-md shadow-primary/20 cursor-pointer"
              >
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}