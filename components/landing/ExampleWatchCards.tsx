'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

const exampleWatches = [
  {
    brand: 'Tudor',
    model: 'Black Bay 58',
    price: 2950,
    category: 'Dive',
    tags: ['39mm', 'Automatic', '200m WR'],
    description: 'The perfect proportions of vintage Rolex DNA in a modern package.',
    gradient: 'from-slate-900 to-slate-700',
    accentColor: 'bg-blue-600',
  },
  {
    brand: 'Tissot',
    model: 'PRX Powermatic 80',
    price: 575,
    category: 'Integrated Sports',
    tags: ['40mm', 'Automatic', 'Sapphire'],
    description: 'The most sought-after integrated bracelet watch under £1,000.',
    gradient: 'from-stone-900 to-stone-700',
    accentColor: 'bg-stone-400',
  },
  {
    brand: 'Seiko',
    model: 'Presage Cocktail Time',
    price: 320,
    category: 'Dress',
    tags: ['40mm', 'Automatic', 'In-House'],
    description: 'Stunning enamel-like dial that punches above its price class.',
    gradient: 'from-zinc-900 to-zinc-700',
    accentColor: 'bg-amber-500',
  },
]

export function ExampleWatchCards() {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
            From Casio to Rolex
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Our database spans every meaningful tier of the market. Here are three fan favourites.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {exampleWatches.map((watch, i) => (
            <motion.div
              key={watch.model}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Watch image placeholder */}
              <div className={`h-48 bg-gradient-to-br ${watch.gradient} relative flex items-center justify-center`}>
                <div className="w-28 h-28 rounded-full border-4 border-white/10 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full ${watch.accentColor}`} />
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                    {watch.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {watch.brand}
                </p>
                <h3 className="font-semibold text-base mb-2">{watch.model}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {watch.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {watch.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="font-semibold text-lg">{formatPrice(watch.price)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" asChild className="group">
            <Link href="/quiz">
              Find Your Perfect Watch
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
