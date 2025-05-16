import Link from 'next/link';
import { AppLogo } from '@/components/icons';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center gap-2">
          <AppLogo />
          <span className="text-lg font-semibold text-foreground">
            Cypress TestGen AI
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {/* Placeholder for Auth status/button */}
        <Button variant="outline" size="sm" disabled>
          Login (Soon)
        </Button>
      </div>
    </header>
  );
}
