import WeddingImage from "../assets/87qyuoagdwce1.png";

export default function Home() {
  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-6">
      <h1 className="text-3xl md:text-5xl font-bold text-center">
        Welcome to Our Wedding!
      </h1>
      <p className="text-center text-gray-600 max-w-2xl">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <img
        src={WeddingImage}
        alt="Wedding"
        className="w-full max-w-xl rounded-lg shadow-lg object-cover"
      />
    </div>
  );
}
