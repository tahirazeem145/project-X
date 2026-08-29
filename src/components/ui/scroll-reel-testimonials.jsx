"use client";

import * as React from "react";

/* ----------------------------------------------------------------
 * ScrollReelTestimonials
 *
 * Counter-rotating scroll reel + per-character text rise.
 * ---------------------------------------------------------------- */

const CELL = 121.33;
const GAP = 8;
const STEP = 3 * (CELL + GAP);

const EXIT_MS = 240;
const SLIDE_MS = 800;

const EASE_INOUT = "cubic-bezier(0.65, 0, 0.35, 1)";

const FEATURED_SHADOW =
  "0 1.008px 0.705px -0.563px rgba(0,0,0,0.18), 0 2.389px 1.672px -1.125px rgba(0,0,0,0.17), 0 4.357px 3.05px -1.688px rgba(0,0,0,0.17), 0 7.244px 5.07px -2.25px rgba(0,0,0,0.16), 0 11.698px 8.188px -2.813px rgba(0,0,0,0.15), 0 19.148px 13.404px -3.375px rgba(0,0,0,0.13), 0 32.972px 23.08px -3.938px rgba(0,0,0,0.09), 0 60px 42px -4.5px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.6)";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* Blurred placeholder cell */
function Cell() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: `${CELL}px`,
        height: `${CELL}px`,
        minWidth: `${CELL}px`,
        minHeight: `${CELL}px`,
        flexShrink: 0,
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(4px)",
      }}
    />
  );
}

/* Featured portrait tile with desaturation + gradient sheen overlays */
function Featured({ src, alt }) {
  return (
    <div
      style={{
        width: `${CELL}px`,
        height: `${CELL}px`,
        minWidth: `${CELL}px`,
        minHeight: `${CELL}px`,
        flexShrink: 0,
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        boxShadow: FEATURED_SHADOW,
        border: "1px solid rgba(255, 255, 255, 0.25)",
        backgroundColor: "#0b101b",
      }}
    >
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
        }}
      />
      {/* desaturate via saturation blend */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          mixBlendMode: "saturation",
        }}
      />
      {/* diagonal gradient sheen */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          filter: "blur(4px)",
          mixBlendMode: "overlay",
          background:
            "linear-gradient(220.99deg, rgba(14,165,233,0) 32%, rgb(56,189,248) 41%, rgb(173,177,255) 47%, rgba(45,212,191,0.57) 54%, rgba(45,212,191,0) 65%)",
        }}
      />
    </div>
  );
}

