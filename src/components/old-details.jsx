import { useState, useEffect, useRef } from "react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";

const faqData = [
  {
    question: "How do we contact you?",
    answer: [
      {
        name: "Nicole",
        email: "nicole.camilleri44@gmail.com",
        mobile: "+61 428 229 283",
      },
      {
        name: "Nathan",
        email: "nathanblaga90@gmail.com",
        mobile: "+61 436 190 824",
      },
    ],
  },
  {
    question: "Directions to Venue",
    answer: [{ name: "Camden Valley Inn", address: "Remembrance Dr, Cawdor" }],
  },
  {
    question: "What should I wear to the wedding?",
    answer:
      "Dress code is semi-formal. Think cocktail dresses or suit without a tie.",
  },
  {
    question: "Can I bring a guest?",
    answer:
      "Please refer to your invitation. If a guest is listed, they are welcome!",
  },
  {
    question: "Will there be parking available?",
    answer: "Yes, free parking will be available at the venue.",
  },
  { question: "Do you love the puppies?", answer: "They are cute" },
];

export default function FAQ() {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const petalArrayRef = useRef([]);
  const PINK_COLOR = "#d38c8c";

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

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-contain"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />

      {/* Petals */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />

      {/* Heading */}
      <h1
        className="relative z-20 text-center font-bold mb-8"
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: "2rem",
          marginTop: "3rem",
        }}
      >
        FAQs
      </h1>

      {/* FAQ Accordion */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-md px-4 space-y-2">
        {faqData.map((item, idx) => (
          <div
            key={idx}
            className="collapse collapse-arrow bg-white border border-base-300 w-full"
          >
            <input
              type="radio"
              name="my-accordion-2"
              defaultChecked={idx === 0}
            />
            <div className="collapse-title font-semibold text-sm sm:text-base">
              {item.question}
            </div>
            <div className="collapse-content text-xs sm:text-sm space-y-1">
              {Array.isArray(item.answer) ? (
                item.answer.map((ans, idy) => (
                  <div key={idy} className="flex flex-col space-y-1">
                    {ans.name && (
                      <span className="font-medium text-sm sm:text-base">
                        {ans.name}
                      </span>
                    )}
                    {ans.email && (
                      <a
                        href={`mailto:${ans.email}`}
                        className="flex items-center space-x-1 text-[#d38c8c] hover:underline text-xs sm:text-sm"
                      >
                        <EnvelopeIcon className="w-4 h-4 text-[#d38c8c]" />
                        <span>{ans.email}</span>
                      </a>
                    )}
                    {ans.mobile && (
                      <a
                        href={`tel:${ans.mobile}`}
                        className="flex items-center space-x-1 text-[#d38c8c] hover:underline text-xs sm:text-sm"
                      >
                        <PhoneIcon className="w-4 h-4 text-[#d38c8c]" />
                        <span>{ans.mobile}</span>
                      </a>
                    )}
                    {ans.address && (
                      <a
                        href="https://maps.app.goo.gl/6NaC3CQ7zaXYqhBQ7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-[#d38c8c] hover:underline text-xs sm:text-sm"
                      >
                        <MapPinIcon className="w-4 h-4 text-[#d38c8c]" />
                        <span>{ans.address}</span>
                      </a>
                    )}
                    {typeof ans === "string" && (
                      <p className="text-xs sm:text-sm">{ans}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm">{item.answer}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        html, body { margin: 0; padding: 0; }

        /* Background behavior like original code */
        .bg-center { background-size: cover; background-position: center; }
        @media (min-width: 1024px) {
          .bg-center { background-size: contain !important; background-repeat: no-repeat; background-position: top center; }
        }

        /* Heading adjustments for mobile */
        @media (max-width: 1023px) {
          h1 { font-size: 1.8rem !important; margin-top: 2.5rem !important; }
        }
        @media (max-width: 639px) {
          h1 { font-size: 1.6rem !important; margin-top: 2rem !important; }
        }
      `}</style>
    </div>
  );
}
