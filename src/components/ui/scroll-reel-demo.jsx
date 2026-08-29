import React from 'react';
import { ScrollReelTestimonials } from "./scroll-reel-testimonials";

const TESTIMONIALS = [
  {
    quote: "The website was absolutely fantastic and launched on time.",
    author: "Ansari Jr — Tamil Nadu, India",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop",
    alt: "Portrait of Ansari Jr",
  },
  {
    quote: "Affordable, fast delivery, and customer-friendly.",
    author: "Suriyaprakash Mahendran — Kuala Lumpur, Malaysia",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop",
    alt: "Portrait of Suriyaprakash Mahendran",
  },
  {
    quote: "Excellent service and project delivered on time. Highly recommend!",
    author: "Winne — Kuala Lumpur, Malaysia",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop",
    alt: "Portrait of Winne",
  },
];

export default function ScrollReelDemo() {
  return (
    <div className="flex min-h-[380px] items-center justify-center p-4">
      <ScrollReelTestimonials testimonials={TESTIMONIALS} />
    </div>
  );
}
