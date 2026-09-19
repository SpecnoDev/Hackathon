'use client';

import { useCallback, useEffect, useState } from 'react';

const NEXT_KEYS = ['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'];
const PREVIOUS_KEYS = ['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'];
const FULL_SCREEN_KEY = 'f';

const slideFromHash = (total: number): number => {
  const asked = Number(window.location.hash.replace('#', ''));
  return Number.isInteger(asked) && asked >= 1 && asked <= total ? asked - 1 : 0;
};

interface DeckNavigation {
  index: number;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

/** Arrow keys, space, Home and End move through the deck; F fills the screen. The slide number lives in the URL so a reload keeps your place. */
export const useDeckNavigation = (total: number): DeckNavigation => {
  const [index, setIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const goTo = useCallback((target: number) => setIndex(Math.min(Math.max(target, 0), total - 1)), [total]);
  const next = useCallback(() => setIndex((current) => Math.min(current + 1, total - 1)), [total]);
  const previous = useCallback(() => setIndex((current) => Math.max(current - 1, 0)), []);

  const toggleFullScreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => undefined);
  }, []);

  useEffect(() => {
    setIndex(slideFromHash(total));
    const onHash = (): void => setIndex(slideFromHash(total));
    const onFullScreen = (): void => setIsFullScreen(Boolean(document.fullscreenElement));
    window.addEventListener('hashchange', onHash);
    document.addEventListener('fullscreenchange', onFullScreen);
    return () => {
      window.removeEventListener('hashchange', onHash);
      document.removeEventListener('fullscreenchange', onFullScreen);
    };
  }, [total]);

  useEffect(() => {
    window.history.replaceState(null, '', `#${index + 1}`);
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      // A slide's own controls (the price slider, a button) keep their keys.
      if (event.target instanceof HTMLElement && event.target.closest('input, button, a, select, textarea, iframe')) return;
      if (NEXT_KEYS.includes(event.key)) next();
      else if (PREVIOUS_KEYS.includes(event.key)) previous();
      else if (event.key === 'Home') goTo(0);
      else if (event.key === 'End') goTo(total - 1);
      else if (event.key.toLowerCase() === FULL_SCREEN_KEY) toggleFullScreen();
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, next, previous, toggleFullScreen, total]);

  return { index, goTo, next, previous, isFullScreen, toggleFullScreen };
};
