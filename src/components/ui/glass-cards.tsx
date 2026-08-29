import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cardData } from '../../lib/utils';
import { ExternalLink, Layers, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CardProps {
    id: number;
    title: string;
    description: string;
    index: number;
    totalCards: number;
    color: string;
    image?: string;
    category?: string;
    year?: string;
    techStack?: string[];
    stats?: string;
    liveUrl?: string;
}

const Card: React.FC<CardProps> = ({ 
    title, 
    description, 
    index, 
    totalCards, 
    color,
    image,
    category,
    year,
    techStack,
    stats,
    liveUrl
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        const container = containerRef.current;
        if (!card || !container) return;

        const targetScale = 1 - (totalCards - index) * 0.05;

        // Set initial state
        gsap.set(card, {
            scale: 1,
            transformOrigin: "center top"
        });

        // Create scroll trigger for stacking effect
        const trigger = ScrollTrigger.create({
            trigger: container,
            start: "top center",
            end: "bottom center",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const scale = gsap.utils.interpolate(1, targetScale, progress);

                gsap.set(card, {
                    scale: Math.max(scale, targetScale),
                    transformOrigin: "center top"
                });
            }
        });

        return () => {
            trigger.kill();
        };
    }, [index, totalCards]);

    return (
        <div
            ref={containerRef}
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'sticky',
                top: 0,
                zIndex: index + 1
            }}
        >
            <div
                ref={cardRef}
                style={{
                    position: 'relative',
                    width: '85%',
                    maxWidth: '920px',
                    minHeight: '480px',
                    borderRadius: '24px',
                    isolation: 'isolate',
                    top: `calc(-5vh + ${index * 25}px)`,
                    transformOrigin: 'top'
                }}
                className="card-content"
            >
                {/* Electric Border Effect */}
                <div
                    style={{
                        position: 'absolute',
                        inset: '-3px',
                        borderRadius: '27px',
                        padding: '3px',
                        background: `conic-gradient(
                            from 0deg,
                            transparent 0deg,
                            ${color} 60deg,
                            ${color.replace('0.8', '0.6')} 120deg,
                            transparent 180deg,
                            ${color.replace('0.8', '0.4')} 240deg,
                            transparent 360deg
                        )`,
                        zIndex: -1
                    }}
                />

                {/* Main Card Content */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    gridTemplateColumns: image ? '1fr 1fr' : '1fr',
                    borderRadius: '24px',
                    background: `
                        linear-gradient(145deg, 
                            rgba(255, 255, 255, 0.08), 
                            rgba(15, 19, 27, 0.9)
                        )
                    `,
                    backdropFilter: 'blur(25px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: `
                        0 8px 32px rgba(0, 0, 0, 0.5),
                        0 2px 8px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.1)
                    `,
                    overflow: 'hidden'
                }}>
                    {/* Left Column / Details */}
                    <div style={{
                        padding: '36px 32px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        zIndex: 2,
                        textAlign: 'left'
                    }}>
                        <div>
                            {/* Tags */}
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                                {category && (
                                    <span style={{
                                        background: `${color.replace('0.8', '0.15')}`,
                                        color: color.replace('0.8', '1'),
                                        border: `1px solid ${color.replace('0.8', '0.35')}`,
                                        padding: '4px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        textTransform: 'lowercase'
                                    }}>
                                        {category}
                                    </span>
                                )}
                                {year && (
                                    <span style={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        color: '#94a3b8',
                                        padding: '4px 10px',
                                        borderRadius: '9999px',
                                        fontSize: '12px',
                                        fontWeight: '500'
                                    }}>
                                        {year}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: '800',
                                color: '#ffffff',
                                marginBottom: '12px',
                                lineHeight: '1.3'
                            }}>
                                {title}
                            </h3>

                            {/* Description */}
                            <p style={{
                                fontSize: '14.5px',
                                color: '#94a3b8',
                                lineHeight: '1.6',
                                marginBottom: '20px'
                            }}>
                                {description}
                            </p>

                            {/* Stats Highlight */}
                            {stats && (
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '8px 14px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    color: '#38bdf8',
                                    fontWeight: '600',
                                    marginBottom: '18px'
                                }}>
                                    <Sparkles size={14} />
                                    <span>{stats}</span>
                                </div>
                            )}

                            {/* Tech Stack */}
                            {techStack && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                                    {techStack.map((tech, i) => (
                                        <span key={i} style={{
                                            background: 'rgba(255, 255, 255, 0.06)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            color: '#cbd5e1',
                                            fontSize: '11.5px',
                                            padding: '3px 8px',
                                            borderRadius: '6px'
                                        }}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Link */}
                        {liveUrl && (
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.3) 0%, rgba(12, 40, 52, 0.95) 100%)',
                                    border: '1px solid rgba(56, 189, 248, 0.4)',
                                    color: '#ffffff',
                                    padding: '10px 20px',
                                    borderRadius: '9999px',
                                    fontSize: '13.5px',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    width: 'fit-content',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span>Explore Live Project</span>
                                <ExternalLink size={14} />
                            </a>
                        )}
                    </div>

                    {/* Right Column / Project Image Preview */}
                    {image && (
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            minHeight: '260px',
                            background: '#090c12',
                            overflow: 'hidden'
                        }}>
                            <img
                                src={image}
                                alt={title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'top center',
                                    display: 'block'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to right, rgba(15, 19, 27, 0.8) 0%, transparent 40%)',
                                pointerEvents: 'none'
                            }} />
                        </div>
                    )}

                    {/* Enhanced Glass reflection overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
                        pointerEvents: 'none',
                        borderRadius: '24px 24px 0 0',
                        zIndex: 1
                    }} />

                    {/* Glass shine effect */}
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        right: '10px',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                        borderRadius: '1px',
                        pointerEvents: 'none',
                        zIndex: 1
                    }} />

                    {/* Side glass reflection */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '2px',
                        height: '100%',
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
                        borderRadius: '24px 0 0 24px',
                        pointerEvents: 'none',
                        zIndex: 1
                    }} />

                    {/* Frosted glass texture */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `
                            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 2px),
                            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 1px, transparent 2px),
                            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06) 1px, transparent 2px)
                        `,
                        backgroundSize: '30px 30px, 25px 25px, 35px 35px',
                        pointerEvents: 'none',
                        borderRadius: '24px',
                        opacity: 0.7,
                        zIndex: 1
                    }} />
                </div>
            </div>
        </div>
    );
};

export const StackedCards: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        gsap.fromTo(container,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1.2,
                ease: "power2.out"
            }
        );
    }, []);

    return (
        <section ref={containerRef} className="our-work-stacked-section" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            {/* Section Header */}
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '60px 40px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <div style={{ textAlign: 'left', maxWidth: '650px' }}>
                    <span style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#38bdf8',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                        display: 'block'
                    }}>
                        OUR WORK
                    </span>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '800',
                        color: '#ffffff',
                        letterSpacing: '-1px',
                        margin: '0 0 10px',
                        lineHeight: '1.2'
                    }}>
                        A few things we've built
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        color: '#94a3b8',
                        margin: 0,
                        lineHeight: '1.55'
                    }}>
                        Job boards, e-commerce sites, SaaS dashboards. Real projects we designed, built, and launched with scroll-triggered stacking glass depth.
                    </p>
                </div>
            </div>

            {/* GSAP Stacking Cards Section */}
            <div style={{ color: '#ffffff', width: '100%' }}>
                {cardData.map((card, index) => {
                    return (
                        <Card
                            key={card.id}
                            id={card.id}
                            title={card.title}
                            description={card.description}
                            index={index}
                            totalCards={cardData.length}
                            color={card.color}
                            image={card.image}
                            category={card.category}
                            year={card.year}
                            techStack={card.techStack}
                            stats={card.stats}
                            liveUrl={card.liveUrl}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default StackedCards;
