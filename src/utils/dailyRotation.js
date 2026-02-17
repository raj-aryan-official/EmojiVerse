function getLocalDateKey() {
  const d = new Date();
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Small deterministic hash (FNV-1a-ish)
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministically picks a "daily rotating" subset.
 * - Changes once per local-day (24h-ish)
 * - Stable within the day (no flicker on refresh)
 */
export function pickDaily(items, count, { key = 'default', getId = (x) => x?.id } = {}) {
  const dateKey = getLocalDateKey();
  const seed = hashString(`${key}:${dateKey}`);
  const rand = mulberry32(seed);

  // Copy + deterministic shuffle (Fisher–Yates)
  const arr = [...items].filter(Boolean);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Ensure stable uniqueness by id
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const id = getId(it);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(it);
    if (out.length >= count) break;
  }
  return out;
}


