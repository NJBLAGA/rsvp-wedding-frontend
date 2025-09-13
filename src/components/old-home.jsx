import { useState, useEffect } from "react";
import WeddingImage from "../assets/us.JPG";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const PETAL_COUNT = 25;
  const PINK_COLOR = "#eda5a5";
  const [petals, setPetals] = useState([]);

  // Generate petals once
  useEffect(() => {
    const generatedPetals = [...Array(PETAL_COUNT)].map((_, i) => {
      const randomLeft = Math.random() * 100;
      const randomDuration = 15 + Math.random() * 20;
      const randomDelay = Math.random() * 12;
      const randomSize = 16 + Math.random() * 14;
      const path = (i % 6) + 1;
      return { randomLeft, randomDuration, randomDelay, randomSize, path };
    });
    setPetals(generatedPetals);
  }, []);

  // Countdown logic
  useEffect(() => {
    const targetDate = new Date("2026-03-14T00:00:00+11:00");

    const updateCountdown = () => {
      const now = new Date();
      const sydneyNow = new Date(
        now.toLocaleString("en-US", { timeZone: "Australia/Sydney" }),
      );
      const diff = targetDate - sydneyNow;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-2 sm:px-3"
      style={{ fontFamily: "'Poppins', sans-serif'" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        /* Petals */
        .petal {
          position: absolute;
          background: radial-gradient(circle at 50% 50%, #ffe4e1 0%, ${PINK_COLOR} 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          opacity: 0.4;
          transform: rotate(0deg);
          animation: sparkle 3s infinite alternate;
        }

        @keyframes sparkle { 0% { opacity:0.2 } 50% { opacity:0.35 } 100% { opacity:0.8 } }

        /* Float paths */
        @keyframes floatPetal-1 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 50%{transform:translateY(50vh) translateX(20px) rotate(160deg);} 100%{transform:translateY(100vh) translateX(-20px) rotate(320deg);} }
        @keyframes floatPetal-2 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 50%{transform:translateY(60vh) translateX(-40px) rotate(-200deg);} 100%{transform:translateY(100vh) translateX(40px) rotate(-360deg);} }
        @keyframes floatPetal-3 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 33%{transform:translateY(33vh) translateX(30px) rotate(120deg);} 66%{transform:translateY(66vh) translateX(-30px) rotate(240deg);} 100%{transform:translateY(100vh) translateX(30px) rotate(360deg);} }
        @keyframes floatPetal-4 { 0%{transform:translateY(0) translateX(0) rotate(0deg) scale(1);} 50%{transform:translateY(70vh) translateX(50px) rotate(180deg) scale(1.2);} 100%{transform:translateY(100vh) translateX(-50px) rotate(360deg) scale(1);} }
        @keyframes floatPetal-5 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 25%{transform:translateY(25vh) translateX(-25px) rotate(-90deg);} 50%{transform:translateY(50vh) translateX(25px) rotate(90deg);} 75%{transform:translateY(75vh) translateX(-25px) rotate(-270deg);} 100%{transform:translateY(100vh) translateX(25px) rotate(360deg);} }
        @keyframes floatPetal-6 { 0%{transform:translateY(0) translateX(0) rotate(0deg) scale(1);} 50%{transform:translateY(55vh) translateX(60px) rotate(200deg) scale(0.9);} 100%{transform:translateY(100vh) translateX(-60px) rotate(400deg) scale(1.1);} }

        /* Petal positions */
        ${petals
          .map(
            (p, i) => `
          .petal-${i} {
            left: ${p.randomLeft}%;
            width: ${p.randomSize}px;
            height: ${p.randomSize * 1.4}px;
            animation:
              floatPetal-${p.path} ${p.randomDuration}s linear infinite,
              sparkle 3s infinite alternate;
            animation-delay: ${p.randomDelay}s;
          }
        `,
          )
          .join("\n")}

        /* Background */
        .bg-center { background-size: cover; background-position: center; }
        @media (min-width: 1024px) {
          .bg-center { background-size: contain !important; background-repeat: no-repeat; background-position: top center; }
        }

        /* Countdown styling */
        .countdown-number {
          font-family: 'Poppins', sans-serif;
          font-weight: 400;
          color: #000;
          display: flex;
          align-items: baseline;
          justify-content: center;
        }
        .countdown-number span.number {
          font-size: clamp(1rem, 2.5vw, 2.5rem);
          font-weight: 400;
        }
        .countdown-number span.unit {
          font-family: 'Dancing Script', cursive;
          font-weight: 700;
          font-size: clamp(1rem, 1.5vw, 2rem);
          margin-left: 4px;
        }
        h3.countdown-heading {
          font-family: 'Dancing Script', cursive;
          font-weight: 400;
          font-size: 1.25rem;
        }
        @media (min-width: 640px) { h3.countdown-heading { font-size: 1.75rem; } }
        @media (min-width: 1024px) { h3.countdown-heading { font-size: 1.5rem; } }

        /* Wedding image */
        .wedding-image {
          border-radius: 0px;
          max-height: 30vh;
        }
        @media (min-width: 1024px) { .wedding-image { max-height: 38vh; } }

        /* H1 font sizes */
        h1 {
          font-family: 'Dancing Script', cursive;
          text-align: center;
          font-size: 3rem; /* Desktop */
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          h1 { font-size: 2.5rem; } /* Tablet */
        }
        @media (min-width: 401px) and (max-width: 639px) {
          h1 { font-size: 2rem; } /* Mobile */
        }

        /* iPhone SE 2 / small mobiles */
        @media (max-width: 400px) {
          h1 { font-size: 1.5rem !important; }
          .wedding-image { max-height: 20vh !important; }
          h3.countdown-heading { font-size: 1rem !important; }
        }
      `}</style>

      {/* Background */}
      <div
        className="absolute inset-0 bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      ></div>

      {/* Petals */}
      <div className="absolute inset-0 pointer-events-none">
        {petals.map((_, i) => (
          <div key={i} className={`petal petal-${i}`} />
        ))}
      </div>

      {/* Content */}
      <div className="relative w-full max-w-[300px] sm:max-w-md p-3 sm:p-5 flex flex-col items-center space-y-3 sm:space-y-4">
        <h1 className="text-lg sm:text-3xl md:text-4xl drop-shadow-lg mt-[2%]">
          Join Us for Our Wedding
        </h1>

        <img
          src={WeddingImage}
          alt="Wedding"
          className="w-2/3 sm:w-1/3 md:w-2/4 object-contain mx-auto wedding-image"
        />

        <div className="text-center drop-shadow-md">
          <h2
            className="text-xs sm:text-lg md:text-xl font-bold break-words"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Saturday 14th March 2026
          </h2>
          <p className="text-[10px] sm:text-sm md:text-base mt-1">
            Camden Valley Inn, Remembrance Dr, Cawdor NSW, Australia
          </p>
        </div>

        <div
          className="w-full max-w-[150px] h-1 rounded-full mt-1 sm:mt-2 mb-2 sm:mb-3"
          style={{ backgroundColor: "#e5a5a5" }}
        ></div>

        <h3 className="countdown-heading text-center drop-shadow-md font-normal">
          Countdown to our Wedding
        </h3>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div key={unit} className="countdown-number">
              <span className="number">{timeLeft[unit]}</span>
              <span className="unit">{unit[0]}</span>
            </div>
          ))}
        </div>

        <p className="text-center drop-shadow-md text-[9px] sm:text-sm md:text-base mt-2 sm:mt-3">
          Your presence will make our wedding day truly magical! We can’t wait
          to celebrate this special day with you.
        </p>

        <div className="text-xl sm:text-2xl md:text-3xl text-[#e5a5a5] mt-2 animate-bounce">
          🥂
        </div>
      </div>
    </div>
  );
}
