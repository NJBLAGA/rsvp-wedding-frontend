import { useEffect, useRef } from "react";

const PETAL_IMG_URL = "https://djjjk9bjm164h.cloudfront.net/petal.png";
const PETAL_COUNT = 12;

export function usePetalAnimation(canvasRef) {
  const animationIdRef = useRef(null);
  const petalArrayRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!petalArrayRef.current.length) {
      const petalImg = new Image();
      petalImg.src = PETAL_IMG_URL;

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
        for (let i = 0; i < PETAL_COUNT; i++) {
          petalArrayRef.current.push(new Petal());
        }
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
  }, [canvasRef]);
}
