"use client";

import { useEffect } from "react";

/**
 * Универсальный хук для отслеживания видимости вкладки/страницы.
 * onHide вызывается при сворачивании, onShow — при возврате.
 * Работает и с событиями pagehide/pageshow для лучшей поддержки iOS Safari.
 */
export function usePageVisibilityPause(onHide: () => void, onShow: () => void) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        onHide();
      } else if (document.visibilityState === "visible") {
        onShow();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Доп. совместимость с iOS Safari
    window.addEventListener("pagehide", onHide);
    window.addEventListener("pageshow", onShow);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("pageshow", onShow);
    };
  }, [onHide, onShow]);
}