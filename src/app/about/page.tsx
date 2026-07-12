import { Card } from '@heroui/react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-slate-800">About GadgetVerse</h1>
      <p className="text-lg text-slate-600 mb-12 max-w-3xl">
        Founded in 2020, GadgetVerse is your trusted destination for premium smart gadgets and electronics.
        We curate only the finest products from world-renowned brands to bring you cutting-edge technology
        that enhances your daily life.
      </p>

      <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
      <p className="text-slate-600 mb-12">
        To make premium technology accessible to everyone through authentic products, competitive pricing,
        and exceptional customer service.
      </p>

      <h2 className="text-2xl font-bold mb-6">Our Team</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { name: 'Alex Thompson', role: 'Founder & CEO', img: 'https://i.pravatar.cc/200?img=12' },
          { name: 'Maria Garcia', role: 'Head of Product', img: 'https://i.pravatar.cc/200?img=47' },
          { name: 'David Kim', role: 'CTO', img: 'https://i.pravatar.cc/200?img=33' },
        ].map((m, i) => (
          <Card key={i} className="rounded-card p-6">
            <div className="items-center text-center">
              <img src={m.img} alt={m.name} className="w-24 h-24 rounded-full mb-4" />
              <h3 className="font-bold text-lg">{m.name}</h3>
              <p className="text-slate-600 text-sm">{m.role}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}