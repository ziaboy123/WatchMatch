'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatEstimatedPrice } from '@/lib/utils'

const exampleWatches = [
  {
    brand: 'Tudor',
    model: 'Black Bay 58',
    priceRange: '£2,600 – £3,300',
    category: 'Dive',
    tags: ['39mm', 'Automatic', '200m WR'],
    description: 'The perfect proportions of vintage Rolex DNA in a modern package.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Tudor_Black_Bay_58_ref._M79018V%2C_primo_modello_di_casa_Tudor_interamente_in_oro.jpg/400px-Tudor_Black_Bay_58_ref._M79018V%2C_primo_modello_di_casa_Tudor_interamente_in_oro.jpg',
  },
  {
    brand: 'Tissot',
    model: 'PRX Powermatic 80',
    priceRange: '£510 – £645',
    category: 'Integrated Sports',
    tags: ['40mm', 'Automatic', 'Sapphire'],
    description: 'The most sought-after integrated bracelet watch under £1,000.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Tissot_watch_PRX_collection_23_January_2025_Philippines1.jpg/400px-Tissot_watch_PRX_collection_23_January_2025_Philippines1.jpg',
  },
  {
    brand: 'Seiko',
    model: 'Presage Cocktail Time',
    priceRange: '£285 – £360',
    category: 'Dress',
    tags: ['40mm', 'Automatic', 'In-House'],
    description: 'Stunning enamel-like dial that punches above its price class.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Seiko_SARB.jpg/400px-Seiko_SARB.jpg',
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
              {/* Watch image */}
              <div className="h-48 bg-secondary/40 relative overflow-hidden">
                <img
                  src={watch.image}
                  alt={`${watch.brand} ${watch.model}`}
                  className="absolute inset-0 w-full h-full object-contain p-3"
                />
                <div className="absolute top-3 right-3">
                  <span className="text-xs text-foreground/70 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-full">
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
                <p className="font-semibold text-lg">{formatEstimatedPrice(watch.priceRange)}</p>
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
