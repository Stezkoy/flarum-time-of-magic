import app from 'flarum/common/app';

function forumAttribute(name) {
  if (app.forum && typeof app.forum.attribute === 'function') {
    return app.forum.attribute(name);
  }

  const resources = (app.data && app.data.resources) || [];
  const forumRecord = resources.find((r) => r && r.type === 'forums');
  return forumRecord && forumRecord.attributes && forumRecord.attributes[name];
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const FALLING_EFFECTS = {
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
};

function applyMagicColors(colors) {
  const map = {
    progressBar: '--timeofmagic-accent-bar',
    backToTop: '--timeofmagic-accent-top',
    scrollbar: '--timeofmagic-accent-scrollbar',
    clickSpark: '--timeofmagic-accent-spark',
  };

  Object.keys(map).forEach((key) => {
    if (colors[key]) {
      document.documentElement.style.setProperty(map[key], colors[key]);
    }
  });
}

function getSchedules() {
  const raw = forumAttribute('timeOfMagicSchedules');

  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string' && raw) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  return [];
}

function normalizeEffects(schedule) {
  return (schedule.effects || []).map((effect) =>
    typeof effect === 'string' ? { name: effect, density: null } : effect
  );
}

function isScheduled(kind) {
  const now = Date.now();

  return getSchedules().some((s) => {
    if (!s || !s.enabled) return false;
    if (!normalizeEffects(s).some((e) => e.name === kind)) return false;

    const start = new Date(s.start).getTime();
    const end = new Date(s.end).getTime();

    return !Number.isNaN(start) && !Number.isNaN(end) && now >= start && now <= end;
  });
}

function scheduledDensity(kind) {
  const now = Date.now();
  let density = null;

  getSchedules().some((s) => {
    if (!s || !s.enabled) return false;

    const effect = normalizeEffects(s).find((e) => e.name === kind && e.density);
    if (!effect) return false;

    const start = new Date(s.start).getTime();
    const end = new Date(s.end).getTime();

    if (!Number.isNaN(start) && !Number.isNaN(end) && now >= start && now <= end) {
      density = effect.density;
      return true;
    }

    return false;
  });

  return density;
}

function isEffectActive(kind) {
  return !!forumAttribute('timeOfMagic' + capitalize(kind)) || isScheduled(kind);
}

function createFallingEffect(kind, count) {
  const cfg = FALLING_EFFECTS[kind];

  const container = document.createElement('div');
  container.id = cfg.containerId;
  container.className = 'timeofmagic-layer';
  container.setAttribute('aria-hidden', 'true');

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

  document.body.appendChild(container);
}

function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress-bar';
  document.body.appendChild(bar);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = scrollHeight > 0 ? `${(scrollTop / scrollHeight) * 100}%` : '0%';
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initBackToTop() {
  const rounded = !!forumAttribute('timeOfMagicBackToTopRounded');
  const iconClass = forumAttribute('timeOfMagicBackToTopIcon') || 'fa-solid fa-arrow-up';

  const btn = document.createElement('div');
  btn.id = 'back-to-top';
  btn.classList.add(rounded ? 'back-to-top--rounded' : 'back-to-top--circle');

  const iconEl = document.createElement('i');
  iconEl.className = iconClass;
  btn.appendChild(iconEl);

  document.body.appendChild(btn);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 300);
        ticking = false;
      });
      ticking = true;
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initScrollbar() {
  if (forumAttribute('timeOfMagicScrollbar')) {
    document.documentElement.classList.add('timeofmagic-custom-scrollbar');
  }
}

function initSwapLayout() {
  if (forumAttribute('timeOfMagicSwapLayout')) {
    document.documentElement.classList.add('timeofmagic-swap-layout');
  }
}

function initBackground() {
  const VALID_PATTERNS = ['dots', 'grid', 'diagonal', 'waves', 'hexagon'];
  const bgPattern = forumAttribute('timeOfMagicBackground') || '';

  if (bgPattern && VALID_PATTERNS.includes(bgPattern)) {
    document.body.classList.add(`timeofmagic-bg-${bgPattern}`);
  }
}

function initClickSpark() {
  document.addEventListener('click', (e) => {
    const spark = document.createElement('div');
    spark.className = 'timeofmagic-spark';
    spark.style.left = `${e.clientX}px`;
    spark.style.top = `${e.clientY}px`;
    document.body.appendChild(spark);

    setTimeout(() => {
      if (spark.parentNode) {
        spark.parentNode.removeChild(spark);
      }
    }, 700);
  });
}

function initFallingEffect(kind) {
  const density = scheduledDensity(kind) || forumAttribute('timeOfMagic' + capitalize(kind) + 'Density') || 'medium';
  const counts = FALLING_EFFECTS[kind].counts;
  createFallingEffect(kind, counts[density] || counts.medium);
}

function initSnow() {
  initFallingEffect('snow');
}

function initLeaves() {
  initFallingEffect('leaves');
}

function initRain() {
  initFallingEffect('rain');
}

function initPetals() {
  initFallingEffect('petals');
}

function initConfetti() {
  initFallingEffect('confetti');
}

function initHearts() {
  initFallingEffect('hearts');
}

function initClovers() {
  initFallingEffect('clovers');
}

function initEggs() {
  initFallingEffect('eggs');
}

function initLanterns() {
  initFallingEffect('lanterns');
}

app.initializers.add('stezkoy-time-of-magic', () => {
  applyMagicColors({
    progressBar: forumAttribute('timeOfMagicProgressBarColor'),
    backToTop: forumAttribute('timeOfMagicBackToTopColor'),
    scrollbar: forumAttribute('timeOfMagicScrollbarColor'),
    clickSpark: forumAttribute('timeOfMagicClickSparkColor'),
  });

  initScrollbar();
  initSwapLayout();
  initBackground();

  if (forumAttribute('timeOfMagicProgressBar')) {
    initProgressBar();
  }

  if (forumAttribute('timeOfMagicBackToTop')) {
    initBackToTop();
  }

  if (forumAttribute('timeOfMagicClickSpark')) {
    initClickSpark();
  }

  if (isEffectActive('snow')) initSnow();
  if (isEffectActive('leaves')) initLeaves();
  if (isEffectActive('rain')) initRain();
  if (isEffectActive('petals')) initPetals();
  if (isEffectActive('confetti')) initConfetti();
  if (isEffectActive('hearts')) initHearts();
  if (isEffectActive('clovers')) initClovers();
  if (isEffectActive('eggs')) initEggs();
  if (isEffectActive('lanterns')) initLanterns();
});