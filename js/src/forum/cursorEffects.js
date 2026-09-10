import { capitalize } from '../common';
import { forumAttribute, isInteractiveClick, rand } from './util';

function attr(name) {
  return 'timeOfMagic' + name.split('_').map((p) => capitalize(p)).join('');
}

function itemsList(name, fallback) {
  const raw = String(forumAttribute(attr(name)) ?? '')
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return raw.length ? raw : fallback;
}

// Cursor trail — fading particles following the cursor
export function initCursorTrail() {
  const emojis = itemsList('trail_items', ['✦', '✨']);
  let last = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 60) return;
    last = now;

    const el = document.createElement('div');
    el.className = 'timeofmagic-trail-particle timeofmagic-particle';
    el.textContent = emojis[(Math.random() * emojis.length) | 0];
    el.style.left = `${e.clientX + rand(-8, 8)}px`;
    el.style.top = `${e.clientY + rand(-8, 8)}px`;
    el.style.fontSize = `${rand(0.6, 1.1).toFixed(2)}em`;
    document.body.appendChild(el);

    el.addEventListener('animationend', () => el.parentNode && el.parentNode.removeChild(el));
    setTimeout(() => el.parentNode && el.parentNode.removeChild(el), 900);
  });
}

// Cursor dust — occasional tiny glowing dots around the cursor
export function initCursorDust() {
  let last = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 80) return;
    last = now;

    if (Math.random() > 0.15) return;

    const dot = document.createElement('div');
    dot.className = 'timeofmagic-dust-dot timeofmagic-particle';
    dot.style.left = `${e.clientX + rand(-30, 30)}px`;
    dot.style.top = `${e.clientY + rand(-25, 25)}px`;
    document.body.appendChild(dot);

    dot.addEventListener('animationend', () => dot.parentNode && dot.parentNode.removeChild(dot));
    setTimeout(() => dot.parentNode && dot.parentNode.removeChild(dot), 1300);
  });
}

// Cursor flashlight — soft light spot around the cursor over a dark overlay
export function initCursorFlashlight() {
  const light = document.createElement('div');
  light.id = 'timeofmagic-flashlight';
  light.classList.add('is-off');
  light.setAttribute('aria-hidden', 'true');
  document.body.appendChild(light);

  let raf = null;

  document.addEventListener('mousemove', (e) => {
    light.classList.remove('is-off');

    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      light.style.setProperty('--x', `${e.clientX}px`);
      light.style.setProperty('--y', `${e.clientY}px`);
    });
  });
}

// Click burst — custom emoji explodes from the click point
export function initClickBurst() {
  const emojis = itemsList('click_burst_items', ['✨', '💥', '⭐']);

  document.addEventListener('click', (e) => {
    if (isInteractiveClick(e)) return;

    for (let i = 0; i < 8; i++) {
      const el = document.createElement('div');
      el.className = 'timeofmagic-burst-particle timeofmagic-particle';
      el.textContent = emojis[(Math.random() * emojis.length) | 0];
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.setProperty('--dx', `${rand(-70, 70).toFixed(0)}px`);
      el.style.setProperty('--dy', `${rand(-70, 40).toFixed(0)}px`);
      el.style.animationDelay = `${(i * 0.02).toFixed(2)}s`;
      document.body.appendChild(el);

      el.addEventListener('animationend', () => el.parentNode && el.parentNode.removeChild(el));
      setTimeout(() => el.parentNode && el.parentNode.removeChild(el), 900);
    }
  });
}
