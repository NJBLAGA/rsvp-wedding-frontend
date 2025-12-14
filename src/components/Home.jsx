import { useEffect, useRef } from "react";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";
import WeddingImage from "../assets/us.JPG";

export default function Home() {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const petalArrayRef = useRef([]);

  // Petal Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!petalArrayRef.current.length) {
      const TOTAL = 12;
      const petalImg = new Image();
      petalImg.src = "https://djjjk9bjm164h.cloudfront.net/petal.png";

      class Petal {
        constructor() {
          this.reset();
        }
        reset() {
          this.x = Math.random() * canvas.width;
          this.y =
            Math.random() < 0.5
              ? Math.random() * canvas.height
              : -Math.random() * canvas.height;
          this.w = 16 + Math.random() * 10;
          this.h = 12 + Math.random() * 8;
          this.opacity = 0.8;
          this.ySpeed = 0.05 + Math.random() * 0.1;
          this.angle = Math.random() * Math.PI * 2;
          this.angleSpeed = 0.003 + Math.random() * 0.002;
          this.swayDistance = 60;
        }
        draw() {
          ctx.globalAlpha = this.opacity;
          ctx.drawImage(
            petalImg,
            this.x + Math.sin(this.angle) * this.swayDistance,
            this.y,
            this.w,
            this.h,
          );
        }
        animate() {
          this.y += this.ySpeed;
          this.angle += this.angleSpeed;
          if (this.y > canvas.height + 20) {
            this.reset();
            this.y = -20;
          }
          this.draw();
        }
      }

      petalImg.addEventListener("load", () => {
        for (let i = 0; i < TOTAL; i++) {
          petalArrayRef.current.push(new Petal());
        }
        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          petalArrayRef.current.forEach((p) => p.animate());
          animationIdRef.current = requestAnimationFrame(render);
        };
        render();
      });
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-start overflow-hidden">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-wedding"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />

      {/* Petals */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Page content */}
      <div className="relative z-20 flex flex-col items-center justify-start w-full px-4">
        <h1
          className="text-center text-black font-bold mb-2"
          style={{
            fontFamily: "'Dancing Script', cursive",
          }}
        >
          Our Special Day
        </h1>

        {/* Card */}
        <div className="card mt-0 bg-transparent border-none shadow-none flex flex-col items-center">
          <figure className="w-full flex justify-center">
            <img
              src={WeddingImage}
              alt="Wedding couple"
              className="rounded-t-lg object-cover opacity-95"
            />
          </figure>
          <div className="card-body text-center p-2 bg-transparent w-full">
            <h2
              className="font-bold"
              style={{
                fontFamily: "'Dancing Script', cursive",
              }}
            >
              Saturday, 14th March, 2026
            </h2>
            <h3 className="font-semibold mt-1">
              Camden Valley Inn, Remembrance Dr, Cawdor NSW, Australia
            </h3>
            <p className="mt-1">
              Join us in celebrating our love! We can't wait to share our
              special day with you.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .bg-wedding {
          background-position: center;
          background-repeat: no-repeat;
        }
        @media (min-width: 1024px) {
          .bg-wedding {
            background-size: contain;
            background-position: top center;
          }
        }
        @media (max-width: 1023px) {
          .bg-wedding {
            background-size: cover;
          }
        }

        /* Base defaults */
        h1 { font-size: 2rem; margin-top: 5rem; }
        h2 { font-size: 1.2rem; color: rgba(0,0,0,0.85); }
        h3 { font-size: 0.8rem; color: rgba(0,0,0,0.8); }
        p { font-size: 0.75rem; color: rgba(0,0,0,0.8); }
        img { width: 260px; height: 360px; }

        /* SE2 and extra small devices (<=380px) */
        @media (max-width: 380px) {
          h1 { font-size: 1.6rem !important; margin-top: 4.2rem !important; } /* more margin */
          h2 { font-size: 0.95rem !important; }
          h3 { font-size: 0.6rem !important; }
          p { font-size: 0.6rem !important; }
          img { width: 180px !important; height: 260px !important; }
          .card { width: 90%; max-width: 240px; }
        }

        /* Small mobiles (381px–639px) */
        @media (max-width: 639px) and (min-width: 381px) {
          h1 { font-size: 1.8rem !important; margin-top: 5rem !important; } /* more margin */
          h2 { font-size: 1rem !important; }
          h3 { font-size: 0.65rem !important; }
          p { font-size: 0.65rem !important; }
          img { width: 220px !important; height: 300px !important; }
          .card { width: 95%; max-width: 280px; }
        }

        /* Tablet (640px–1023px) */
        @media (min-width: 640px) and (max-width: 1023px) {
          h1 { font-size: 2.4rem !important; margin-top: 6rem !important; } /* reduced */
          h2 { font-size: 1.2rem !important; }
          h3 { font-size: 0.75rem !important; }
          p { font-size: 0.7rem !important; }
          img { width: 280px !important; height: 400px !important; }
          .card { width: 55%; max-width: 340px; }
        }

        /* Desktop (≥1024px) */
         @media (min-width: 1024px) and (max-height: 820px) {
          h1 { font-size: 2rem !important; margin-top: 4rem !important; }
          h2 { font-size: 1.2rem !important; }
          h3 { font-size: 0.6rem !important; }
          p { font-size: 0.7rem !important; }
          img { width: 200px !important; height: 300px !important; }
          .card { width: 50%; max-width: 360px; }
        }

       /* Desktop — 15 inch and larger */
       @media (min-width: 1024px) and (min-height: 821px) {
       h1 { font-size: 3rem !important; margin-top: 8rem !important; }
       h2 { font-size: 1.4rem !important; }
       h3 { font-size: 0.8rem !important; }
       p  { font-size: 0.75rem !important; }
       img { width: 260px !important; height: 360px !important; }
       .card { width: 50%; max-width: 360px; }
      }
      `}</style>
    </div>
  );
}
