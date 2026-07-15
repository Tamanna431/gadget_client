import Link from 'next/link';
import { Cpu, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 pt-16 pb-8 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <Cpu className="text-primary" size={28} />
            <p className="font-extrabold ml-2 text-xl text-white tracking-tight">
              Gadget<span className="text-primary">Verse</span>
            </p>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your one-stop destination for premium smart gadgets and electronics. Quality guaranteed.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2.5 text-slate-400 text-sm">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/explore" className="hover:text-primary transition-colors">Explore</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-white">Contact</h3>
          <ul className="space-y-2.5 text-slate-400 text-sm">
            <li className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> Dhaka, Bangladesh</li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-primary" /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-primary" /> info@gadgetverse.com</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-white">Follow Us</h3>
          <div className="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-slate-800/60 text-slate-300 rounded-lg hover:bg-primary hover:text-white transition duration-300">
              <span className="text-sm font-bold">FB</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-slate-800/60 text-slate-300 rounded-lg hover:bg-primary hover:text-white transition duration-300">
              <span className="text-sm font-bold">TW</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-slate-800/60 text-slate-300 rounded-lg hover:bg-primary hover:text-white transition duration-300">
              <span className="text-sm font-bold">IG</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-slate-800/80 text-center text-slate-500 text-sm">
        © 2026 GadgetVerse. All rights reserved.
      </div>
    </footer>
  );
}