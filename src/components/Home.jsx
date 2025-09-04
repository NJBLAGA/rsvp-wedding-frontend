import { useState, useEffect } from "react";
import WeddingImage from "../assets/87qyuoagdwce1.png";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-03-14T00:00:00+11:00"); // Sydney time, DST aware

    const updateCountdown = () => {
      const now = new Date();

      // Get the offset between UTC and Sydney for current date
      const sydneyOffset = now.toLocaleString("en-US", {
        timeZone: "Australia/Sydney",
      });
      const sydneyNow = new Date(sydneyOffset);

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

    updateCountdown(); // initialize
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-6">
      <h1 className="text-3xl md:text-5xl font-bold text-center">
        Join Us For Our Special Day
      </h1>

      <p className="text-center text-gray-600 text-base md:text-lg mx-6 md:mx-32">
        Our love story continues… and we’d love for you to be part of the next
        chapter.
      </p>

      <img
        src={WeddingImage}
        alt="Wedding"
        className="w-4/5 md:w-full max-w-xl rounded-lg shadow-lg object-cover mx-auto"
      />

      <h2 className="text-2xl md:text-3xl font-semibold text-center mx-6 md:mx-32">
        Saturday 14 March 2026
      </h2>
      <p className="text-xl md:text-2xl text-center mx-6 md:mx-32">
        Camden Valley Inn, Remembrance Dr, Cawdor NSW, Australia
      </p>

      <div className="mt-2 text-5xl md:text-6xl flex justify-center items-center space-x-2">
        <span>⛪</span>
      </div>

      {/* Countdown Timer */}
      <div className="mt-4 p-4 rounded-lg bg-pink-50 shadow-md flex flex-col items-center w-full max-w-lg">
        <div className="text-2xl md:text-3xl font-semibold text-center">
          Countdown to Our Wedding
        </div>
        <div className="mt-2 text-xl md:text-2xl font-mono space-x-4 text-center">
          <span>{timeLeft.days}d</span>
          <span>{timeLeft.hours}h</span>
          <span>{timeLeft.minutes}m</span>
          <span>{timeLeft.seconds}s</span>
        </div>
      </div>

      <p className="text-center text-gray-600 text-base md:text-lg mt-4 mx-6 md:mx-32">
        Your presence will make our wedding day truly magical! We can’t wait to
        celebrate this special day with you.
      </p>
      <div className="mt-2 text-4xl md:text-5xl">🥂</div>
    </div>
  );
}
