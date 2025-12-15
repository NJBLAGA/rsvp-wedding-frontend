import { useState, useEffect, useRef } from "react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";

const faqData = [
  {
    question: "When is the RSVP deadline?",
    answer:
      "Please RSVP by 7th February 2026 to make sure we have an accurate headcount.",
  },
  {
    question: "Where will the ceremony and reception be held?",
    answer: [
      {
        dir1: "Both the ceremony and reception will be held at Camden Valley Inn.",
        dir2: "Please click the link below for directions to the venue.",
        address: "290 Remembrance Dr, Cawdor NSW",
      },
    ],
  },
  {
    question: "What should I wear to the wedding?",
    answer:
      "The dress code is cocktail attire. The ceremony will be held on a grassy area so stiletto heels are not recommended. ",
  },
  {
    question: "Can I bring a guest?",
    answer:
      "Please refer to your invitation. If a guest is listed, they are welcome!",
  },
  {
    question: "Are kids welcome?",
    answer:
      "As much as we love your little ones, our wedding will be an adults-only celebration. We appreciate your understanding and hope you enjoy a night off to celebrate with us.",
  },
  {
    question: "Will there be parking available?",
    answer: "Yes. Free parking will be available at the venue.",
  },
  {
    question: "Is there accommodation available?",
    answer: "Yes. Camden Valley Inn has a limited number of rooms available.",
  },
  {
    question: "Do you have a gift registry?",
    answer:
      "No. Your presence at our wedding is the greatest gift of all. However, if you wish to celebrate with a gift, a contribution towards our honeymoon would be sincerely appreciated.",
  },
  {
    question: "How to contact us?",
    answer: [
      {
        name: "Nicole:",
        email: "nandnblaga@gmail.com",
        mobile: "+61 428 229 283",
      },
      {
        name: "Nathan:",
        email: "nathanblaga90@gmail.com",
        mobile: "+61 436 190 824",
      },
    ],
  },
];

export default function FAQs() {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const petalArrayRef = useRef([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(3);
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
      <div className="relative z-20 flex flex-col items-center w-full max-w-md px-4 space-y-2 faq-wrapper">
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
                    )}{" "}
                    {ans.mobile && (
                      <a
                        href={`tel:${ans.mobile}`}
                        className="flex items-center space-x-1 hover:underline text-black answer-text"
                      >
                        <PhoneIcon className="w-4 h-4 text-[#eda5a5]" />
                        <span>{ans.name}</span>
                        <span>{ans.mobile}</span>
                      </a>
                    )}
                    <span className="answer-text">
                      {ans.dir1} {ans.dir2}
                    </span>
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
        /* Desktop (≥1024px) */
         @media (min-width: 1024px) and (max-height: 820px) {
          h1 { font-size: 2rem !important; margin-top: 4rem !important; }
        
  /* FAQ container narrower */
  .faq-wrapper {
    max-width: 420px !important;
  }

  /* Card spacing */
  .collapse {
    margin-left: 1rem;
    margin-right: 1rem;
  }

  /* Question text */
  .collapse-title {
    font-size: 0.75rem !important;
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
  }

  /* Answer text */
  .answer-text {
    font-size: 0.65rem !important;
    line-height: 1rem !important;
  }
}

`}</style>
    </div>
  );
}
