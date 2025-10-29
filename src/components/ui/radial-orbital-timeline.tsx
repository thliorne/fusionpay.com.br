"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link as LinkIcon, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, useReducedMotion } from "framer-motion";


interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

function CircleAction({ label, icon, onClick }: {label:string; icon:React.ReactNode; onClick?:()=>void}) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative isolate grid place-items-center size-28 rounded-full
                 bg-[#0B0B0B]/80 ring-1 ring-white/15 text-white/90 cursor-pointer
                 transition-transform duration-200 ease-out outline-none"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: reduce ? 0.12 : 0.18, ease: "easeOut" }}
    >
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="text-orange-400">{icon}</span>
        <span className="text-xs font-semibold tracking-wide text-white/85">{label}</span>
      </div>
      
      {/* Anel fixo (sem animação) */}
      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/15" />
      
      {/* Glow apenas no hover (sem loop) */}
      <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
           style={{ boxShadow: "0 0 24px 4px rgba(255,87,34,0.28)" }} />
      
      {/* Profundidade sutil */}
      <div className="pointer-events-none absolute inset-0 rounded-full [box-shadow:inset_0_10px_30px_rgba(0,0,0,0.45)]" />
    </motion.button>
  )
}


export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode, setViewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [isClient, setIsClient] = useState(false);

  const isAnyCardOpen = activeNodeId !== null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const closeAllCards = () => {
    setExpandedItems({});
    setActiveNodeId(null);
    setPulseEffect({});
    setAutoRotate(true);
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllCards();
      }
    };
  
    if (isAnyCardOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnyCardOpen]);


  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAnyCardOpen) {
      const target = e.target as HTMLElement;
      if (
        !target.closest('.card-container') &&
        !target.closest('.node-container')
      ) {
        closeAllCards();
      }
    }
  };

  const toggleItem = (id: number) => {
    const isCurrentlyExpanded = !!expandedItems[id];

    if (activeNodeId !== null && activeNodeId !== id) {
      // If another card is open, close it and open the new one
      const newExpandedState: Record<number, boolean> = { [id]: true };
      setExpandedItems(newExpandedState);
      setActiveNodeId(id);
      setAutoRotate(false);

      const relatedItems = getRelatedItems(id);
      const newPulseEffect: Record<number, boolean> = {};
      relatedItems.forEach((relId) => {
        newPulseEffect[relId] = true;
      });
      setPulseEffect(newPulseEffect);
      
      centerViewOnNode(id);
    } else {
      // Toggle the current card
      setExpandedItems((prev) => {
        const newExpandedState = { ...prev, [id]: !isCurrentlyExpanded };

        if (!isCurrentlyExpanded) {
          setActiveNodeId(id);
          setAutoRotate(false);
          const relatedItems = getRelatedItems(id);
          const newPulseEffect: Record<number, boolean> = {};
          relatedItems.forEach((relId) => {
            newPulseEffect[relId] = true;
          });
          setPulseEffect(newPulseEffect);
          centerViewOnNode(id);
        } else {
          closeAllCards();
        }
        
        return newExpandedState;
      });
    }
  };


  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = isClient ? window.innerWidth * 0.6 / 2 * 0.7 : 350;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.sin(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );
     const scale = 0.8 + 0.2 * ((1 + Math.sin(radian)) / 2);


    return { x, y, angle, zIndex, opacity, scale };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-black bg-primary border-primary/50";
      case "in-progress":
        return "text-white bg-blue-500 border-blue-500/50";
      case "pending":
        return "text-white/80 bg-white/20 border-white/30";
      default:
        return "text-white/80 bg-white/20 border-white/30";
    }
  };
  
  if (!isClient) {
    return null;
  }

  const getStatusText = (status: TimelineItem["status"]): string => {
    if (status === "completed") {
      return "Completado";
    }
    return status.replace('-', ' ');
  };

  return (
    <TooltipProvider>
      <div
        className="w-full pt-20 pb-32 flex flex-col items-center justify-center text-white overflow-hidden relative"
        ref={containerRef}
        onClick={handleContainerClick}
      >
        {isAnyCardOpen && (
          <div 
            className="fixed inset-0 z-40 bg-transparent"
            onClick={closeAllCards}
          />
        )}

        <div className="text-center mb-16 z-20">
          <div className="inline-flex items-center gap-2 mb-4 text-sm font-bold tracking-widest uppercase text-primary">
            <Zap className="w-4 h-4" />
            QUEM SOMOS
          </div>
          <h2 id="diferenciais-title" className="text-4xl md:text-5xl font-bold tracking-tighter">
            <span className="text-white">Conheça a</span>{" "}
            <span className="relative inline-block text-primary">
              Fusion Pay
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/70 rounded-full blur-[6px]"></span>
            </span>
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-white">
            Somos mais que um gateway de pagamento. Somos o parceiro estratégico que impulsiona o crescimento do seu negócio digital.
          </p>
        </div>


        <div className="relative w-full flex items-center justify-center z-10 h-[calc(60vw)] max-h-[800px]" style={{width: '60vw', maxWidth: '1200px'}}>
          <div
            className="absolute w-full h-full flex items-center justify-center"
            ref={orbitRef}
            style={{
              perspective: "1000px",
              transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
            }}
          >
            <div className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-primary/50 via-primary/20 to-transparent animate-pulse flex items-center justify-center z-10">
              <div className="absolute w-56 h-56 rounded-full border border-primary/30 animate-ping opacity-80"></div>
              <div
                className="absolute w-64 h-64 rounded-full border border-primary/20 animate-ping opacity-60"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <Image src="https://i.imgur.com/m3UqTHp.png" alt="Fusion Pay Icon" width={96} height={96} className="w-24 h-24 rounded-full bg-primary/90 backdrop-blur-md" />
            </div>

            <div className="absolute w-full h-full rounded-full border border-border/20"></div>

            {timelineData.map((item, index) => {
              const position = calculateNodePosition(index, timelineData.length);
              const isExpanded = expandedItems[item.id];
              const Icon = item.icon;

              const nodeSize = isClient ? window.innerWidth * 0.08 : 120;

              const nodeStyle: React.CSSProperties = {
                transform: `translate(${position.x}px, ${position.y}px) scale(${isExpanded ? 1.1 : position.scale})`,
                zIndex: isExpanded ? 200 : position.zIndex,
                opacity: isExpanded ? 1 : position.opacity,
              };

              return (
                <div
                  key={item.id}
                  ref={(el) => (nodeRefs.current[item.id] = el)}
                  className="absolute transition-all duration-700"
                  style={nodeStyle}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <CircleAction 
                          label={item.title}
                          icon={<Icon size={32} />}
                          onClick={(e:any) => {
                            e.stopPropagation();
                            toggleItem(item.id);
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    {!isExpanded && (
                      <TooltipContent>
                        <p>Clique para ver detalhes</p>
                      </TooltipContent>
                    )}
                  </Tooltip>

                  {isExpanded && (
                    <Card
                      className="absolute top-[calc(100%+1rem)] left-1/2 -translate-x-1/2 w-72 bg-black/80 backdrop-blur-lg border-border/80 shadow-xl shadow-black/20 overflow-visible z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-border/80"></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <Badge
                            className={`px-2 py-0.5 text-xs ${getStatusStyles(
                              item.status
                            )}`}
                          >
                            {getStatusText(item.status)}
                          </Badge>
                          <span className="text-xs font-mono text-white">
                            {item.date}
                          </span>
                        </div>
                        <CardTitle className="text-lg mt-2 text-white">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-white">
                        <p>{item.content}</p>

                        <div className="mt-4 pt-3 border-t border-border/50">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="flex items-center">
                              <Zap size={12} className="mr-1 text-primary" />
                              Energy Level
                            </span>
                            <span className="font-mono text-white">{item.energy}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary/50 to-primary"
                              style={{ width: `${item.energy}%` }}
                            ></div>
                          </div>
                        </div>

                        {item.relatedIds.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-border/50">
                            <div className="flex items-center mb-2">
                              <LinkIcon size={12} className="text-white mr-1" />
                              <h4 className="text-sm uppercase tracking-wider font-medium text-white">
                                Connected Nodes
                              </h4>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {item.relatedIds.map((relatedId) => {
                                const relatedItem = timelineData.find(
                                  (i) => i.id === relatedId
                                );
                                return (
                                  <Button
                                    key={relatedId}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center h-7 px-2.5 py-1 text-xs rounded-md border-border bg-transparent hover:bg-accent text-white hover:text-accent-foreground transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleItem(relatedId);
                                    }}
                                  >
                                    {relatedItem?.title}
                                    <ArrowRight
                                      size={10}
                                      className="ml-1.5 text-white"
                                    />
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
