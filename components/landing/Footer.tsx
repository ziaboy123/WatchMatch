import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t">
      <div className="container max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p className="font-serif text-base font-semibold text-foreground">WatchMatch</p>
        <p>A personal project for watch enthusiasts, built with care.</p>
        <div className="flex items-center gap-4">
          <Link href="/credits" className="hover:text-foreground transition-colors">
            Photo credits
          </Link>
          <span>© {new Date().getFullYear()} WatchMatch</span>
        </div>
      </div>
    </footer>
  )
}
