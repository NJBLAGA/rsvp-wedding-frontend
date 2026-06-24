import { useRef } from "react";
import BackgroundImage from "../assets/16264603_v839-my-10a.svg";
import { usePetalAnimation } from "../hooks/usePetalAnimation";

export default function PageBackground() {
  const canvasRef = useRef(null);
  usePetalAnimation(canvasRef);

  return (
    <>
      <div
        className="absolute inset-0 z-0 bg-wedding"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />
    </>
  );
}
