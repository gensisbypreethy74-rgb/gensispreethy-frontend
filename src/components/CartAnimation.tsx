'use client';

import React, { useState } from 'react';

interface CartAnimationProps {
  children: React.ReactNode;
  onAdd: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function CartAnimation({ children, onAdd }: CartAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsAnimating(true);
    onAdd(e);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="relative">
      <style>{`
        @keyframes cartPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .cart-animate {
          animation: cartPulse 0.6s ease-in-out;
        }
      `}</style>
      <div onClick={handleAddToCart} className={isAnimating ? 'cart-animate' : ''}>
        {children}
      </div>
    </div>
  );
}
