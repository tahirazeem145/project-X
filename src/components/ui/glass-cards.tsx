import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cardData, CardItem } from '../../lib/utils';
import { ExternalLink, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CardProps {
    card: CardItem;
    index: number;
    totalCards: number;
}

const StackingCardItem: React.FC<CardProps> = ({ card, index, totalCards }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cardEl = cardRef.current;
        const containerEl = containerRef.current;
        if (!cardEl || !containerEl) return;

        const targetScale = 1 - (totalCards - index) * 0.04;

        // Animate card scale as you scroll past it
        const trigger = ScrollTrigger.create({
            trigger: containerEl,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const scale = gsap.utils.interpolate(1, targetScale, progress);
                gsap.set(cardEl, {
                    scale: Math.max(scale, targetScale),
                    transformOrigin: "center top",
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
                position: 'sticky',
                top: 0,
                zIndex: index + 10,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 20px',
                pointerEvents: 'none',
            }}
        >
            <div
                ref={cardRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '960px',
                    height: '460px',
                    top: `calc(-2vh + ${index * 22}px)`,
                    borderRadius: '26px',
                    isolation: 'isolate',
                    boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.85)',
                    transformOrigin: 'center top',
                    pointerEvents: 'auto',
                }}
                className="stacked-glass-card"
            >
                {/* Subtle Refined Border Glow */}
                <div
                    style={{
                        position: 'absolute',
                        inset: '-1px',
                        borderRadius: '27px',
                        padding: '1px',
                        background: `conic-gradient(
                            from 0deg,
                            transparent 0deg,
                            ${card.color.replace('0.8', '0.3')} 60deg,
                            ${card.color.replace('0.8', '0.2')} 120deg,
                            transparent 180deg,
                            ${card.color.replace('0.8', '0.15')} 240deg,
                            transparent 360deg
                        )`,
                        opacity: 0.35,
                        zIndex: -1,
                    }}
                />

                {/* Glass Card Main Body */}
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'grid',
                        gridTemplateColumns: card.image ? '1.1fr 0.9fr' : '1fr',
                        borderRadius: '26px',
                        background: `
                            linear-gradient(145deg, 
                                rgba(255, 255, 255, 0.09) 0%, 
                                rgba(15, 19, 27, 0.95) 45%,
                                rgba(56, 189, 248, 0.05) 100%
                            )
                        `,
                        backdropFilter: 'blur(28px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Left Details Panel */}
                    <div
                        style={{
                            padding: '34px 32px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            zIndex: 2,
                            textAlign: 'left',
                        }}
                    >
                        <div>
                            {/* Meta Tags Row */}
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                                {card.category && (
                                    <span
                                        style={{
                                            background: `${card.color.replace('0.8', '0.2')}`,
                                            color: card.color.replace('0.8', '1'),
                                            border: `1px solid ${card.color.replace('0.8', '0.4')}`,
                                            padding: '3px 12px',
                                            borderRadius: '9999px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            textTransform: 'lowercase',
                                        }}
                                    >
                                        {card.category}
                                    </span>
                                )}
                                {card.year && (
                                    <span
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.08)',
                                            color: '#94a3b8',
                                            padding: '3px 10px',
                                            borderRadius: '9999px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                        }}
                                    >
                                        {card.year}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h3
                                style={{
                                    fontSize: '22px',
                                    fontWeight: '800',
                                    color: '#ffffff',
                                    marginBottom: '8px',
                                    lineHeight: '1.3',
                                }}
                            >
                                {card.title}
                            </h3>

                            {/* Description */}
                            <p
                                style={{
                                    fontSize: '13.5px',
                                    color: '#94a3b8',
                                    lineHeight: '1.5',
                                    marginBottom: '14px',
                                }}
                            >
                                {card.description}
                            </p>

                            {/* Metrics Tag */}
                            {card.stats && (
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'rgba(14, 165, 233, 0.14)',
                                        border: '1px solid rgba(56, 189, 248, 0.25)',
                                        padding: '6px 12px',
                                        borderRadius: '10px',
                                        fontSize: '12px',
                                        color: '#38bdf8',
                                        fontWeight: '600',
                                        marginBottom: '14px',
                                    }}
                                >
                                    <Sparkles size={13} />
                                    <span>{card.stats}</span>
                                </div>
                            )}

                            {/* Tech Stack Pills */}
                            {card.techStack && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {card.techStack.map((tech, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.07)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: '#cbd5e1',
                                                fontSize: '11px',
                                                padding: '2px 7px',
                                                borderRadius: '6px',
                                            }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Link */}
                        {card.liveUrl && (
                            <a
                                href={card.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.35) 0%, rgba(12, 40, 52, 0.98) 100%)',
                                    border: '1px solid rgba(56, 189, 248, 0.45)',
                                    color: '#ffffff',
                                    padding: '9px 20px',
                                    borderRadius: '9999px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    width: 'fit-content',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                                    transition: 'all 0.25s ease',
                                    marginTop: '12px',
                                }}
                            >
                                <span>Explore Live Project</span>
                                <ExternalLink size={13} />
                            </a>
                        )}
                    </div>

                    {/* Right Image Preview Panel */}
                    {card.image && (
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                minHeight: '240px',
                                background: '#090c12',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={card.image}
                                alt={card.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'top center',
                                    display: 'block',
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to right, rgba(15, 19, 27, 0.88) 0%, transparent 45%)',
                                    pointerEvents: 'none',
                                }}
                            />
                        </div>
                    )}

                    {/* Liquid Specular Shine Highlights */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.03) 50%, transparent 100%)',
                            pointerEvents: 'none',
                            borderRadius: '26px 26px 0 0',
                            zIndex: 1,
                        }}
                    />

                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            right: '10px',
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                            borderRadius: '1px',
                            pointerEvents: 'none',
                            zIndex: 1,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export const StackedCards: React.FC = () => {
    return (
        <section
            className="our-work-stacked-section"
            style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                background: 'transparent',
                paddingTop: '60px',
                paddingBottom: '20vh',
            }}
        >
            {/* Section Header Title */}
            <div
                style={{
                    maxWidth: '1280px',
                    margin: '0 auto 20px',
                    padding: '0 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    userSelect: 'none',
                }}
            >
                <span
                    style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#38bdf8',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                        display: 'block',
                    }}
                >
                    OUR WORK
                </span>
                <h2
                    style={{
                        fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                        fontWeight: '800',
                        color: '#ffffff',
                        letterSpacing: '-1.2px',
                        margin: '0 0 12px',
                        lineHeight: '1.15',
                    }}
                >
                    A few things we've built
                </h2>
                <p
                    style={{
                        fontSize: '16px',
                        color: '#94a3b8',
                        maxWidth: '620px',
                        margin: 0,
                        lineHeight: '1.55',
                    }}
                >
                    Job boards, e-commerce sites, SaaS dashboards. Real projects we designed, built, and launched.
                </p>
            </div>

            {/* Stacking Cards Feed */}
            <div style={{ width: '100%', position: 'relative' }}>
                {cardData.map((card, index) => (
                    <StackingCardItem
                        key={card.id}
                        card={card}
                        index={index}
                        totalCards={cardData.length}
                    />
                ))}
            </div>
        </section>
    );
};

export default StackedCards;