/* Per-character split */
function Chars({ text, startIndex, staggerMs }) {
  let idx = startIndex;
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => {
        const wordSpan = (
          <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs;
              idx++;
              return (
                <span
                  key={ci}
                  className="scroll-reel-char"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        if (wi < words.length - 1) idx++;
        return (
          <React.Fragment key={wi}>
            {wordSpan}
            {wi < words.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

export function ScrollReelTestimonials({
  testimonials,
  charStaggerMs = 6,
  className,
}) {
  const [index, setIndex] = React.useState(0);
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const animating = React.useRef(false);
  const timeouts = React.useRef([]);

  const count = testimonials.length;

  React.useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setMounted(true))
    );
    return () => {
      cancelAnimationFrame(raf);
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  const paginate = React.useCallback(
    (dir) => {
      if (animating.current) return;
      const next = index + dir;
      if (next < 0 || next >= count) return;
      animating.current = true;

      setIndex(next);
      setExiting(true);

      timeouts.current.push(
        setTimeout(() => {
          setDisplayIndex(next);
          setExiting(false);
        }, EXIT_MS)
      );
      timeouts.current.push(
        setTimeout(() => {
          animating.current = false;
        }, SLIDE_MS)
      );
    },
    [index, count]
  );

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      paginate(-1);
    }
  };

  /* Middle column: 3 leading cells, then featured + 2 cells between
   * each testimonial, then 3 trailing cells. */
  const middleItems = React.useMemo(() => {
    const items = [];
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    testimonials.forEach((_, i) => {
      items.push({ type: "featured", i });
      if (i < count - 1) {
        items.push({ type: "cell" }, { type: "cell" });
      }
    });
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    return items;
  }, [testimonials, count]);

  const sideCellCount = 4 + 2 * count;
  const centerIdx = (count - 1) / 2;
  const middleY = (centerIdx - index) * STEP;
  const sideY = -middleY;

  const colStyle = (y) => ({
    display: "flex",
    flexDirection: "column",
    gap: `${GAP}px`,
    flexShrink: 0,
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE_INOUT}` : "none",
    willChange: "transform",
  });

  const current = testimonials[displayIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        "scroll-reel-wrapper",
        className
      )}
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        maxWidth: "1060px",
        flexDirection: "row",
        alignItems: "stretch",
        gap: "10px",
        overflow: "hidden",
        borderRadius: "32px",
        border: "1px solid rgba(255, 255, 255, 0.16)",
        borderTop: "1px solid rgba(255, 255, 255, 0.35)",
        background: "radial-gradient(ellipse 90% 70% at 85% 15%, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.03) 45%, transparent 75%), linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(13, 17, 26, 0.8) 45%, rgba(18, 24, 36, 0.7) 85%, rgba(56, 189, 248, 0.04) 100%)",
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        boxShadow: "inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.4), 0 20px 55px rgba(0, 0, 0, 0.55)",
        outline: "none",
        minHeight: "340px",
      }}
    >
      {/* Reel section */}
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          width: "380px",
          height: "auto",
          flexShrink: 0,
          alignSelf: "stretch",
          overflow: "hidden",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: `${GAP}px`,
          }}
        >
          {/* Left column */}
          <div style={colStyle(sideY)}>
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>

          {/* Middle column */}
          <div style={colStyle(middleY)}>
            {middleItems.map((item, i) =>
              item.type === "featured" ? (
                <Featured
                  key={i}
                  src={testimonials[item.i].image}
                  alt={testimonials[item.i].alt}
                />
              ) : (
                <Cell key={i} />
              )
            )}
          </div>

          {/* Right column */}
          <div style={colStyle(sideY)}>
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div
        style={{
          display: "flex",
          minWidth: 0,
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          alignSelf: "stretch",
          padding: "36px 32px 32px 24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <svg
            style={{ display: "block", width: "36px", height: "36px", color: "rgba(56, 189, 248, 0.4)" }}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4.58 17.32C3.55 16.23 3 15 3 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18zm10 0C13.55 16.23 13 15 13 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18z" />
          </svg>

          {/* Text stage */}
          <div
            style={{ position: "relative", width: "100%", maxWidth: "460px", overflow: "hidden" }}
            aria-live="polite"
          >
            <div
              aria-hidden="true"
              style={{
                visibility: "hidden",
                display: "flex",
                minHeight: "130px",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <p style={{ margin: 0, fontSize: "20px", fontWeight: 600, lineHeight: 1.4, color: "#ffffff" }}>
                "{current.quote}"
              </p>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#94a3b8" }}>
                {current.author}
              </p>
            </div>
            <div
              key={displayIndex}
              className={cn(exiting && "scroll-reel-exit")}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                willChange: "transform, opacity",
              }}
            >
              <p style={{ margin: 0, fontSize: "20px", fontWeight: 600, lineHeight: 1.4, color: "#ffffff" }}>
                "
                <Chars
                  text={current.quote}
                  startIndex={0}
                  staggerMs={charStaggerMs}
                />
                "
              </p>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#94a3b8" }}>
                <Chars
                  text={current.author}
                  startIndex={current.quote.length + 6}
                  staggerMs={charStaggerMs}
                />
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={() => paginate(-1)}
            disabled={index === 0}
            aria-label="Previous testimonial"
            style={{
              display: "grid",
              placeItems: "center",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.06)",
              color: "#ffffff",
              cursor: index === 0 ? "default" : "pointer",
              opacity: index === 0 ? 0.3 : 1,
              transition: "all 0.2s ease",
            }}
          >
            <svg
              style={{ width: "14px", height: "14px" }}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.5 2.5 3.5 6l4 3.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            disabled={index === count - 1}
            aria-label="Next testimonial"
            style={{
              display: "grid",
              placeItems: "center",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.06)",
              color: "#ffffff",
              cursor: index === count - 1 ? "default" : "pointer",
              opacity: index === count - 1 ? 0.3 : 1,
              transition: "all 0.2s ease",
            }}
          >
            <svg
              style={{ width: "14px", height: "14px" }}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m4.5 2.5 4 3.5-4 3.5" />
            </svg>
          </button>
          <span style={{ marginLeft: "6px", fontSize: "12px", fontWeight: 600, color: "#94a3b8" }}>
            {index + 1} / {count}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ScrollReelTestimonials;
