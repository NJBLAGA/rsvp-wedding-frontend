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
      const TOTAL = 100;
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
          this.xSpeed = 0.1 + Math.random() * 0.15;
          this.ySpeed = 0.05 + Math.random() * 0.15;
          this.flipSpeed = Math.random() * 0.01;
        }
        draw() {
          if (this.y > canvas.height || this.x > canvas.width) {
            this.x = -25;
            this.y = Math.random() * canvas.height * 2 - canvas.height;
            this.xSpeed = 0.1 + Math.random() * 0.15;
            this.ySpeed = 0.05 + Math.random() * 0.15;
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
    <div className="relative w-full h-screen">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />

      {/* Petals Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Page content */}
      <div className="relative z-20 flex flex-col items-center justify-start h-full px-4">
        <h1
          className="text-black font-bold mb-4"
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "2.5rem",
          }}
        >
          Our Special Day
        </h1>

        {/* DaisyUI Card */}
        <div className="card bg-white shadow-lg mt-0 w-full max-w-sm">
          <figure>
            <img
              src={WeddingImage}
              alt="Wedding couple"
              className="rounded-t-lg w-full"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-center" style={{ color: "#eda5a5" }}>
              Countdown
            </h2>
            <p className="text-center">
              Join us in celebrating our love! Explore the details, RSVP, and
              enjoy the journey with us.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .bg-cover {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* Mobile-specific styles */
        @media (max-width: 639px) {
          .card {
            transform: scale(0.5);
            margin-top: 0;
          }
          .bg-cover {
            background-size: cover;
            background-position: center;
          }
          h1 {
            font-size: 2rem;
            margin-bottom: 0;
          }
        }

        /* Tablet */
        @media (min-width: 640px) and (max-width: 1023px) {
          h1 {
            font-size: 2.2rem;
          }
          .bg-cover {
            background-size: contain;
            background-position: center;
          }
          .card {
            transform: scale(1);
            margin-top: 0;
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          h1 {
            font-size: 2.5rem;
            margin-top: 2rem;
            margin-bottom: 1.5rem;
          }
          .bg-cover {
            background-size: contain;
            background-position: top center;
          }
          .card {
            transform: scale(1);
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
}
