'use client';

import { useEffect, useRef } from 'react';

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: any[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((window.innerWidth * window.innerHeight) / 2000); // Density
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 2000 + 1, // Depth for 3D effect
          radius: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.8 ? '#f59e0b' : Math.random() > 0.5 ? '#22d3ee' : '#ffffff', // Amber, Cyan, White
          speed: Math.random() * 2 + 0.5
        });
      }
    };

    const drawStars = () => {
      // Deep space gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, '#0a0014'); // Deep purple-black center
      gradient.addColorStop(1, '#000000'); // Pure black edges

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render stars moving forward
      ctx.translate(canvas.width / 2, canvas.height / 2);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move star closer
        star.z -= star.speed;
        
        // Reset if passed camera
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
          star.z = 2000;
        }

        // Perspective projection
        const k = 1000 / star.z;
        const x = star.x * k;
        const y = star.y * k;
        const size = star.radius * k;

        // Draw star
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        
        // Glow effect
        ctx.shadowBlur = size * 3;
        ctx.shadowColor = star.color;
        ctx.fillStyle = star.color;
        
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      animationFrameId = requestAnimationFrame(drawStars);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawStars();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-black"
    />
  );
}
