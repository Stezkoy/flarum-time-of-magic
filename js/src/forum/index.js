import app from 'flarum/common/app';
import { extend } from 'flarum/common/extend';
import Switch from 'flarum/common/components/Switch';
import FieldSet from 'flarum/common/components/FieldSet';
import { PREFIX, capitalize, parseJsonArray, parseCustomConfig, normalizeEffects, isScheduleActive } from '../common';
import { FALLING_EFFECTS, createParticleLayer, renderParticles } from './fallingEffects';

const CSS_VARIABLES = {
  progressBar: '--timeofmagic-accent-bar',
  backToTop: '--timeofmagic-accent-top',
  backToTopIcon: '--timeofmagic-accent-top-icon',
  scrollbar: '--timeofmagic-accent-scrollbar',
  clickSpark: '--timeofmagic-accent-spark',
};

function forumAttribute(name) {
  if (app.forum && typeof app.forum.attribute === 'function') {
    return app.forum.attribute(name);
  }

  const resources = (app.data && app.data.resources) || [];
  const forumRecord = resources.find((r) => r && r.type === 'forums');
  return forumRecord && forumRecord.attributes && forumRecord.attributes[name];
}

function userPreference(name) {
  if (app.session && app.session.user) {
    return app.session.user.preferences()?.[name];
  }

  const data = app.data || {};
  const userId = data.session && data.session.userId;

  if (!userId) return undefined;

  const userResource = (data.resources || []).find(
    (r) => r && r.type === 'users' && String(r.id) === String(userId)
  );

  return userResource && userResource.attributes && userResource.attributes.preferences
    ? userResource.attributes.preferences[name]
    : undefined;
}

function effectsDisabled() {
  return !!userPreference('disableEffects');
}

function getSchedules() {
  return parseJsonArray(forumAttribute('timeOfMagicSchedules'));
}

function activeSchedule(kind) {
  return getSchedules().find(
    (s) => isScheduleActive(s) && normalizeEffects(s).some((e) => e.name === kind)
  );
}

function isEffectActive(kind) {
  return !!forumAttribute('timeOfMagic' + capitalize(kind)) || !!activeSchedule(kind);
}

function effectDensity(kind) {
  const schedule = activeSchedule(kind);

  if (schedule) {
    const effect = normalizeEffects(schedule).find((e) => e.name === kind);
    if (effect && effect.density) return effect.density;
  }

  return forumAttribute('timeOfMagic' + capitalize(kind) + 'Density') || 'medium';
}

function getCustomConfig(slot) {
  const raw = forumAttribute('timeOfMagicCustom' + capitalize(slot));
  const cfg = parseCustomConfig(raw);

  const items = cfg.items
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return { ...cfg, items };
}

function initUserSettings() {
  if (!forumAttribute('timeOfMagicAllowUserDisable')) return;

  extend('flarum/forum/components/SettingsPage', 'settingsItems', function (items) {
    items.add(
      'timeOfMagicEffects',
      <FieldSet
        className="Settings-timeOfMagicEffects FieldSet--min"
        label={app.translator.trans(PREFIX + '.forum.effects_section_heading')}
        description={app.translator.trans(PREFIX + '.forum.effects_section_description', {}, true)}
      >
        <Switch
          state={!!(app.session.user && app.session.user.preferences()?.disableEffects)}
          onchange={(value) => {
            app.session.user.savePreferences({ disableEffects: value }).then(() => m.redraw());
          }}
        >
          {app.translator.trans(PREFIX + '.forum.disable_effects_label')}
        </Switch>
      </FieldSet>,
      8
    );

    return items;
  });
}

function applyMagicColors() {
  Object.entries({
    progressBar: forumAttribute('timeOfMagicProgressBarColor'),
    backToTop: forumAttribute('timeOfMagicBackToTopColor'),
    backToTopIcon: forumAttribute('timeOfMagicBackToTopIconColor'),
    scrollbar: forumAttribute('timeOfMagicScrollbarColor'),
    clickSpark: forumAttribute('timeOfMagicClickSparkColor'),
  }).forEach(([key, color]) => {
    if (color) {
      document.documentElement.style.setProperty(CSS_VARIABLES[key], color);
    }
  });
}

function onScrollFrame(callback) {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress-bar';
  document.body.appendChild(bar);

  onScrollFrame(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = scrollHeight > 0 ? `${(scrollTop / scrollHeight) * 100}%` : '0%';
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

  onScrollFrame(() => {
    btn.classList.toggle('visible', window.scrollY > 300);
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

function isInteractiveClick(e) {
  return !!e.target.closest(
    'a, button, input, textarea, select, label, [role="button"], .Button, .item-copyLink, .Composer'
  );
}

function initClickSpark() {
  document.addEventListener('click', (e) => {
    if (isInteractiveClick(e)) return;

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
  const cfg = FALLING_EFFECTS[kind];
  const count = cfg.counts[effectDensity(kind)] || cfg.counts.medium;

  renderParticles(createParticleLayer(cfg.containerId), cfg, count);
}

function initCustomEffect(slot) {
  const cfg = getCustomConfig(slot);
  if (!cfg.items.length) return;

  renderParticles(
    createParticleLayer('timeofmagic-custom-' + slot),
    {
      className: slot === 'up' ? 'timeofmagic-custom-up' : 'timeofmagic-custom-down',
      items: cfg.items,
      fallDelay: [0, 10],
      fallDuration: slot === 'up' ? [9, 16] : [7, 13],
      swayDelay: [0, 5],
      swayDuration: [2, 5],
      opacity: [0.6, 1],
      fontScale: [0.8, 1.6],
      dualAnimation: true,
    },
    cfg.count
  );
}

app.initializers.add(PREFIX, () => {
  applyMagicColors();
  initUserSettings();
  initScrollbar();
  initSwapLayout();
  initBackground();

  if (forumAttribute('timeOfMagicProgressBar')) initProgressBar();
  if (forumAttribute('timeOfMagicBackToTop')) initBackToTop();
  if (forumAttribute('timeOfMagicClickSpark')) initClickSpark();

  if (effectsDisabled()) return;

  Object.keys(FALLING_EFFECTS).forEach((kind) => {
    if (isEffectActive(kind)) initFallingEffect(kind);
  });

  ['up', 'down'].forEach((slot) => {
    if (getCustomConfig(slot).enabled || !!activeSchedule('custom_' + slot)) {
      initCustomEffect(slot);
    }
  });
});
