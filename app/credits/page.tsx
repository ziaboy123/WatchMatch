import Link from 'next/link'
import { imageCredits } from '@/data/imageCredits'
import { watches } from '@/data/watches'

export const metadata = {
  title: 'Photo Credits — WatchMatch',
}

type CreditRow = {
  brand: string
  model: string
  imageUrl: string
  author: string
  licence: string
  licenceUrl: string
  sourceUrl: string
}

export default function CreditsPage() {
  // Build one row per unique image, labelled with all watches that use it
  const urlToWatches: Record<string, string[]> = {}
  for (const w of watches) {
    if (!w.image) continue
    if (!urlToWatches[w.image]) urlToWatches[w.image] = []
    urlToWatches[w.image].push(`${w.brand} ${w.model}`)
  }

  const rows: CreditRow[] = []
  for (const [url, credit] of Object.entries(imageCredits)) {
    const names = urlToWatches[url] ?? []
    rows.push({
      brand: names[0]?.split(' ')[0] ?? '',
      model: names.join(', '),
      imageUrl: url,
      ...credit,
    })
  }

  rows.sort((a, b) => a.model.localeCompare(b.model))

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-5 border-b">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold hover:opacity-80 transition-opacity">
            WatchMatch
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </Link>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl font-bold mb-3">Photo Credits</h1>
        <p className="text-muted-foreground mb-8">
          Watch photographs used on this site are sourced from{' '}
          <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Wikimedia Commons
          </a>{' '}
          and reproduced under the licences listed below. Brand and model names remain the property of their respective manufacturers.
        </p>

        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Watch(es)</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Photographer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Licence</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-foreground">{row.model}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.author}</td>
                  <td className="px-4 py-3">
                    {row.licenceUrl ? (
                      <a
                        href={row.licenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline hover:opacity-80"
                      >
                        {row.licence}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{row.licence}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={row.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:opacity-80 truncate block max-w-[160px]"
                    >
                      Wikimedia
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          This credits page satisfies the attribution requirements of Creative Commons licences (CC BY, CC BY-SA) as described at{' '}
          <a href="https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia" target="_blank" rel="noopener noreferrer" className="underline">
            commons.wikimedia.org
          </a>.
        </p>
      </main>
    </div>
  )
}
