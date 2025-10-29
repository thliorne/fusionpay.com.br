import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import React from 'react';

export function FloatingHeader() {
  const [open, setOpen] = React.useState(false);

  const links = [
    { label: 'Features', href: '#', key: 'features' },
    { label: 'Pricing', href: '#', key: 'pricing' },
    { label: 'About', href: '#', key: 'about' },
  ];

  return (
    <header
      className={cn(
        // Fixa no topo e garante que fique acima da hero/textos
        'fixed top-0 inset-x-0 z-[60]',
        // Largura total + leve blur e borda inferior
        'w-full border-b shadow-sm',
        'bg-background/90 supports-[backdrop-filter]:bg-background/70 backdrop-blur-lg'
      )}
    >
      <nav className="mx-auto max-w-screen-xl flex items-center justify-between px-4 py-2">
        {/* LOGO à esquerda (mais "pra cima" via redução do padding vertical da header) */}
        <a href="/" className="flex items-center gap-2">
          <img
            src="/assets/fusionpay-logo.svg"
            alt="Fusion Pay"
            className="h-7 w-auto"
          />
        </a>

        {/* Links desktop */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.key}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Ações / menu */}
        <div className="flex items-center gap-2">
          <Button size="sm">Login</Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setOpen(!open)}
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </Button>

            <SheetContent
              className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
              side="left"
            >
              <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                {links.map((link) => (
                  <a
                    key={link.key}
                    className={buttonVariants({
                      variant: 'ghost',
                      className: 'justify-start',
                    })}
                    href={link.href}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <SheetFooter>
                <Button variant="outline">Sign In</Button>
                <Button>Get Started</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}