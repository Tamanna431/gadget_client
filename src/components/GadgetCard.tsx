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
    <div className="group bg-white rounded-card overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col justify-between h-full">
      <div>
        {/* Image Section */}
        <div className="relative overflow-hidden h-48 bg-slate-50">
          <img 
            src={gadget.image} 
            alt={gadget.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <span className="absolute top-2 right-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full backdrop-blur-xs">
            {gadget.category}
          </span>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
            {gadget.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2">
            {gadget.shortDesc}
          </p>
          
          {/* Rating & Brand */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={14} fill="currentColor" />
              <span className="text-slate-700 font-semibold">{gadget.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <MapPin size={13} />
              <span className="font-medium">{gadget.brand}</span>
            </div>
          </div>

          {/* Price */}
          <p className="text-slate-900 font-extrabold text-2xl pt-2">
            ${gadget.price}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="p-4 pt-0">
        <Link 
          href={`/gadgets/${gadget._id}`}
          className="block w-full py-2.5 bg-primary/5 text-primary hover:bg-primary hover:text-white text-center font-semibold rounded-lg transition-all duration-300 shadow-xs border border-primary/10"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}