import { useEffect, useRef } from "react";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";
import {
  Person,
  Favorite,
  LocalBar,
  Restaurant,
  Celebration,
  EmojiEvents,
} from "@mui/icons-material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";

export default function Schedule() {
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

  const schedule = [
    {
      time: "3:00 PM",
      label: "Arrival",
      description: "Please make your way to your seats.",
      icon: <Person />,
    },
    {
      time: "3:30 PM",
      label: "Ceremony",
      description: "The wedding ceremony begins.",
      icon: <Favorite />,
    },
    {
      time: "4:30 PM",
      label: "Canapes",
      description: "Refreshments are served.",
      icon: <LocalBar />,
    },
    {
      time: "5:30 PM",
      label: "Reception",
      description: "Dinner is served.",
      icon: <Restaurant />,
    },
    {
      time: "10:30 PM",
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
        className="absolute inset-0 z-0 bg-wedding"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />

      {/* Petals */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Heading */}
      <h1
        className="relative z-20 text-center font-bold text-black schedule-heading"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Wedding Day Schedule
      </h1>

      {/* Timeline */}
      <div className="relative z-20 w-full max-w-md px-2 sm:px-4">
        <Timeline position="right" className="w-full">
          {schedule.map((item, idx) => (
            <TimelineItem key={idx} sx={{ mb: 1.5 }}>
              <TimelineOppositeContent sx={{ width: "60%" }}>
                <Typography className="timeline-label">{item.label}</Typography>
                <Typography className="timeline-time">{item.time}</Typography>
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: "#d38c8c",
                    width: { xs: 30, sm: 35, md: 40, lg: 45, xl: 50 },
                    height: { xs: 30, sm: 35, md: 40, lg: 45, xl: 50 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& svg": {
                      fontSize: { xs: 20, sm: 24, md: 28, lg: 32, xl: 36 },
                      color: "white",
                    },
                  }}
                >
                  {item.icon}
                </TimelineDot>

                {idx !== schedule.length - 1 && (
                  <TimelineConnector
                    sx={{
                      height: { xs: 10, sm: 28, md: 32, lg: 36, xl: 40 },
                      width: 4,
                      bgcolor: "#d38c8c",
                      mx: 1,
                    }}
                  />
                )}
              </TimelineSeparator>

              <TimelineContent sx={{ mt: 0.5 }}>
                <Typography className="timeline-content">
                  {item.description}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>

      <style>{`
        html, body { margin:0; padding:0; }

        .bg-wedding {
          background-position: center;
          background-repeat: no-repeat;
        }
        @media (min-width: 1024px) {
          .bg-wedding {
            background-size: contain; /* Desktop: no stretching */
            background-position: top center;
          }
        }
        @media (max-width: 1023px) {
          .bg-wedding {
            background-size: cover;
          }
        }

        .schedule-heading {
          font-size: 2.5rem;
          margin-top: 7rem;
          margin-bottom: 2.5rem;
          line-height: 1.2;
        }
        @media (max-width: 1024px) { .schedule-heading { font-size: 2.2rem; margin-top: 6.5rem; } }
        @media (max-width: 640px) { .schedule-heading { font-size: 1.8rem; margin-top: 5.5rem; } }
        @media (max-width: 375px) { .schedule-heading { font-size: 1.3rem; margin-top: 4.5rem; margin-bottom: 1rem; } }
        @media (max-width: 360px) { .schedule-heading { font-size: 1.5rem; margin-top: 5.5rem; } }
        @media (min-width: 1025px) { .schedule-heading { font-size: 3rem; margin-top: 8rem; } }

        .timeline-label { font-family: 'Dancing Script', cursive; font-size: 1rem; color: black; }
        .timeline-time { font-family: 'Poppins', sans-serif; font-size: 0.7rem; color: black; }
        .timeline-content { font-family: 'Poppins', sans-serif; font-size: 0.6rem; color: black; }

        @media (max-width: 375px) {
          .timeline-label { font-size: 0.8rem; }
          .timeline-time { font-size: 0.6rem; }
          .timeline-content { font-size: 0.5rem; }
        }
        @media (max-width: 360px) {
          .timeline-label { font-size: 0.75rem; }
          .timeline-time { font-size: 0.6rem; }
          .timeline-content { font-size: 0.5rem; }
        }

        @media (min-width: 1025px) {
          .MuiTimelineDot-root {
            width: 50px;
            height: 50px;
          }
          .MuiTimelineDot-root svg { font-size: 36px; }
          .MuiTimelineConnector-root { height: 40px; }
          .timeline-label { font-size: 1.5rem; }
          .timeline-time { font-size: 1rem; }
          .timeline-content { font-size: 0.9rem; }
        }

      /* Desktop (≥1024px) */
      @media (min-width: 1024px) and (max-height: 820px) {
       h1 { font-size: 1.8rem !important; margin-top: 4rem !important; margin-bottom: 0.1rem !important;}

 * Reduce item height */
  .MuiTimelineItem-root {
    min-height: 48px !important;
  }

  /* Remove extra vertical padding */
  .MuiTimelineContent-root,
  .MuiTimelineOppositeContent-root {
    padding-top: 2px !important;
    padding-bottom: 2px !important;
  }

  /* Slightly shorten connector */
  .MuiTimelineConnector-root {
    height: 14px !important;
  }
  /* Circles */
  .MuiTimelineDot-root {
    width: 34px !important;
    height: 34px !important;
  }

  .MuiTimelineDot-root svg {
    font-size: 22px !important;
  }

  /* Connector */
  .MuiTimelineConnector-root {
    height: 16px !important;
  }

  /* Text */
  .timeline-label {
    font-size: 1.1rem !important;
  }

  .timeline-time {
    font-size: 0.8rem !important;
  }

  .timeline-content {
    font-size: 0.7rem !important;
  }
      }
      `}</style>
    </div>
  );
}
