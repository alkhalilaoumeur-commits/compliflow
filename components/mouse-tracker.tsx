"use client";

import { useEffect } from "react";

export function MouseTracker() {
  useEffect(() => {
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    let targetX = 0;
    let targetY = 0;

    function onMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    }

    function loop() {
      lastX += (targetX - lastX) * 0.18;
      lastY += (targetY - lastY) * 0.18;
      document.body.style.setProperty("--mouse-x", `${lastX}px`);
      document.body.style.setProperty("--mouse-y", `${lastY}px`);
      if (Math.abs(targetX - lastX) > 0.5 || Math.abs(targetY - lastY) > 0.5) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
