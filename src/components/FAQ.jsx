import { useState, useEffect, useRef } from "react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";

const faqData = [
  {
    question: "How to contact us?",
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
  { question: "Template 1", answer: "Answer 1" },
  { question: "Template 2", answer: "Answer 2" },
  { question: "Template 3", answer: "Answer 3" },
  { question: "Template 4", answer: "Answer 4" },
  { question: "Template 5", answer: "Answer 5" },
  { question: "Template 6", answer: "Answer 6" },
  { question: "Template 7", answer: "Answer 7" },
  { question: "Template 8", answer: "Answer 8" },
  { question: "Template 9", answer: "Answer 9" },
  { question: "Template 10", answer: "Answer 10" },
];

export default function FAQ() {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const petalArrayRef = useRef([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // default for desktop/tablet

  // ✅ Handle responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 639) {
        setItemsPerPage(4); // Mobile
      } else {
        setItemsPerPage(6); // Tablet & Desktop
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(faqData.length / itemsPerPage);

  // 🌸 Petal Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!petalArrayRef.current.length) {
      const TOTAL = 10;
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
          this.w = 25 + Math.random() * 10;
          this.h = 18 + Math.random() * 8;
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFaqs = faqData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
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
      <h1 className="relative z-20 text-center font-bold">FAQs</h1>

      {/* Pagination */}
      <div className="relative z-20 pagination-container">
        <div className="join">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`join-item btn btn-square btn-sm pagination-btn ${
                currentPage === i + 1 ? "active" : ""
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-md px-4 space-y-2">
        {currentFaqs.map((item, idx) => (
          <div
            key={idx}
            tabIndex={0}
            className="collapse collapse-plus bg-transparent w-full"
          >
            <input
              type="radio"
              name={`accordion-page-${currentPage}`}
              defaultChecked={idx === 0}
            />
            <div className="collapse-title font-semibold">{item.question}</div>
            <div className="collapse-content">
              {Array.isArray(item.answer) ? (
                item.answer.map((ans, idy) => (
                  <div
                    key={idy}
                    className={`flex flex-col space-y-1 contact-block ${
                      idy > 0 ? "mt-2" : ""
                    }`}
                  >
                    {ans.email && (
                      <a
                        href={`mailto:${ans.email}`}
                        className="flex items-center space-x-1 hover:underline text-black answer-text"
                      >
                        <EnvelopeIcon className="w-4 h-4 text-[#eda5a5]" />
                        <span>{ans.email}</span>
                      </a>
                    )}
                    {ans.mobile && (
                      <a
                        href={`tel:${ans.mobile}`}
                        className="flex items-center space-x-1 hover:underline text-black answer-text"
                      >
                        <PhoneIcon className="w-4 h-4 text-[#eda5a5]" />
                        <span>{ans.mobile}</span>
                      </a>
                    )}
                    {ans.address && (
                      <a
                        href="https://maps.app.goo.gl/6NaC3CQ7zaXYqhBQ7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 mt-0 hover:underline text-black answer-text"
                      >
                        <MapPinIcon className="w-4 h-4 text-[#eda5a5]" />
                        <span>{ans.address}</span>
                      </a>
                    )}
                    {typeof ans === "string" && (
                      <p className="answer-text">{ans}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="answer-text">{item.answer}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .bg-wedding {
          background-position: center;
          background-repeat: no-repeat;
        }

        @media (min-width: 1024px) {
          .bg-wedding {
            background-size: contain;
            background-position: top center;
          }
          h1 {
            font-size: 3rem;
            margin-top: 8rem;
          }
        }

        /* Tablet adjustments */
        @media (min-width: 640px) and (max-width: 1023px) {
          h1 {
            font-size: 2.2rem !important;
            margin-top: 6.5rem !important;
          }
          .collapse-title {
            font-size: 0.85rem !important;
          }
          .answer-text {
            font-size: 0.7rem !important;
            line-height: 1.1rem !important;
          }
        }

        /* Mobile adjustments (≤639px) */
        @media (max-width: 639px) {
          .bg-wedding {
            background-size: cover;
          }
          h1 {
            font-size: 2rem;
            margin-top: 6rem;
          }
          .collapse-title {
            font-size: 0.7rem !important;
            padding-right: 1.5rem !important;
          }
          .answer-text {
            font-size: 0.6rem !important;
            line-height: 1rem;
          }

          /* tighter space between pagination and first card */
          .pagination-container {
            margin-bottom: 0.4rem !important;
          }

          /* tighter space between cards */
          .space-y-2 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0.3rem !important;
          }
        }

        h1 {
          font-family: 'Dancing Script', cursive;
          font-weight: bold;
          text-align: center;
          margin-bottom: 0.5rem !important;
        }

        .pagination-container {
          margin-bottom: 0.75rem !important;
        }

        .pagination-btn {
          background-color: #eda5a5 !important;
          border: 1px solid #eda5a5 !important;
          color: white !important;
        }
        .pagination-btn:hover {
          background-color: #d38c8c !important;
          color: white !important;
        }
        .pagination-btn.active {
          background-color: #c96b6b !important;
          color: white !important;
        }
        .pagination-btn:focus {
          outline: none !important;
          background-color: #f2bcbc !important;
          color: white !important;
          box-shadow: 0 0 6px rgba(237, 165, 165, 0.8);
        }

        .collapse-title {
          font-size: 0.9rem;
          position: relative;
          padding-right: 2rem !important;
        }
        .answer-text {
          font-size: 0.8rem;
        }

        .collapse-plus .collapse-title::after {
          position: absolute !important;
          right: 0.75rem !important;
          top: 1.1rem !important;
          margin: 0 !important;
          font-size: 0.9rem !important;
          line-height: 1 !important;
        }

        .contact-block + .contact-block {
          margin-top: 0.4rem;
        }

        @media (min-width: 640px) and (max-width: 1023px) {
         .collapse-plus .collapse-title::after {
           font-size: 0.8rem !important;
           top: 1.3rem !important;
           right: 0.6rem !important;
          }
        }

        /* Extra compact for ≤375px */
        @media (max-width: 375px) {
          h1 {
            margin-top: 4.2rem !important;
            margin-bottom: 0.4rem !important;
          }
          .collapse-title {
            font-size: 0.6rem !important;
          }
          .answer-text {
            font-size: 0.5rem !important;
            line-height: 0.9rem;
          }
          .collapse-plus .collapse-title::after {
            font-size: 0.7rem !important;
            top: 1.1rem !important;
            right: 0.5rem !important;
          }
          .pagination-btn {
            width: 1.5rem !important;
            height: 1.5rem !important;
            min-height: 1.5rem !important;
            font-size: 0.6rem !important;
            padding: 0 !important;
          }
          .pagination-btn.active,
          .pagination-btn:focus {
            background-color: #f2bcbc !important;
            color: white !important;
            box-shadow: 0 0 6px rgba(237, 165, 165, 0.8);
          }
        }
      `}</style>
    </div>
  );
}
