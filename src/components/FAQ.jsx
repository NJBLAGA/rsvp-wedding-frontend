import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import faqData from "../data/faq.json";

export default function FAQ() {
  const [faqOpen, setFaqOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState([]);
  const [contactOpen, setContactOpen] = useState(false);
  const [venueOpen, setVenueOpen] = useState(false);
  const contentRefs = useRef([]);

  useEffect(() => {
    setCardOpen(faqData.faq.map(() => false));
  }, []);

  const toggleCard = (idx) => {
    setCardOpen((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  useEffect(() => {
    faqData.faq.forEach((_, idx) => {
      const el = contentRefs.current[idx];
      if (el) {
        el.style.maxHeight = faqOpen
          ? cardOpen[idx]
            ? el.scrollHeight + "px"
            : "0px"
          : "0px";
      }
    });
  }, [faqOpen, cardOpen]);

  useEffect(() => {
    if (faqOpen) {
      faqData.faq.forEach((_, idx) => {
        const el = contentRefs.current[idx];
        if (el) {
          el.style.maxHeight = cardOpen[idx] ? el.scrollHeight + "px" : "0px";
        }
      });
    }
  }, [cardOpen, faqOpen]);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6">
      {/* Contact Us */}
      <div className="mt-6">
        <button
          onClick={() => setContactOpen(!contactOpen)}
          className="w-full flex justify-between items-center text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center px-2 py-2 md:px-0"
        >
          <span>Contact Us</span>
          <ChevronDownIcon
            className={`w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 text-gray-600 transition-transform duration-300 ${
              contactOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            contactOpen ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <div className="flex flex-col md:flex-row md:space-x-4 bg-white border rounded-lg p-4">
            {faqData.contact.map((person, idx) => (
              <div key={idx} className="flex-1 flex flex-col mb-4 md:mb-0">
                <span className="font-semibold text-sm sm:text-base mb-2">
                  {person.name}
                </span>
                <div className="flex items-center space-x-2 flex-wrap text-sm sm:text-base">
                  <EnvelopeIcon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 flex-shrink-0" />
                  <a
                    href={`mailto:${person.email}`}
                    className="text-blue-600 hover:underline break-words"
                  >
                    {person.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2 flex-wrap text-sm sm:text-base">
                  <PhoneIcon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 flex-shrink-0" />
                  <a
                    href={`tel:${person.mobile}`}
                    className="text-blue-600 hover:underline break-words"
                  >
                    {person.mobile}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Venue Directions */}
      <div className="mt-6">
        <button
          onClick={() => setVenueOpen(!venueOpen)}
          className="w-full flex justify-between items-center text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center px-2 py-2 md:px-0"
        >
          <span>Venue Directions</span>
          <ChevronDownIcon
            className={`w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 text-gray-600 transition-transform duration-300 ${
              venueOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            venueOpen ? "max-h-[200px]" : "max-h-0"
          }`}
        >
          <div className="flex flex-col bg-white border rounded-lg p-4">
            <span className="font-semibold text-sm sm:text-base mb-2">
              Camden Valley Inn
            </span>
            <div className="flex items-center space-x-2 flex-wrap text-sm sm:text-base">
              <MapPinIcon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 flex-shrink-0" />
              <a
                href="https://www.google.com/maps/place/Camden+Valley+Inn+(CVI)/@-34.091645,150.6917416,17z/data=!3m1!4b1!4m6!3m5!1s0x6b12fa0dbbf01671:0xa343f8beaaafcd44!8m2!3d-34.0916495!4d150.6943219!16s%2Fg%2F1th822sj?entry=ttu&g_ep=EgoyMDI1MDkwMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-words"
              >
                Remembrance Dr Cawdor
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Title */}
      <button
        onClick={() => setFaqOpen(!faqOpen)}
        className="w-full flex justify-between items-center text-2xl sm:text-3xl md:text-4xl font-bold my-6 px-2 py-2 md:px-0"
      >
        <span>FAQ</span>
        <ChevronDownIcon
          className={`w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-gray-600 transition-transform duration-300 ${
            faqOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* FAQ Cards Section */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          faqOpen ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <div className="space-y-3 sm:space-y-4">
          {faqData.faq.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow-sm bg-white overflow-hidden"
            >
              {/* Question */}
              <div className="w-full flex justify-between items-center px-3 py-2 sm:px-4 sm:py-3">
                <span className="font-semibold text-[12px] sm:text-sm md:text-base">
                  {item.question}
                </span>
                <button onClick={() => toggleCard(idx)}>
                  <ChevronDownIcon
                    className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-600 transition-transform duration-300 ${
                      cardOpen[idx] ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              </div>

              {/* Answer */}
              <div
                ref={(el) => (contentRefs.current[idx] = el)}
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{ maxHeight: "0px" }}
              >
                <div className="px-3 py-3 sm:px-4 sm:py-4 text-gray-700 text-[13px] sm:text-sm md:text-base">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
