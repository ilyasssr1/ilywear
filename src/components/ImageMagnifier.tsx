'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageMagnifierProps {
  src: string;
  alt: string;
}

export default function ImageMagnifier({ src, alt }: ImageMagnifierProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    // Calculate cursor position relative to the image
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Calculate percentage position for background
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    setPosition({ x: xPercent, y: yPercent });
    setCursorPosition({ x, y });
  };

  return (
    <div
      className="relative w-full h-full cursor-crosshair overflow-hidden rounded-[2.5rem] bg-gray-50"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-opacity duration-300"
        style={{ opacity: showMagnifier ? 0 : 1 }}
        priority
      />

      {showMagnifier && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: '250%', // Zoom level
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
      
      {/* Custom Cursor Ring */}
      {showMagnifier && (
        <div 
          className="absolute w-16 h-16 border-2 border-accent/50 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-20 backdrop-invert mix-blend-difference"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`
          }}
        />
      )}
    </div>
  );
}
