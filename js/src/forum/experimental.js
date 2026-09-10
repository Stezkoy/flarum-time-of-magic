import { capitalize } from '../common';
import { forumAttribute, isInteractiveClick, rand } from './util';

// ============================================================================
// EXPERIMENTAL EFFECTS BLOCK
// Cut this whole file (plus the Experimental section in extend.php, the admin
// "_experimentalSection" and related LESS/locale keys) to remove these effects.
// ============================================================================

function on(name) {
  return !!forumAttribute('timeOfMagic' + capitalize(name));
}

function text(name, fallback = '') {
  return forumAttribute('timeOfMagic' + capitalize(name)) || fallback;
}

function itemsList(name, fallback) {
  const raw = String(forumAttribute('timeOfMagic' + capitalize(name)) ?? '')
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return raw.length ? raw : fallback;
}

// Cursor trail — fading particles following the cursor
function initCursorTrail() {
  const emojis = itemsList('trail_items', ['✦', '✨']);
  let lastMove = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMove < 60) return;
    lastMove = now;

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
function initCursorDust() {
  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.15) return;

    const dot = document.createElement('div');
    dot.className = 'timeofmagic-dust-dot timeofmagic-particle';
    dot.style.left = `${e.clientX + rand(-30, 30)}px`;
    dot.style.top = `${e.clientY + rand(-25, 25)}px`;
    dot.style.animationDelay = '0s';
    document.body.appendChild(dot);

    dot.addEventListener('animationend', () => dot.parentNode && dot.parentNode.removeChild(dot));
    setTimeout(() => dot.parentNode && dot.parentNode.removeChild(dot), 1300);
  });
}

// Background parallax — subtle background shift following the cursor
function initBackgroundParallax() {
  let raf = null;

  document.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      document.body.style.backgroundPosition = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
  });
}

// Cursor flashlight — soft light halo following the cursor
function initCursorFlashlight() {
  const light = document.createElement('div');
  light.id = 'timeofmagic-flashlight';
  light.setAttribute('aria-hidden', 'true');
  document.body.appendChild(light);

  let raf = null;

  document.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      light.style.setProperty('--x', `${e.clientX}px`);
      light.style.setProperty('--y', `${e.clientY}px`);
    });
  });
}

// Static starfield — twinkling fixed layer
function initStarfield() {
  const container = document.createElement('div');
  container.className = 'timeofmagic-layer timeofmagic-stars';
  container.setAttribute('aria-hidden', 'true');

  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'timeofmagic-star';
    star.style.left = `${(Math.random() * 100).toFixed(2)}%`;
    star.style.top = `${(Math.random() * 100).toFixed(2)}%`;
    const size = rand(1, 3).toFixed(1);
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${rand(0, 6).toFixed(2)}s`;
    star.style.animationDuration = `${rand(2, 6).toFixed(2)}s`;
    container.appendChild(star);
  }

  document.body.appendChild(container);
}

// Click burst — custom emoji explodes from the click point
function initClickBurst() {
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

// Fog — slow drifting translucent blobs
function initFog() {
  const container = document.createElement('div');
  container.className = 'timeofmagic-layer timeofmagic-fog';
  container.setAttribute('aria-hidden', 'true');

  for (let i = 0; i < 3; i++) {
    const blob = document.createElement('div');
    blob.className = 'timeofmagic-fog-blob';
    blob.style.top = `${15 + i * 25}%`;
    blob.style.left = `${i * 30 - 10}%`;
    blob.style.animationDelay = `${(-i * 12).toFixed(0)}s`;
    container.appendChild(blob);
  }

  document.body.appendChild(container);
}

// Site tint — translucent color overlay over the whole page
function initSiteTint() {
  const color = text('site_tint_color');
  if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) return;

  const layer = document.createElement('div');
  layer.id = 'timeofmagic-site-tint';
  layer.setAttribute('aria-hidden', 'true');
  layer.style.background = color;
  document.body.appendChild(layer);
}

export function initExperimental() {
  if (on('cursor_trail')) initCursorTrail();
  if (on('cursor_dust')) initCursorDust();
  if (on('bg_parallax')) initBackgroundParallax();
  if (on('cursor_flashlight')) initCursorFlashlight();
  if (on('starfield')) initStarfield();
  if (on('click_burst')) initClickBurst();
  if (on('fog')) initFog();
  if (on('site_tint')) initSiteTint();
}

// ========================= end of EXPERIMENTAL BLOCK ========================
