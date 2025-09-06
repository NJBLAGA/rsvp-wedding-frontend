import WeddingImage from "../assets/87qyuoagdwce1.png";
import * as React from "react";
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
  PhotoCamera,
  Restaurant,
  Celebration,
  EmojiEvents,
} from "@mui/icons-material";

export default function Schedule() {
  const schedule = [
    {
      time: "2:00 PM",
      label: "Arrival",
      description: "Please make your way to your seats.",
      icon: <Person sx={{ fontSize: 30, color: "white" }} />,
    },
    {
      time: "2:30 PM",
      label: "Ceremony",
      description: "The wedding ceremony begins.",
      icon: <Favorite sx={{ fontSize: 30, color: "white" }} />, // Heart for Ceremony
    },
    {
      time: "3:30 PM",
      label: "Canapes and Reception",
      description: "Head over to the Loft for a drink and bite to eat!",
      icon: <LocalBar sx={{ fontSize: 30, color: "white" }} />,
    },
    {
      time: "5:00 PM",
      label: "Dinner",
      description: "Take your seats, dinner is served!",
      icon: <Restaurant sx={{ fontSize: 30, color: "white" }} />,
    },
    {
      time: "7:00 PM",
      label: "Dancing & Toasts",
      description: "The dance floor opens and celebrations continue.",
      icon: <Celebration sx={{ fontSize: 30, color: "white" }} />,
    },
    {
      time: "11:00 PM",
      label: "Evening's End",
      description: "Event concludes.",
      icon: <EmojiEvents sx={{ fontSize: 30, color: "white" }} />, // Celebration/party for end
    },
  ];

  return (
    <div className="flex flex-col items-center px-4 py-6 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold text-center">
        Wedding Schedule
      </h1>

      <p className="text-center text-gray-600 text-sm md:text-base mx-4 md:mx-16">
        Here’s what we have planned for our special day. Can’t wait to see you!
      </p>

      <img
        src={WeddingImage}
        alt="Wedding"
        className="w-full md:w-4/5 rounded-lg shadow-lg object-cover mx-auto"
      />

      <Timeline
        position="right"
        className="w-full mt-4 max-w-3xl mx-auto"
        sx={{
          "& .MuiTimelineItem-root": {
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            textAlign: { xs: "center", sm: "left" },
            marginBottom: 4,
          },
          "& .MuiTimelineOppositeContent-root": {
            width: { xs: "100%", sm: "35%" },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "flex-end" },
            textAlign: { xs: "center", sm: "right" },
            pr: { sm: 2 },
            mb: { xs: 1, sm: 0 },
          },
          "& .MuiTimelineContent-root": {
            width: { xs: "100%", sm: "35%" },
            display: { xs: "none", sm: "flex" },
            alignItems: "flex-start",
            textAlign: "left",
            ml: { sm: 2 },
            mt: { sm: 1 },
          },
          "& .MuiTimelineSeparator-root": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        {schedule.map((item, idx) => (
          <TimelineItem key={idx}>
            <TimelineOppositeContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {item.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.time}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: { xs: "block", sm: "none" }, mt: 0.5 }}
              >
                {item.description}
              </Typography>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot
                color="primary"
                sx={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  mt: { xs: 0.5, sm: 0 },
                }}
              >
                {item.icon}
              </TimelineDot>
              {idx !== schedule.length - 1 && (
                <TimelineConnector
                  sx={{
                    height: 25,
                    bgcolor: "primary.light",
                    mx: "auto",
                  }}
                />
              )}
            </TimelineSeparator>

            <TimelineContent>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ wordBreak: "break-word" }}
              >
                {item.description}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
