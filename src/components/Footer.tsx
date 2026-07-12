import { Link } from '@heroui/react';
import { Cpu, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <Cpu className="text-secondary" size={28} />
            <p className="font-bold ml-2 text-xl">GadgetVerse</p>
          </div>
          <p className="text-slate-400 text-sm">
            Your one-stop destination for premium smart gadgets and electronics. Quality guaranteed.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li><Link href="/" className="text-slate-400 hover:text-white">Home</Link></li>
            <li><Link href="/explore" className="text-slate-400 hover:text-white">Explore</Link></li>
            <li><Link href="/about" className="text-slate-400 hover:text-white">About</Link></li>
            <li><Link href="/contact" className="text-slate-400 hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Contact</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li className="flex items-center gap-2"><MapPin size={16} /> Dhaka, Bangladesh</li>
            <li className="flex items-center gap-2"><Phone size={16} /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><Mail size={16} /> info@gadgetverse.com</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Follow Us</h3>
          <div className="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener" className="bg-slate-800 p-2 rounded-lg hover:bg-primary transition">
              <span className="text-sm">FB</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener" className="bg-slate-800 p-2 rounded-lg hover:bg-primary transition">
              <span className="text-sm">TW</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener" className="bg-slate-800 p-2 rounded-lg hover:bg-primary transition">
              <span className="text-sm">IG</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-slate-800 text-center text-slate-400 text-sm">
        © 2026 GadgetVerse. All rights reserved.
      </div>
    </footer>
  );
}