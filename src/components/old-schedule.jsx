import { useEffect, useRef, useState } from "react";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";
import WeddingImage from "../assets/back.png";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import {
  Person,
  Favorite,
  LocalBar,
  Restaurant,
  Celebration,
  EmojiEvents,
} from "@mui/icons-material";

export default function Schedule() {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const petalArrayRef = useRef([]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-03-14T00:00:00+11:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!petalArrayRef.current.length) {
      const TOTAL = 20;
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
        for (let i = 0; i < TOTAL; i++) petalArrayRef.current.push(new Petal());
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

  const schedule = [
    {
      time: "2:00 PM",
      label: "Arrival",
      description: "Please make your way to your seats.",
      icon: <Person />,
    },
    {
      time: "2:30 PM",
      label: "Ceremony",
      description: "The wedding ceremony begins.",
      icon: <Favorite />,
    },
    {
      time: "3:30 PM",
      label: "Canapes & Reception",
      description: "Refreshments are served.",
      icon: <LocalBar />,
    },
    {
      time: "5:00 PM",
      label: "Dinner",
      description: "Dinner is served.",
      icon: <Restaurant />,
    },
    {
      time: "7:00 PM",
      label: "Dancing & Toasts",
      description: "The celebrations continue.",
      icon: <Celebration />,
    },
    {
      time: "11:00 PM",
      label: "Evening's End",
      description: "Event concludes.",
      icon: <EmojiEvents />,
    },
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden px-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-desktop"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />

      {/* Petals */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Cards */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-md px-2 sm:px-4 space-y-3 sm:space-y-4">
        {/* Countdown Card with top margin */}
        <div className="collapse collapse-arrow w-full bg-transparent shadow-none rounded-3xl overflow-hidden mt-16 sm:mt-25 md:mt-30">
          <input type="radio" name="accordion" defaultChecked />
          <div
            className="collapse-title text-base sm:text-lg lg:text-xl font-semibold text-black"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Countdown To The Big Day
          </div>
          <div className="collapse-content p-1 sm:p-4">
            <img
              src={WeddingImage}
              alt="Wedding"
              className="w-full object-cover rounded-b-3xl max-h-36 sm:max-h-80 lg:max-h-96"
            />
            {/* Countdown */}
            <div className="flex justify-center mt-2 sm:mt-6">
              <div className="grid grid-flow-col text-center auto-cols-max gap-1 sm:gap-4">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="countdown font-mono text-xl sm:text-4xl lg:text-5xl">
                      {item.value}
                    </span>
                    <span
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                      className="text-xs sm:text-xl lg:text-2xl"
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="collapse collapse-arrow w-full bg-transparent shadow-none rounded-3xl overflow-hidden">
          <input type="radio" name="accordion" />
          <div
            className="collapse-title text-base sm:text-lg lg:text-xl font-semibold text-black"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Wedding Day Schedule
          </div>
          <div className="collapse-content p-1 sm:p-4">
            <Timeline position="right" className="w-full">
              {schedule.map((item, idx) => (
                <TimelineItem
                  key={idx}
                  sx={{
                    mb: { xs: 0.25, sm: 0.35, md: 0.5, lg: 1.5 },
                  }}
                >
                  <TimelineOppositeContent
                    sx={{
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: {
                        xs: "0.55rem",
                        sm: "0.6rem",
                        md: "1.1rem",
                        lg: "1.2rem",
                      },
                      color: "black",
                      width: { xs: "55%", sm: "57%", md: "60%", lg: "60%" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: {
                          xs: "0.6rem",
                          sm: "0.65rem",
                          md: "1.05rem",
                          lg: "1.4rem",
                        },
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: {
                          xs: "0.4rem",
                          sm: "0.45rem",
                          md: "0.9rem",
                          lg: "0.85rem",
                        },
                        color: "black",
                      }}
                    >
                      {item.time}
                    </Typography>
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        bgcolor: "#d38c8c",
                        width: { xs: 18, sm: 20, md: 30, lg: 45 },
                        height: { xs: 18, sm: 20, md: 30, lg: 45 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "& svg": {
                          fontSize: { xs: 10, sm: 12, md: 20, lg: 24 },
                          color: "white",
                        },
                      }}
                    >
                      {item.icon}
                    </TimelineDot>
                    {idx !== schedule.length - 1 && (
                      <TimelineConnector
                        sx={{
                          height: { xs: 6, sm: 8, md: 16, lg: 30 },
                          width: 3,
                          bgcolor: "#d38c8c",
                          mx: { xs: 0.5, sm: 0.5, md: 1, lg: 0 },
                        }}
                      />
                    )}
                  </TimelineSeparator>

                  <TimelineContent
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: {
                        xs: "0.38rem",
                        sm: "0.4rem",
                        md: "0.8rem",
                        lg: "0.8rem",
                      },
                      mt: { xs: 0.05, sm: 0.1, md: 0.2, lg: 0.3 },
                      color: "black",
                    }}
                  >
                    {item.description}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </div>
      </div>

      <style>{`
        html, body { margin:0; padding:0; }
        .bg-desktop { background-size: contain; background-repeat: no-repeat; background-position: top center; }
        @media (max-width:639px) { 
          .bg-desktop { background-size: cover; background-position: center; } 
        }
      `}</style>
    </div>
  );
}
