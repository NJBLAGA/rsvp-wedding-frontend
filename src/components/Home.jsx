import { useState, useEffect } from "react";
import WeddingImage from "../assets/87qyuoagdwce1.png";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const PETAL_COUNT = 25;

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
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-2 sm:px-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Embedded CSS */}
      <style>{`
        /* Floating petals */
        .petal {
          position: absolute;
          width: 20px;
          height: 28px;
          background: radial-gradient(circle at 50% 50%, #ffe4e1 0%, #e5a5a5 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          opacity: 0.8;
          transform: rotate(0deg);
          animation: floatPetal linear infinite, sparkle 3s infinite alternate;
        }

        @keyframes floatPetal {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(50vh) translateX(15px) rotate(180deg); }
          100% { transform: translateY(100vh) translateX(-15px) rotate(360deg); }
        }

        @keyframes sparkle {
          0% { opacity: 0.6; }
          50% { opacity: 0.9; }
          100% { opacity: 0.6; }
        }

        /* Petal positions */
${[...Array(PETAL_COUNT)]
  .map((_, i) => {
    const baseDelay = i % 5; // keeps your original pattern
    const extraDelay = i % 2 === 0 ? 0 : 0.5; // every second petal delayed by 0.5s
    return `.petal-${i} { left: ${10 + i * 4}%; animation-duration: ${
      20 + (i % 5) * 2
    }s; animation-delay: ${baseDelay + extraDelay}s; }`;
  })
  .join("\n")}


        /* Background */
        .bg-center { background-size: cover; background-position: center; }

        @media (min-width: 768px) and (max-width: 1023px) {
          .bg-center {
            background-size: cover !important;
            background-repeat: no-repeat;
            background-position: center center;
          }
        }

        @media (min-width: 1024px) {
          .bg-center {
            background-size: contain !important;
            background-repeat: no-repeat;
            background-position: top center;
          }
          .petal { max-height: 30vh; }
        }

        @media (max-width: 375px) {
          .card-content h1 { font-size: 1.2rem !important; margin-top: 2vh !important; }
          .card-content h2 { font-size: 0.8rem !important; }
          .card-content h3 { font-size: 0.9rem !important; }
          .card-content p { font-size: 0.65rem !important; }
          .card-content img { max-height: 16vh !important; width: 80%; }
          .countdown-block { font-size: 0.65rem !important; min-width: 36px !important; }
          .card-content .text-3xl { font-size: 1.6rem !important; }
        }
      `}</style>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      ></div>

      {/* Animated Petals */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(PETAL_COUNT)].map((_, i) => (
          <div key={i} className={`petal petal-${i}`} />
        ))}
      </div>

      {/* Card Content */}
      <div className="relative w-full max-w-[360px] sm:max-w-2xl p-5 sm:p-8 md:p-12 flex flex-col items-center space-y-5 sm:space-y-6 md:space-y-6 card-content text-poppins">
        {/* Main Heading */}
        <h1
          className="text-2xl sm:text-3xl md:text-5xl text-center tracking-wide drop-shadow-lg mt-[2%]"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Join Us for Our Wedding
        </h1>

        <img
          src={WeddingImage}
          alt="Wedding"
          className="w-4/5 sm:w-2/3 md:w-1/2 rounded-xl shadow-lg object-cover"
          style={{ maxHeight: "30vh", objectFit: "cover" }}
        />

        {/* Date Section */}
        <div className="text-center drop-shadow-md">
          <h2
            className="text-base sm:text-2xl md:text-3xl font-bold break-words"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Saturday 14th March 2026
          </h2>
          <p className="text-xs sm:text-base md:text-lg mt-1">
            Camden Valley Inn, Remembrance Dr, Cawdor NSW, Australia
          </p>
        </div>

        <div
          className="w-full max-w-[200px] h-1 rounded-full mt-1 sm:mt-2 mb-3 sm:mb-4"
          style={{ backgroundColor: "#e5a5a5" }}
        ></div>

        {/* Countdown Heading */}
        <h3
          className="text-lg sm:text-xl md:text-4xl text-center drop-shadow-md font-normal"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Countdown to our Wedding
        </h3>

        {/* Countdown Bubbles */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 font-mono">
          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div
              key={unit}
              className="flex items-center justify-center rounded-xl shadow-md px-3 sm:px-4 py-2 sm:py-3 min-w-[50px] sm:min-w-[65px] transition-all duration-300 countdown-block"
              style={{
                fontSize: "clamp(0.9rem, 2.5vw, 1.8rem)",
                fontFamily: "'Poppins', cursive",
                background: "linear-gradient(135deg, #fff0f0, #e5a5a5)",
                color: "#3b0a45",
              }}
            >
              <span>{timeLeft[unit]}</span>
              <span className="ml-1 lowercase" style={{ fontSize: "0.75em" }}>
                {unit[0]}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center drop-shadow-md text-xs sm:text-base md:text-lg mt-3 sm:mt-4">
          Your presence will make our wedding day truly magical! We can’t wait
          to celebrate this special day with you.
        </p>

        <div className="text-3xl sm:text-5xl md:text-6xl text-[#e5a5a5] mt-2 mb-[2%] sm:mb-0 animate-bounce">
          🥂
        </div>
      </div>
    </div>
  );
}
