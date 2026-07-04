import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
          <Link href="/widerrufsrecht" className="hover:text-primary transition-colors">
            Widerrufsrecht
          </Link>
          <Link href="/agb" className="hover:text-primary transition-colors">
            AGB
          </Link>
          <Link href="/datenschutz" className="hover:text-primary transition-colors">
            Datenschutz
          </Link>
          <Link href="/impressum" className="hover:text-primary transition-colors">
            Impressum
          </Link>
          <Link href="/admin" className="hover:text-primary transition-colors">
            Admin
          </Link>
        </div>
        
      </div>
    </footer>
  )
}
