import { Star, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Gadget {
  _id: string;
  title: string;
  shortDesc: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  brand: string;
}

export default function GadgetCard({ gadget }: { gadget: Gadget }) {
  return (
    <div className="bg-white rounded-card overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-200">
      {/* Image Section */}
      <div className="relative">
        <img 
          src={gadget.image} 
          alt={gadget.title} 
          className="w-full h-48 object-cover" 
        />
        <span className="absolute top-2 right-2 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
          {gadget.category}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">
          {gadget.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2">
          {gadget.shortDesc}
        </p>
        
        {/* Rating & Brand */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="text-slate-700 font-medium">{gadget.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <MapPin size={14} />
            <span>{gadget.brand}</span>
          </div>
        </div>

        {/* Price */}
        <p className="text-primary font-bold text-xl">
          ${gadget.price}
        </p>
      </div>

      {/* Button */}
      <div className="p-4 pt-0">
        <Link 
          href={`/gadgets/${gadget._id}`}
          className="block w-full py-2 bg-primary/10 text-primary text-center font-medium rounded-lg hover:bg-primary hover:text-white transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}