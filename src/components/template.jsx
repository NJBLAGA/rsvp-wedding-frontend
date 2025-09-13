import { useEffect, useRef } from "react";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";

export default function MobilePageTemplate({ children }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const TOTAL = 60; // slightly fewer petals for a cleaner look
    const petalArray = [];
    const petalImg = new Image();
    petalImg.src = "https://djjjk9bjm164h.cloudfront.net/petal.png";

    class Petal {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 2 - canvas.height;
        this.w = 20 + Math.random() * 10;
        this.h = 15 + Math.random() * 5;
        this.opacity = this.w / 50;
        this.flip = Math.random();
        this.xSpeed = 0.05 + Math.random() * 0.1; // slower for subtle animation
        this.ySpeed = 0.03 + Math.random() * 0.1;
        this.flipSpeed = Math.random() * 0.01;
      }
      draw() {
        if (this.y > canvas.height || this.x > canvas.width) {
          this.x = -20;
          this.y = Math.random() * canvas.height * 2 - canvas.height;
          this.xSpeed = 0.05 + Math.random() * 0.1;
          this.ySpeed = 0.03 + Math.random() * 0.1;
          this.flip = Math.random();
        }
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
          petalImg,
          this.x,
          this.y,
          this.w * (0.6 + Math.abs(Math.cos(this.flip)) / 3),
          this.h * (0.8 + Math.abs(Math.sin(this.flip)) / 5),
        );
      }
      animate() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.flip += this.flipSpeed;
        this.draw();
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petalArray.forEach((p) => p.animate());
      requestAnimationFrame(render);
    };

    petalImg.addEventListener("load", () => {
      for (let i = 0; i < TOTAL; i++) {
        petalArray.push(new Petal());
      }
      render();
    });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex justify-center items-start overflow-hidden px-4 sm:px-6">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />

      {/* Petals Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-md mx-auto mt-10 sm:mt-16 px-4 text-center">
        {children}
      </div>

      <style>{`
        .bg-cover {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .bg-cover {
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
          }
        }

        @media (min-width: 1024px) {
          .bg-cover {
            background-size: contain;
            background-position: top center;
            background-repeat: no-repeat;
          }
        }
      `}</style>
    </div>
  );
}
