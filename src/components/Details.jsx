import { useState, useEffect } from "react";
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

export default function Schedule() {
  const PETAL_COUNT = 25;
  const PETAL_COLOR = "#f28ca0";
  const LINK_COLOR = "#c87878";
  const HOVER_COLOR = "#c87878";
  const [petals, setPetals] = useState([]);
  const [modalData, setModalData] = useState(null);

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

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden px-2 sm:px-3">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .petal {
          position: absolute;
          background: radial-gradient(circle at 50% 50%, #ffe4e1 0%, ${PETAL_COLOR} 100%);
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
        .bg-center {
          background-size: cover;
          background-position: center;
        }
        @media (min-width: 1024px) {
          .bg-center {
            background-size: contain !important;
            background-repeat: no-repeat;
            background-position: top center;
          }
        }

        h1 {
          font-family: 'Dancing Script', cursive;
          text-align: center;
          font-size: 4.5rem;
          margin-top: 10rem;
        }

        .faq-question { 
          color: black; 
          cursor: pointer;
          display: flex; 
          justify-content: flex-start; 
          align-items: center; 
          width: 100%; 
          max-width: 700px;
          padding: 0.5rem 0.75rem; 
          border-bottom: 1px solid #d1d5db; 
          transition: color 0.2s, border-color 0.2s;
        }
        .faq-question:hover { 
          color: ${HOVER_COLOR}; 
          border-color: ${HOVER_COLOR};
        }
        .faq-cross { 
          font-weight: bold; 
          font-size: 1.25rem; 
          margin-right: 0.5rem; 
          transition: color 0.2s, transform 0.3s;
        }
        .faq-question:hover .faq-cross { color: ${HOVER_COLOR}; }

        a { color: ${LINK_COLOR}; }

        /* Modal */
        .modal-border { border: 3px solid ${PETAL_COLOR}; }
        .modal-close { 
          font-size: 1.25rem; 
          font-weight: bold; 
          margin-bottom: 2rem; /* extra bottom margin for cross */
          transition: transform 0.3s;
        }
        .modal-question { 
          text-align: left; 
          margin-top: 1.5rem; /* space between cross and question */
        }
        .modal-content { max-height: 80vh; overflow-y: auto; }

        /* Responsive adjustments */
        @media (max-width: 1023px) {
          h1 { font-size: 3rem; margin-top: 6rem; }
          .faq-question { max-width: 90%; padding: 0.4rem 0.5rem; font-size: 0.9rem; }
          .faq-cross { font-size: 1rem; margin-right: 0.4rem; }
          .modal-border { max-width: 90%; margin: 0 5%; padding: 1.5rem; }
          .modal-question { font-size: 1.2rem; }
          .modal-close { font-size: 1.1rem; margin-bottom: 1.5rem; }
          a { font-size: 0.9rem; }
          svg { width: 16px; height: 16px; }
        }

        @media (max-width: 400px) {
          h1 { font-size: 2rem; margin-top: 5rem; }
          .faq-question { max-width: 95%; padding: 0.3rem 0.4rem; font-size: 0.85rem; }
          .faq-cross { font-size: 0.9rem; margin-right: 0.3rem; }
          .modal-border { max-width: 95%; margin: 0 5%; padding: 1rem; }
          .modal-question { font-size: 1rem; }
          .modal-close { font-size: 1rem; margin-bottom: 1.5rem; }
          a { font-size: 0.85rem; }
          svg { width: 14px; height: 14px; }
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

      {/* Heading */}
      <h1 className="relative z-10 drop-shadow-lg">FAQs</h1>

      {/* FAQ Questions */}
      <div className="relative z-10 w-full p-3 flex flex-col items-center space-y-2">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="faq-question"
            onClick={() => setModalData(item)}
          >
            <span className="faq-cross">+</span>
            <span>{item.question}</span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            onClick={() => setModalData(null)}
          />
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative space-y-4 z-10 modal-border modal-content">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-4 right-4 modal-close"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold modal-question">
              {modalData.question}
            </h2>
            <div className="space-y-2">
              {Array.isArray(modalData.answer) ? (
                modalData.answer.map((ans, idx) => (
                  <div key={idx} className="flex flex-col space-y-1">
                    {ans.name && (
                      <span className="font-medium">{ans.name}</span>
                    )}
                    {ans.email && (
                      <a
                        href={`mailto:${ans.email}`}
                        className="flex items-center space-x-1 hover:underline"
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                        <span>{ans.email}</span>
                      </a>
                    )}
                    {ans.mobile && (
                      <a
                        href={`tel:${ans.mobile}`}
                        className="flex items-center space-x-1 hover:underline"
                      >
                        <PhoneIcon className="w-4 h-4" />
                        <span>{ans.mobile}</span>
                      </a>
                    )}
                    {ans.address && (
                      <a
                        href="https://maps.app.goo.gl/6NaC3CQ7zaXYqhBQ7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 hover:underline"
                      >
                        <MapPinIcon className="w-4 h-4" />
                        <span>{ans.address}</span>
                      </a>
                    )}
                    {typeof ans === "string" && <p>{ans}</p>}
                  </div>
                ))
              ) : (
                <p>{modalData.answer}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
