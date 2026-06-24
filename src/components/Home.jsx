import WeddingImage from "../assets/us.JPG";
import PageBackground from "./PageBackground";

export default function Home() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-start overflow-hidden">
      <PageBackground />

      <div className="relative z-20 flex flex-col items-center justify-start w-full px-4">
        <h1 className="home-heading text-center text-black mb-2">
          Our Special Day
        </h1>

        <div className="card home-card mt-0 bg-transparent border-none shadow-none flex flex-col items-center">
          <figure className="w-full flex justify-center">
            <img
              src={WeddingImage}
              alt="Wedding couple"
              className="home-photo rounded-t-lg object-cover opacity-95"
            />
          </figure>
          <div className="card-body text-center p-2 bg-transparent w-full">
            <p className="home-invite mt-1">
              We would like to invite you to celebrate our wedding.
            </p>
            <h2 className="home-date">Saturday, 14th March, 2026</h2>
            <h3 className="home-venue mt-1">
              <strong>Camden Valley Inn</strong>
              <br />
              290 Remembrance Driveway, Cawdor NSW 2570
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
