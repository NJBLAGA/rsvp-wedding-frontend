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
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 639) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(6);
      }
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(faqData.length / itemsPerPage);

  // Petal Animation
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

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage > 2) pages.push(1);
      if (currentPage > 3) pages.push("…");
      if (currentPage > 1) pages.push(currentPage - 1);
      pages.push(currentPage);
      if (currentPage < totalPages) pages.push(currentPage + 1);
      if (currentPage < totalPages - 2) pages.push("…");
      if (currentPage < totalPages - 1) pages.push(totalPages);
    }
    return pages;
  };

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

      {/* Pagination under heading */}
      <div className="relative z-20 flex flex-col items-center pagination-static">
        <div className="flex space-x-2 items-center">
          {/* Prev arrow */}
          <button
            className={`circle-btn-sm ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-[#eda5a5] border border-[#eda5a5] hover:bg-[#fce8e8]"
            }`}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((num, idx) =>
            num === "…" ? (
              <span key={idx} className="px-1 text-gray-500">
                …
              </span>
            ) : (
              <button
                key={idx}
                className={`circle-btn ${
                  currentPage === num
                    ? "bg-[#eda5a5] text-white shadow-md scale-105"
                    : "bg-white text-[#eda5a5] border border-[#eda5a5] hover:bg-[#fce8e8]"
                }`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ),
          )}

          {/* Next arrow */}
          <button
            className={`circle-btn-sm ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-[#eda5a5] border border-[#eda5a5] hover:bg-[#fce8e8]"
            }`}
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          >
            ›
          </button>
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
                    className={`flex flex-col space-y-1 contact-block ${idy > 0 ? "mt-2" : ""}`}
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
    h1 { font-size: 3rem; margin-top: 8rem; }
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    .bg-wedding { background-size: contain; }
    h1 { font-size: 2.2rem !important; margin-top: 6.5rem !important; }
    .collapse-title { font-size: 0.85rem !important; }
    .answer-text { font-size: 0.7rem !important; line-height: 1.1rem !important; }
  }

  @media (max-width: 639px) {
    .bg-wedding { background-size: cover; } /* stretch on mobile */
    h1 { font-size: 2rem; margin-top: 6rem; }
    .collapse-title { font-size: 0.7rem !important; }
    .answer-text { font-size: 0.6rem !important; line-height: 1rem; }
  }

  h1 {
    font-family: 'Dancing Script', cursive;
    font-weight: bold;
    text-align: center;
    margin-bottom: 0.5rem !important;
  }

  /* Circle Buttons (default small) */
  .circle-btn {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    font-size: 0.65rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .circle-btn-sm {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    font-size: 0.55rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Tablet */
  @media (min-width: 640px) {
    .circle-btn {
      width: 1.9rem;
      height: 1.9rem;
      font-size: 0.75rem;
    }
    .circle-btn-sm {
      width: 1.5rem;
      height: 1.5rem;
      font-size: 0.65rem;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .circle-btn {
      width: 2rem;
      height: 2rem;
      font-size: 0.8rem;
    }
    .circle-btn-sm {
      width: 1.7rem;
      height: 1.7rem;
      font-size: 0.7rem;
    }
  }

  /* Extra Small devices (≤375px) */
  @media (max-width: 375px) {
    .circle-btn {
      width: 1.3rem;
      height: 1.3rem;
      font-size: 0.55rem;
    }
    .circle-btn-sm {
      width: 1rem;
      height: 1rem;
      font-size: 0.45rem;
    }
  }
`}</style>
    </div>
  );
}
