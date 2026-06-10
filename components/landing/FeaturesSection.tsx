'use client'

import { motion } from 'framer-motion'
import { Ruler, Heart, Zap, Award } from 'lucide-react'

const features = [
  {
    icon: Ruler,
    title: 'Wrist-Fit Science',
    description:
      'Most people wear the wrong case size. We match watches to your exact wrist circumference so every recommendation sits perfectly.',
  },
  {
    icon: Heart,
    title: 'Style-Aware Matching',
    description:
      'From streetwear to old money, your aesthetic shapes every recommendation. We speak your language.',
  },
  {
    icon: Zap,
    title: 'Budget-First Thinking',
    description:
      'Every budget tier has exceptional watches. We surface the best, not just the most expensive.',
  },
  {
    icon: Award,
    title: 'Expert-Curated Database',
    description:
      'Over 100 carefully selected watches from Casio to Rolex, all independently assessed for quality and value.',
  },
]

export function FeaturesSection() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
            Recommendations that{' '}
            <span className="italic">actually make sense</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Unlike generic listicles, WatchMatch considers who you are before telling you what to
            wear.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl border bg-card hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
