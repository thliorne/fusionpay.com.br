"use client";
import React, { useEffect, useState } from "react";
import { DollarSign, Shield, Zap, Globe, TrendingUp, CreditCard, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Header } from "./layout/header";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const orbitalIcons = [
  // Camada NEAR (horário, 24s)
  { Icon: DollarSign, className: "text-fusion-orange", style: { animation: "orbit-near 24s linear infinite" } },
  { Icon: CreditCard, className: "text-fusion-orange", style: { animation: "orbit-near 24s linear infinite", animationDelay: "-12s" } },
  // Camada MID (anti-horário, 34s)
  { Icon: Zap, className: "text-fusion-orange", style: { animation: "orbit-mid 34s linear infinite reverse" } },
  { Icon: Shield, className: "text-fusion-orange", style: { animation: "orbit-mid 34s linear infinite reverse", animationDelay: "-17s" } },
  // Camada FAR (horário, 46s)
  { Icon: Globe, className: "text-fusion-orange", style: { animation: "orbit-far 46s linear infinite" } },
  { Icon: TrendingUp, className: "text-fusion-orange", style: { animation: "orbit-far 46s linear infinite", animationDelay: "-23s" } },
];

const OrbSystem = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="relative w-full h-full" />;
  }

  const logoImage = PlaceHolderImages.find(p => p.id === 'header-logo');

  return (
    <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
      
      {/* 2) CORE-SPHERE */}
      <motion.div
        className="relative w-[240px] h-[240px] md:w-[280px] md:h-[280px] rounded-full [transform-style:preserve-3d]
                   bg-[radial-gradient(circle_at_50%_40%,#D5CDBD_15%,#FF7A3C_85%)]
                   shadow-[0_0_80px_-10px_#FF5722,inset_0_0_30px_rgba(0,0,0,0.3)]"
      >
        {/* Reflexos vítreos */}
        <div className="absolute top-[15%] left-[20%] w-[60%] h-[20%] bg-white/10 rounded-[100%] blur-md -rotate-[20deg]" />
        <div className="absolute bottom-[20%] right-[15%] w-[50%] h-[15%] bg-white/5 rounded-[100%] blur-lg rotate-[30deg]" />
      </motion.div>

      {/* LOGO OVERLAY - FIXED */}
      <div className="fusion-logo-overlay pointer-events-none absolute inset-0 grid place-items-center z-[2]">
        <div className="fusion-logo-mark select-none rounded-full bg-black p-4">
          <img src={logoImage?.imageUrl || "https://i.imgur.com/j0I0NJz.png"} alt="Fusion Pay"
                className="w-full h-auto" loading="eager" decoding="async" />
        </div>
      </div>

      {/* 3) RINGS */}
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        <div className="absolute inset-[-10%] rounded-full border-t-2 border-b-2 border-primary/60 animate-[spin_32s_linear_infinite] [transform:rotateY(70deg)_rotateX(40deg)]" />
        <div className="absolute inset-[15%] rounded-full border-r border-l border-dashed border-white/30 animate-[spin_28s_linear_infinite_reverse] [transform:rotateY(60deg)_rotateX(25deg)]" />
        <div className="absolute inset-[38%] rounded-full border-2 border-[#FFE1B3]/50 animate-[spin_22s_linear_infinite] [transform:rotateY(50deg)_rotateX(60deg)]" />
      </div>

      {/* 4) PARTICLES */}
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={`p-${i}`}
            className="absolute top-1/2 left-1/2 w-0.5 h-0.5 rounded-full"
            style={{
              background: i % 4 === 0 ? "#FF5722" : "#F5F5F5",
              opacity: 0.2 + Math.random() * 0.4,
              animation: `orbit-particle-${i % 3 + 1} ${20 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * -20}s`,
            }}
          />
        ))}
      </div>
      
      {/* 5) ICON-ORBITS */}
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        {orbitalIcons.map(({ Icon, style, className }, index) => (
          <motion.div
            key={index}
            className="group/icon absolute top-1/2 left-1/2 -mt-5 -ml-5 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center 
                       border border-black/30 bg-black/80 backdrop-blur-sm shadow-[0_0_12px_rgba(255,87,34,0.3)]"
            style={style}
            whileHover={{ scale: 1.15, z: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Icon className={`w-6 h-6 md:w-7 md:h-7 transition-all duration-300 drop-shadow-[0_0_4px_hsl(var(--primary))] group-hover/icon:drop-shadow-[0_0_8px_hsl(var(--primary))] ${className}`} />
            <div className="absolute -inset-1 rounded-full border border-primary/50 opacity-0 transition-opacity duration-300 group-hover/icon:opacity-100 group-hover/icon:animate-pulse" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SaleToast = ({ onComplete }: { onComplete: () => void }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Generate random values on mount
    const randomValue = Math.random() * (8597 - 197) + 197;
    setValue(randomValue);

    // Set timers for animation lifecycle
    const visibilityTimer = setTimeout(() => {
      // This will trigger the exit animation
    }, 5000); 

    const removalTimer = setTimeout(() => {
        onComplete();
    }, 5450); // 5000ms visible + 450ms exit animation

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(removalTimer);
    };
  }, [onComplete]);

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  const notificationIcon = PlaceHolderImages.find(p => p.id === 'notification-icon');

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 20, z: -40, scale: 0.94, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, z: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -12, scale: 0.98, filter: "blur(3px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-[5%] top-[30%] md:right-[0%] md:top-[25%] lg:right-[-5%] lg:top-[20%] z-20 w-[280px] 
                 md:w-[320px] p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10
                 shadow-[0_10px_30px_-10px_rgba(255,87,34,0.3),_0_0_0_1px_rgba(255,87,34,0.2)]
                 will-change-[transform,opacity]"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-[-4px] border border-fusion-orange/50 rounded-full animate-pulse"></div>
            {notificationIcon && <Image src={notificationIcon.imageUrl} alt={notificationIcon.description} width={40} height={40} className="rounded-full" data-ai-hint={notificationIcon.imageHint} />}
        </div>
        <div className="flex-grow">
          <p className="font-semibold text-white">Transferência Recebida</p>
          <p className="text-2xl font-bold text-white tracking-tight">{formattedValue}</p>
          <p className="text-xs text-white/70">PIX recebido • agora mesmo</p>
        </div>
      </div>
    </motion.div>
  );
};


export default function HeroFusionPay() {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
    
    const interval = setInterval(() => {
      setNotifications(prev => [...prev, Date.now()]);
    }, 15000);

    // Initial notification
    setTimeout(() => setNotifications([Date.now()]), 1000);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationComplete = () => {
    setNotifications(prev => prev.slice(1));
  };


  return (
    <section className="relative min-h-screen overflow-hidden flex items-center pt-20">
      
      {/* Estilos CSS para as animações orbitais */}
      <style>{`
        .fusion-logo-overlay { mix-blend-mode: screen; }
        .fusion-logo-mark {
          width: clamp(154px, 22vw, 246px);
          opacity: 1;
          filter: drop-shadow(0 0 12px rgba(255,100,50,.35));
          transform: translateZ(1px);
        }
        .fusion-logo-overlay::after {
          content:"";
          position: absolute;
          width: clamp(211px, 31vw, 352px);
          height: clamp(211px, 31vw, 352px);
          border-radius: 9999px;
          background: radial-gradient(circle at 50% 50%,
            rgba(255,120,60,.32) 0%,
            rgba(255,120,60,.12) 40%,
            rgba(255,120,60,.03) 68%,
            transparent 80%);
          filter: blur(8px);
        }
        @keyframes orbit-near {
          from { transform: rotate(0deg) translateX(140px) rotate(-0deg) scale(0.9); }
          to   { transform: rotate(360deg) translateX(140px) rotate(-360deg) scale(0.9); }
        }
        @keyframes orbit-mid {
          from { transform: rotate(0deg) translateX(180px) rotate(-0deg) scale(1); }
          to   { transform: rotate(360deg) translateX(180px) rotate(-360deg) scale(1); }
        }
        @keyframes orbit-far {
          from { transform: rotate(0deg) translateX(220px) rotate(-0deg) scale(1.1); }
          to   { transform: rotate(360deg) translateX(220px) rotate(-360deg) scale(1.1); }
        }
        @keyframes orbit-particle-1 {
          from { transform: rotateZ(0deg) rotateY(20deg) translateX(160px); }
          to   { transform: rotateZ(360deg) rotateY(20deg) translateX(160px); }
        }
        @keyframes orbit-particle-2 {
          from { transform: rotateZ(0deg) rotateY(50deg) translateX(200px); }
          to   { transform: rotateZ(360deg) rotateY(50deg) translateX(200px); }
        }
        @keyframes orbit-particle-3 {
          from { transform: rotateZ(0deg) rotateY(75deg) translateX(240px); }
          to   { transform: rotateZ(360deg) rotateY(75deg) translateX(240px); }
        }
        @media (max-width: 768px) {
          @keyframes orbit-near {
            from { transform: rotate(0deg) translateX(110px) rotate(-0deg); }
            to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
          }
          @keyframes orbit-mid {
            from { transform: rotate(0deg) translateX(140px) rotate(-0deg); }
            to   { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
          }
          @keyframes orbit-far {
            from { transform: rotate(0deg) translateX(170px) rotate(-0deg); }
            to   { transform: rotate(360deg) translateX(170px) rotate(-360deg); }
          }
        }
      `}</style>

      {/* Container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Texto */}
        <div className="text-white flex flex-col items-start gap-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm text-white animate-fadeIn mt-2">
            <Sparkles className="w-4 h-4 text-fusion-orange" />
            Gateway de Pagamentos Premium
          </div>

          {/* Headline */}
          <h1 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight animate-slideUp">
            O Futuro dos <span className="text-fusion-orange">Pagamentos</span> Começa <span className="text-fusion-orange">Aqui.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-base md:text-lg text-white animate-fadeIn">
            O gateway de pagamentos digital com o motor de processamento mais
            rápido e o antifraude mais inteligente do mercado.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fadeIn">
            <a
              href="https://app.fusionpaybr.com.br/auth/register"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-fusion-orange text-black font-semibold shadow-[0_0_24px_rgba(255,87,34,0.45)] hover:shadow-[0_0_36px_rgba(255,87,34,0.6)] transition-shadow"
            >
              Criar Conta Grátis
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=79644350321&text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20sobre%20o%20FusionPay&type=phone_number&app_absent=0"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              Fale Conosco
            </a>
          </div>

          {/* Confiança + ícones */}
          <div className="mt-10 space-y-3 animate-fadeIn">
            <p className="text-sm text-white">
              Confiança de mais de <strong>10.000+ empresas</strong>
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white">
              <div className="badge-soft">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                </svg>
                Máxima Segurança
              </div>
              <div className="badge-soft">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Ultra Rápido
              </div>
              <div className="badge-soft">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M19 13l-5-5-4 4-3-3" />
                </svg>
                Crescimento Real
              </div>
            </div>
          </div>
        </div>

        {/* Sistema Orbital 3D */}
        <div className="relative h-96 w-96 lg:h-[32rem] lg:w-[32rem] perspective-1000 mx-auto">
            <OrbSystem />
            <AnimatePresence>
                {notifications.length > 0 && (
                <SaleToast
                    key={notifications[0]}
                    onComplete={handleNotificationComplete}
                />
                )}
            </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
