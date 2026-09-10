import { rand } from './util';

export const FALLING_EFFECTS = {
  snow: {
    containerId: 'timeofmagic-snow',
    className: 'timeofmagic-snowflake',
    items: ['❅', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❄'],
    counts: { light: 25, medium: 50, heavy: 75 },
    fallDelay: [0, 8],
    fallDuration: [8, 12],
    swayDelay: [0, 4],
    swayDuration: [2, 4],
    opacity: [0.4, 1],
    fontScale: [0.7, 1.3],
    dualAnimation: true,
  },
  leaves: {
    containerId: 'timeofmagic-leaves',
    className: 'timeofmagic-leaf',
    items: ['🍂', '🍁', '🍃', '🍂', '🍁', '🍃', '🍂', '🍁'],
    counts: { light: 10, medium: 25, heavy: 40 },
    fallDelay: [0, 10],
    fallDuration: [6, 12],
    swayDelay: [0, 5],
    swayDuration: [3, 5],
    opacity: [0.5, 1],
    fontScale: [0.8, 1.6],
    dualAnimation: true,
  },
  rain: {
    containerId: 'timeofmagic-rain',
    className: 'timeofmagic-raindrop',
    counts: { light: 40, medium: 80, heavy: 140 },
    fallDelay: [0, 2],
    fallDuration: [0.5, 1],
    opacity: [0.2, 0.6],
    height: [10, 30],
    dualAnimation: false,
  },
  petals: {
    containerId: 'timeofmagic-petals',
    className: 'timeofmagic-petal',
    items: ['🌸', '🌸', '🌸', '🌺', '🌸', '🌸', '🌼'],
    counts: { light: 12, medium: 24, heavy: 40 },
    fallDelay: [0, 10],
    fallDuration: [7, 13],
    swayDelay: [0, 5],
    swayDuration: [3, 5],
    opacity: [0.5, 1],
    fontScale: [0.8, 1.5],
    dualAnimation: true,
  },
  confetti: {
    containerId: 'timeofmagic-confetti',
    className: 'timeofmagic-confetti',
    items: ['🎊', '🎉', '🥳', '🎊', '✨', '🎉'],
    counts: { light: 20, medium: 40, heavy: 60 },
    fallDelay: [0, 8],
    fallDuration: [5, 10],
    swayDelay: [0, 4],
    swayDuration: [2, 4],
    opacity: [0.6, 1],
    fontScale: [0.8, 1.5],
    dualAnimation: true,
  },
  hearts: {
    containerId: 'timeofmagic-hearts',
    className: 'timeofmagic-heart',
    items: ['💖', '💗', '💘', '💕', '❤️', '💝'],
    counts: { light: 10, medium: 20, heavy: 35 },
    fallDelay: [0, 12],
    fallDuration: [9, 15],
    swayDelay: [0, 6],
    swayDuration: [3, 6],
    opacity: [0.5, 1],
    fontScale: [0.8, 1.6],
    direction: 'up',
    dualAnimation: true,
  },
  clovers: {
    containerId: 'timeofmagic-clovers',
    className: 'timeofmagic-clover',
    items: ['🍀', '🍀', '☘️'],
    counts: { light: 12, medium: 25, heavy: 40 },
    fallDelay: [0, 10],
    fallDuration: [6, 11],
    swayDelay: [0, 5],
    swayDuration: [2, 4],
    opacity: [0.5, 1],
    fontScale: [0.8, 1.5],
    dualAnimation: true,
  },
  eggs: {
    containerId: 'timeofmagic-eggs',
    className: 'timeofmagic-egg',
    items: ['🥚', '🥚', '🐣'],
    counts: { light: 8, medium: 15, heavy: 25 },
    fallDelay: [0, 12],
    fallDuration: [7, 12],
    swayDelay: [0, 6],
    swayDuration: [2, 5],
    opacity: [0.5, 1],
    fontScale: [0.8, 1.6],
    dualAnimation: true,
  },
  lanterns: {
    containerId: 'timeofmagic-lanterns',
    className: 'timeofmagic-lantern',
    items: ['🏮', '🏮', '🧧', '🧨', '🐉'],
    counts: { light: 10, medium: 20, heavy: 35 },
    fallDelay: [0, 12],
    fallDuration: [8, 14],
    swayDelay: [0, 6],
    swayDuration: [3, 6],
    opacity: [0.6, 1],
    fontScale: [0.9, 1.7],
    dualAnimation: true,
  },
  fireflies: {
    containerId: 'timeofmagic-fireflies',
    className: 'timeofmagic-firefly',
    counts: { light: 12, medium: 25, heavy: 40 },
    fallDelay: [0, 14],
    fallDuration: [10, 18],
    swayDelay: [0, 6],
    swayDuration: [3, 7],
    opacity: [0.6, 1],
    direction: 'up',
    dualAnimation: true,
  },
};

export function createParticleLayer(containerId) {
  const container = document.createElement('div');
  container.id = containerId;
  container.className = 'timeofmagic-layer';
  container.setAttribute('aria-hidden', 'true');

  document.body.appendChild(container);

  return container;
}

export function renderParticles(container, cfg, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = `${cfg.className} timeofmagic-particle`;
    el.style.left = `${Math.random() * 100}%`;

    if (cfg.items) {
      el.textContent = cfg.items[i % cfg.items.length];
    }

    if (cfg.dualAnimation) {
      el.style.animationDelay = `${rand(cfg.fallDelay[0], cfg.fallDelay[1])}s, ${rand(cfg.swayDelay[0], cfg.swayDelay[1])}s`;
      el.style.animationDuration = `${rand(cfg.fallDuration[0], cfg.fallDuration[1])}s, ${rand(cfg.swayDuration[0], cfg.swayDuration[1])}s`;
    } else {
      el.style.animationDelay = `${rand(cfg.fallDelay[0], cfg.fallDelay[1])}s`;
      el.style.animationDuration = `${rand(cfg.fallDuration[0], cfg.fallDuration[1])}s`;
    }

    if (cfg.opacity) {
      el.style.opacity = `${rand(cfg.opacity[0], cfg.opacity[1]).toFixed(2)}`;
    }

    if (cfg.fontScale) {
      el.style.fontSize = `${rand(cfg.fontScale[0], cfg.fontScale[1]).toFixed(2)}em`;
    }

    if (cfg.height) {
      el.style.height = `${Math.round(rand(cfg.height[0], cfg.height[1]))}px`;
    }

    container.appendChild(el);
  }
}
