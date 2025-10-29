'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { KeyRound, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '../icons/logo';

const navLinks = [
  { label: 'Quem Somos', href: '#quem-somos', key: 'quem-somos' },
  { label: 'Diferenciais', href: '#diferenciais', key: 'diferenciais' },
  { label: 'Integrações', href: '#integrations', key: 'integrations' },
  { label: 'Dúvidas', href: '#faq', key: 'faq' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* HEADER FIXO, NO TOPO E ACIMA DE TUDO */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-1 flex justify-start">
              <a href="#hero" aria-label="Página inicial da Fusion Pay">
                <Logo />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-sm font-medium text-white/90 transition-all hover:text-primary hover:drop-shadow-[0_0_4px_hsl(var(--primary))] hover:scale-105"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center flex-1 justify-end">
              <Button
                size="sm"
                className="rounded-full bg-primary text-black h-10 px-6 font-semibold hover:bg-primary/90 hover:scale-105 transition-transform shadow-sm hover:shadow-md hover:shadow-primary/20"
                asChild
              >
                <a href="https://app.fusionpaybr.com.br/auth/login">
                  <KeyRound className="mr-2" />
                  Login
                </a>
              </Button>
            </div>

            {/* Mobile Navigation Trigger */}
            <div className="flex items-center lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-white hover:bg-white/10"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#0A0A0A] border-r-white/10 w-[80%] max-w-sm p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Menu de Navegação</SheetTitle>
                    <SheetDescription>
                      Navegue pelas seções do site da Fusion Pay.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex h-full flex-col p-6">
                    <div className="mb-8">
                      <a href="#hero" aria-label="Página inicial da Fusion Pay" onClick={() => setMobileMenuOpen(false)}>
                        <Logo />
                      </a>
                    </div>
                    <div className="flex flex-col gap-4 text-lg">
                      {navLinks.map((link) => (
                        <a
                          key={link.key}
                          href={link.href}
                          className="text-white/90 transition-colors hover:text-white"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <Button
                        size="sm"
                        className="w-full rounded-full bg-primary text-black h-10 px-6 font-semibold"
                        asChild
                      >
                        <a href="https://app.fusionpaybr.com.br/auth/login">
                          <KeyRound className="mr-2" />
                          Login
                        </a>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* SPACER: evita que o conteúdo suba por baixo do header fixo */}
      <div className="h-16 md:h-20" />
    </>
  );
}
