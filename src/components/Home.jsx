import { useEffect, useRef } from "react";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";
import WeddingImage from "../assets/us.JPG";

export default function Home() {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const petalArrayRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!petalArrayRef.current.length) {
      const TOTAL = 30;
      const petalImg = new Image();
      petalImg.src = "https://djjjk9bjm164h.cloudfront.net/petal.png";

      class Petal {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height * 2 - canvas.height;
          this.w = 25 + Math.random() * 15;
          this.h = 20 + Math.random() * 10;
          this.opacity = this.w / 50;
          this.flip = Math.random();
          this.xSpeed = 0.2 + Math.random() * 0.15;
          this.ySpeed = 0.1 + Math.random() * 0.15;
          this.flipSpeed = Math.random() * 0.01;
        }
        draw() {
          if (this.y > canvas.height || this.x > canvas.width) {
            this.x = -25;
            this.y = Math.random() * canvas.height * 2 - canvas.height;
            this.xSpeed = 0.2 + Math.random() * 0.15;
            this.ySpeed = 0.1 + Math.random() * 0.15;
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

      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full z-0 bg-desktop"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />

      {/* Petals Canvas */}
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
            fontSize: "2rem",
            marginTop: "6rem",
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
              style={{ width: "300px", height: "400px" }}
            />
          </figure>
          <div className="card-body text-center p-2 bg-transparent w-full">
            <h2
              className="font-bold"
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "1.3rem",
                color: "rgba(0,0,0,0.85)",
              }}
            >
              Saturday, March 14, 2026
            </h2>
            <h3
              className="font-semibold mt-1"
              style={{ fontSize: "0.8rem", color: "rgba(0,0,0,0.8)" }}
            >
              Camden Valley Inn, Remembrance Dr, Cawdor NSW, Australia
            </h3>
            <p
              className="mt-1"
              style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.8)" }}
            >
              Join us in celebrating our love! We can't wait to share our
              special day with you.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        html, body { margin: 0; padding: 0; }

        /* Desktop & Tablet: background contained at top */
        .bg-desktop {
          background-size: contain;
          background-position: top center;
          background-repeat: no-repeat;
        }

        /* Mobile: stretch background to cover full screen */
        @media (max-width: 639px) {
          .bg-desktop {
            background-size: cover;
            background-position: center;
          }
        }

        /* Extra small devices (SE2, <=380px) */
        @media (max-width: 380px) {
          h1 { font-size: 1.8rem !important; margin-top: 4rem !important; }
          h2 { font-size: 1rem !important; }
          h3 { font-size: 0.6rem !important; }
          p { font-size: 0.6rem !important; }
          img { width: 200px !important; height: 280px !important; }
          .card { width: 90%; max-width: 250px; }
        }

        /* Mobile devices (381px–639px) */
        @media (max-width: 639px) and (min-width: 381px) {
          h1 { font-size: 2rem; margin-top: 5rem !important; }
          h2 { font-size: 1rem; }
          h3 { font-size: 0.65rem; }
          p { font-size: 0.55rem; }
          img { width: 250px !important; height: 350px !important; }
          .card { width: 95%; max-width: 300px; }
        }

        /* Tablet (640px–1023px) */
        @media (min-width: 640px) and (max-width: 1023px) {
          h1 { font-size: 2.8rem !important; margin-top: 6rem !important; }
          h2 { font-size: 1.3rem !important; }
          h3 { font-size: 0.75rem !important; }
          p { font-size: 0.65rem !important; }
          img { width: 280px !important; height: 380px !important; }
          .card { width: 50%; max-width: 350px; }
        }

        /* Desktop (≥1024px) */
        @media (min-width: 1024px) {
          h1 { font-size: 3rem !important; margin-top: 8rem !important;; }
          h2 { font-size: 1.5rem !important;; }
          h3 { font-size: 0.75rem !important;; }
          p { font-size: 0.7rem !important;; }
          img { width: 300px !important; height: 400px !important; }
          .card { width: 50%; max-width: 350px; }
        }
      `}</style>
    </div>
  );
}
