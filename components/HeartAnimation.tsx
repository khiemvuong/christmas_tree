
import React, { useEffect, useRef } from 'react';

interface HeartAnimationProps {
  onClose?: () => void;
}

const HeartAnimation: React.FC<HeartAnimationProps> = ({ onClose }) => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const heartCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const heartCanvas = heartCanvasRef.current;
    if (!bgCanvas || !heartCanvas) return;

    let bgAnimationFrameId: number;
    let heartAnimationFrameId: number;

    // ===== BACKGROUND STARS ANIMATION =====
    const initBackgroundStars = () => {
      const ctx = bgCanvas.getContext('2d');
      if (!ctx) return;

      let stars: { x: number; y: number; radius: number; alpha: number; speed: number }[] = [];
      const numStars = 200;

      const createStar = () => ({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.3 + 0.1
      });

      const initCanvas = () => {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        stars = [];
        for (let i = 0; i < numStars; i++) {
          stars.push(createStar());
        }
      };

      const animateStars = () => {
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        ctx.fillStyle = "#fff";

        stars.forEach(star => {
          ctx.globalAlpha = star.alpha;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();

          star.alpha += (Math.random() - 0.5) * 0.05;
          star.alpha = Math.max(0, Math.min(1, star.alpha));
          
          star.y += star.speed;
          if (star.y > bgCanvas.height) {
            star.y = 0;
          }
        });

        ctx.globalAlpha = 1;
        bgAnimationFrameId = requestAnimationFrame(animateStars);
      };

      initCanvas();
      animateStars();

      return initCanvas; // Return resize handler
    };

    // ===== PINK HEART ANIMATION =====
    const initHeartAnimation = () => {
      const context = heartCanvas.getContext('2d');
      if (!context) return;

      const settings = {
        particles: {
          length: 2000,
          duration: 2,
          velocity: 100,
          effect: -1.3,
          size: 13
        }
      };

      class Point {
        x: number;
        y: number;
        constructor(x = 0, y = 0) {
          this.x = x;
          this.y = y;
        }
        clone() { return new Point(this.x, this.y); }
        length(len: number): Point;
        length(): number;
        length(len?: number): number | Point {
          if (len === undefined) return Math.sqrt(this.x * this.x + this.y * this.y);
          this.normalize();
          this.x *= len!;
          this.y *= len!;
          return this;
        }
        normalize() {
          const length = this.length() as number;
          this.x /= length;
          this.y /= length;
          return this;
        }
      }

      class Particle {
        position = new Point();
        velocity = new Point();
        acceleration = new Point();
        age = 0;

        initialize(x: number, y: number, dx: number, dy: number) {
          this.position.x = x;
          this.position.y = y;
          this.velocity.x = dx;
          this.velocity.y = dy;
          this.acceleration.x = dx * settings.particles.effect;
          this.acceleration.y = dy * settings.particles.effect;
          this.age = 0;
        }

        update(deltaTime: number) {
          this.position.x += this.velocity.x * deltaTime;
          this.position.y += this.velocity.y * deltaTime;
          this.velocity.x += this.acceleration.x * deltaTime;
          this.velocity.y += this.acceleration.y * deltaTime;
          this.age += deltaTime;
        }

        draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
          const easeFunction = (t: number) => (--t) * t * t + 1;
          const size = image.width * easeFunction(this.age / settings.particles.duration);
          ctx.globalAlpha = Math.max(0, Math.min(1, 1 - this.age / settings.particles.duration));
          ctx.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
        }
      }

      const particles = (() => {
        const particleArray = new Array(settings.particles.length).fill(null).map(() => new Particle());
        let firstActive = 0;
        let firstFree = 0;
        const duration = settings.particles.duration;

        return {
          add: (x: number, y: number, dx: number, dy: number) => {
            particleArray[firstFree].initialize(x, y, dx, dy);
            firstFree = (firstFree + 1) % settings.particles.length;
            if (firstActive === firstFree) firstActive = (firstActive + 1) % settings.particles.length;
          },
          update: (deltaTime: number) => {
            let i = firstActive;
            if (firstActive < firstFree) {
              for (; i < firstFree; i++) particleArray[i].update(deltaTime);
            } else {
              for (; i < settings.particles.length; i++) particleArray[i].update(deltaTime);
              for (i = 0; i < firstFree; i++) particleArray[i].update(deltaTime);
            }
            while (particleArray[firstActive].age >= duration && firstActive !== firstFree) {
              firstActive = (firstActive + 1) % settings.particles.length;
            }
          },
          draw: (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
            let i = firstActive;
            if (firstActive < firstFree) {
              for (; i < firstFree; i++) particleArray[i].draw(ctx, image);
            } else {
              for (; i < settings.particles.length; i++) particleArray[i].draw(ctx, image);
              for (i = 0; i < firstFree; i++) particleArray[i].draw(ctx, image);
            }
          }
        };
      })();

      const pointOnHeart = (t: number) => new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
      );

      const heartImage = (() => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return new Image();
        tempCanvas.width = settings.particles.size;
        tempCanvas.height = settings.particles.size;

        const convertHeartPoint = (t: number) => {
          const point = pointOnHeart(t);
          point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350;
          point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350;
          return point;
        };

        tempCtx.beginPath();
        let t = -Math.PI;
        let point = convertHeartPoint(t);
        tempCtx.moveTo(point.x, point.y);
        while (t < Math.PI) {
          t += 0.01;
          point = convertHeartPoint(t);
          tempCtx.lineTo(point.x, point.y);
        }
        tempCtx.closePath();
        tempCtx.fillStyle = '#FF5CA4';
        tempCtx.fill();
        const image = new Image();
        image.src = tempCanvas.toDataURL();
        return image;
      })();

      let time: number;
      const render = () => {
        heartAnimationFrameId = requestAnimationFrame(render);
        const newTime = Date.now() / 1000;
        const deltaTime = newTime - (time || newTime);
        time = newTime;

        context.clearRect(0, 0, heartCanvas.width, heartCanvas.height);

        const amount = (settings.particles.length / settings.particles.duration) * deltaTime;
        const scale = Math.min(heartCanvas.width, heartCanvas.height) / 400;

        for (let i = 0; i < amount; i++) {
          const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
          pos.x *= scale;
          pos.y *= scale;
          const dir = pos.clone().length(settings.particles.velocity * scale);
          particles.add(heartCanvas.width / 2 + pos.x, heartCanvas.height / 2 - pos.y, dir.x, -dir.y);
        }

        particles.update(deltaTime);
        particles.draw(context, heartImage);
      };

      const handleResize = () => {
        heartCanvas.width = heartCanvas.clientWidth;
        heartCanvas.height = heartCanvas.clientHeight;
      };

      handleResize();
      render();

      return handleResize;
    };

    const handleBgResize = initBackgroundStars();
    const handleHeartResize = initHeartAnimation();

    const onResize = () => {
      if (handleBgResize) handleBgResize();
      if (handleHeartResize) handleHeartResize();
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(bgAnimationFrameId);
      cancelAnimationFrame(heartAnimationFrameId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center cursor-pointer" onClick={onClose}>
      <canvas ref={bgCanvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="relative z-10 w-[300px] h-[300px] max-w-[70vw] max-h-[70vh] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] animate-beat">
        <canvas ref={heartCanvasRef} className="w-full h-full" />
      </div>
      <style>{`
        @keyframes beat {
          0% { transform: scale(1); }
          30% { transform: scale(0.8); }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-beat {
          animation: beat 1.3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default HeartAnimation;
