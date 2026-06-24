import {
  Person,
  Favorite,
  LocalBar,
  Restaurant,
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
import PageBackground from "./PageBackground";

const schedule = [
  { time: "3:00 PM", label: "Arrival", description: "Please make your way to your seats.", icon: <Person /> },
  { time: "3:30 PM", label: "Ceremony", description: "The wedding ceremony begins.", icon: <Favorite /> },
  { time: "4:30 PM", label: "Canapés", description: "Refreshments are served.", icon: <LocalBar /> },
  { time: "5:30 PM", label: "Reception", description: "Dinner is served.", icon: <Restaurant /> },
  { time: "10:30 PM", label: "Evening's End", description: "Wedding concludes.", icon: <EmojiEvents /> },
];

export default function Schedule() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden px-4">
      <PageBackground />

      <h1 className="page-heading relative z-20 text-black">
        Wedding Day Schedule
      </h1>

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
                    bgcolor: "var(--color-pink)",
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
                      bgcolor: "var(--color-pink)",
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
    </div>
  );
}
