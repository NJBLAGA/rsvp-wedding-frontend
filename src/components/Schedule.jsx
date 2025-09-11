import { useState, useEffect } from "react";
import WeddingImage from "../assets/back.png";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";
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
  const PETAL_COUNT = 25;
  const PINK_COLOR = "#eda5a5";
  const [petals, setPetals] = useState([]);

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
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden px-2 sm:px-3"
      style={{ fontFamily: "'Poppins', sans-serif'" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .petal {
          position: absolute;
          background: radial-gradient(circle at 50% 50%, #ffe4e1 0%, ${PINK_COLOR} 100%);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          opacity: 0.4;
          transform: rotate(0deg);
          animation: sparkle 3s infinite alternate;
        }
        @keyframes sparkle { 0% { opacity:0.2 } 50% { opacity:0.35 } 100% { opacity:0.8 } }
        @keyframes floatPetal-1 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 50%{transform:translateY(50vh) translateX(20px) rotate(160deg);} 100%{transform:translateY(100vh) translateX(-20px) rotate(320deg);} }
        @keyframes floatPetal-2 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 50%{transform:translateY(60vh) translateX(-40px) rotate(-200deg);} 100%{transform:translateY(100vh) translateX(40px) rotate(-360deg);} }
        @keyframes floatPetal-3 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 33%{transform:translateY(33vh) translateX(30px) rotate(120deg);} 66%{transform:translateY(66vh) translateX(-30px) rotate(240deg);} 100%{transform:translateY(100vh) translateX(30px) rotate(360deg);} }
        @keyframes floatPetal-4 { 0%{transform:translateY(0) translateX(0) rotate(0deg) scale(1);} 50%{transform:translateY(70vh) translateX(50px) rotate(180deg) scale(1.2);} 100%{transform:translateY(100vh) translateX(-50px) rotate(360deg) scale(1);} }
        @keyframes floatPetal-5 { 0%{transform:translateY(0) translateX(0) rotate(0deg);} 25%{transform:translateY(25vh) translateX(-25px) rotate(-90deg);} 50%{transform:translateY(50vh) translateX(25px) rotate(90deg);} 75%{transform:translateY(75vh) translateX(-25px) rotate(-270deg);} 100%{transform:translateY(100vh) translateX(25px) rotate(360deg);} }
        @keyframes floatPetal-6 { 0%{transform:translateY(0) translateX(0) rotate(0deg) scale(1);} 50%{transform:translateY(55vh) translateX(60px) rotate(200deg) scale(0.9);} 100%{transform:translateY(100vh) translateX(-60px) rotate(400deg) scale(1.1);} }
        ${petals
          .map(
            (p, i) => `
          .petal-${i} {
            left: ${p.randomLeft}%;
            width: ${p.randomSize}px;
            height: ${p.randomSize * 1.4}px;
            animation: floatPetal-${p.path} ${p.randomDuration}s linear infinite, sparkle 3s infinite alternate;
            animation-delay: ${p.randomDelay}s;
          }
        `,
          )
          .join("\n")}

        .bg-center { background-size: cover; background-position: center; }
        @media (min-width: 1024px) { .bg-center { background-size: contain !important; background-repeat: no-repeat; background-position: top center; } }

        /* Wedding image responsive sizes */
        .wedding-image {
          border-radius: 0px;
          max-height: 40vh;
          margin-bottom: 1rem;
        }
        @media (max-width: 1023px) { 
          .wedding-image { max-height: 25vh !important; margin-bottom: 0 !important; } 
        }
        @media (max-width: 400px) { 
          .wedding-image { max-height: 12vh !important; margin-bottom: 0 !important; } 
        }
        @media (min-width: 1024px) { 
          .wedding-image { max-height: 50vh; } 
        }

        /* Timeline spacing */
        .timeline-container { margin-top: 1rem; }
        @media (max-width: 1023px) { .timeline-container { margin-top: 1rem !important; } }
        @media (max-width: 400px) { .timeline-container { margin-top: 0.3rem !important; } }

        /* Headings */
        h1 { font-family: 'Dancing Script', cursive; text-align: center; font-size: 3rem; margin-top: 0; }
        @media (max-width: 1023px) and (min-width: 401px) { h1 { font-size: 2.5rem; margin-top: 3.7rem; } }
        @media (max-width: 400px) { h1 { font-size: 1.7rem !important; margin-top: 3.5rem; } }
        @media (min-width: 1024px) { h1 { margin-top: 7rem; } }


/* iPhone SE 2nd Gen portrait */
@media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 375px) 
  and (min-device-height: 667px) 
  and (max-device-height: 667px) 
  and (-webkit-device-pixel-ratio: 2) {
  
  /* Your SE2-specific styles here */
  .wedding-image {
    max-height: 10.5vh !important;
    margin-bottom: 0rem !important;
  }
  
  h1 {
    margin-top: 2.5rem !important;
    font-size: 1.5rem !important;
  }
}
      `}</style>

      {/* Background & Petals */}
      <div
        className="absolute inset-0 bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />
      <div className="absolute inset-0 pointer-events-none">
        {petals.map((_, i) => (
          <div key={i} className={`petal petal-${i}`} />
        ))}
      </div>

      {/* Content */}
      <div className="relative w-full max-w-[900px] sm:max-w-[900px] p-3 sm:p-5 flex flex-col items-center space-y-3 sm:space-y-4">
        <h1 className="drop-shadow-lg"> Wedding Schedule</h1>
        <img
          src={WeddingImage}
          alt="Wedding"
          className="w-2/3 sm:w-1/2 md:w-2/3 object-contain mx-auto wedding-image"
        />

        <div className="timeline-container w-full">
          <Timeline
            position="right"
            className="w-full"
            sx={{
              maxWidth: { xs: "350px", sm: "700px", md: "900px" },
              "& .MuiTimelineDot-root": {
                bgcolor: "#e5a5a5",
                width: { xs: 28, sm: 32, md: 40 },
                height: { xs: 28, sm: 32, md: 40 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& svg": {
                  fontSize: { xs: 18, sm: 20, md: 28 },
                  color: "white",
                },
              },
              "& .MuiTimelineConnector-root": {
                height: { xs: 10, sm: 12, md: 20 },
                bgcolor: "#e5a5a5",
                width: { xs: 2, sm: 2, md: 3 },
              },
              "& .MuiTimelineOppositeContent-root": {
                width: { xs: "30%", sm: "30%", md: "25%" },
                textAlign: "right",
                pr: { xs: 1, sm: 1.5, md: 3 },
                fontFamily: "'Dancing Script', cursive",
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.2rem" },
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              },
              "& .MuiTimelineContent-root": {
                width: { xs: "70%", sm: "70%", md: "75%" },
                ml: { xs: 0.5, sm: 1, md: 2 },
                pr: { xs: 0.5, sm: 1, md: 2 },
                mt: { xs: 0.2, sm: 0.3, md: 1 },
                fontFamily: "'Poppins', sans-serif",
              },
            }}
          >
            {schedule.map((item, idx) => (
              <TimelineItem key={idx}>
                <TimelineOppositeContent>
                  <Typography
                    sx={{
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.2rem" },
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.9rem" },
                    }}
                  >
                    {item.time}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot>{item.icon}</TimelineDot>
                  {idx !== schedule.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.85rem" },
                      mt: 0.5,
                    }}
                  >
                    {item.description}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </div>
    </div>
  );
}
