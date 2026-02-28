'use client';

import { useEffect } from 'react';

const BACKGROUNDS = ['/assets/bg/background_1.jpg', '/assets/bg/background_2.jpg', '/assets/bg/background_3.jpg'];

export default function BackgroundRotator() {
  useEffect(() => {
    if (!BACKGROUNDS.length) {
      return;
    }

    const key = 'yourlocal_bg_last_index';
    const previous = Number.parseInt(window.sessionStorage.getItem(key) || '', 10);
    let next = Math.floor(Math.random() * BACKGROUNDS.length);

    if (BACKGROUNDS.length > 1 && Number.isInteger(previous) && previous === next) {
      next = (next + 1) % BACKGROUNDS.length;
    }

    document.body.style.setProperty('--page-bg-image', `url("${BACKGROUNDS[next]}")`);
    window.sessionStorage.setItem(key, String(next));
  }, []);

  return null;
}
