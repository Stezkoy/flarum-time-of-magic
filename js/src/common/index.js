export const PREFIX = 'stezkoy-time-of-magic';

export function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function parseJsonArray(raw) {
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

export function parseCustomConfig(raw) {
  let conf = {};

  if (typeof raw === 'string' && raw) {
    try {
      conf = JSON.parse(raw);
    } catch (e) {
      conf = {};
    }
  } else if (raw && typeof raw === 'object') {
    conf = raw;
  }

  const items = String(conf.items || '');
  let count = parseInt(conf.count, 10);
  if (Number.isNaN(count) || count < 1) count = 20;
  count = Math.min(100, Math.max(1, count));

  return { enabled: !!conf.enabled, items, count };
}

export function normalizeEffects(schedule) {
  return (schedule.effects || []).map((effect) =>
    typeof effect === 'string' ? { name: effect, density: null } : effect
  );
}

export function isScheduleActive(schedule, now = Date.now()) {
  if (!schedule || !schedule.enabled) return false;

  const start = new Date(schedule.start).getTime();
  const end = new Date(schedule.end).getTime();

  return !Number.isNaN(start) && !Number.isNaN(end) && now >= start && now <= end;
}
