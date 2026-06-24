import { useState } from "react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";
import PageBackground from "./PageBackground";

const faqData = [
  {
    question: "When is the RSVP deadline?",
    answer: "Please RSVP by 7th February 2026 to make sure we have an accurate headcount.",
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
    answer: "The dress code is cocktail attire. The ceremony will be held on a grassy area so stiletto heels are not recommended. ",
  },
  {
    question: "Can I bring a guest?",
    answer: "Please refer to your invitation. If a guest is listed, they are welcome!",
  },
  {
    question: "Are kids welcome?",
    answer: "As much as we love your little ones, our wedding will be an adults-only celebration. We appreciate your understanding and hope you enjoy a night off to celebrate with us.",
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
    answer: "No. Your presence at our wedding is the greatest gift of all. However, if you wish to celebrate with a gift, a contribution towards our honeymoon would be sincerely appreciated.",
  },
  {
    question: "How to contact us?",
    answer: [
      { name: "Nicole:", email: "nandnblaga@gmail.com", mobile: "+61 428 229 283" },
      { name: "Nathan:", email: "nathanblaga90@gmail.com", mobile: "+61 436 190 824" },
    ],
  },
];

const ITEMS_PER_PAGE = 3;

export default function FAQs() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(faqData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFaqs = faqData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      <PageBackground />

      <h1 className="faqs-heading relative z-20">FAQs</h1>

      <div className="relative z-20 flex flex-col items-center pagination-static">
        <div className="flex space-x-2 items-center">
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

          {getPageNumbers().map((num, idx) =>
            num === "…" ? (
              <span key={idx} className="px-1 text-gray-500">…</span>
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

          <button
            className={`circle-btn-sm ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-[#eda5a5] border border-[#eda5a5] hover:bg-[#fce8e8]"
            }`}
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>

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
    </div>
  );
}
