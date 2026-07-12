'use client';

import { useState } from 'react';
import { Card, Input, Button} from '@heroui/react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে সাধারণত API কল করা হয়
    console.log('Form submitted:', formData);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-slate-800">Contact Us</h1>
      <p className="text-slate-600 mb-12">Have questions? We'd love to hear from you.</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <Card className="rounded-card p-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-slate-600 text-sm">123 Tech Street, Dhaka 1205</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-slate-600 text-sm">+880 1700-000000</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-slate-600 text-sm">info@gadgetverse.com</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Form Card */}
        <Card className="rounded-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            
            <Input
             placeholder="Your Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            
            <Input
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            
            {/* Native Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Type your message here..."
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-primary/80"
            >
              {sent ? '✓ Message Sent!' : 'Send Message'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}