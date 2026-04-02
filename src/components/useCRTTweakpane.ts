import { useEffect, useRef } from 'react';
import { crtParams, CRT_DEFAULTS, type CRTParams, type RGB } from './crtParams';

// ---- Query-string helpers ----

const COLOR_KEYS = new Set<string>([
  'darkBeamColor', 'darkDotColor', 'darkCharColor',
  'lightBeamColor', 'lightDotColor', 'lightCharColor',
]);

function paramsToQuery(p: CRTParams): string {
  const parts: string[] = [];
  for (const key of Object.keys(CRT_DEFAULTS) as (keyof CRTParams)[]) {
    const cur = p[key];
    const def = CRT_DEFAULTS[key];
    if (COLOR_KEYS.has(key)) {
      const c = cur as RGB;
      const d = def as RGB;
      if (c.r !== d.r || c.g !== d.g || c.b !== d.b) {
        parts.push(`${key}=${c.r},${c.g},${c.b}`);
      }
    } else if (cur !== def) {
      parts.push(`${key}=${cur}`);
    }
  }
  return parts.length ? `?${parts.join('&')}` : '';
}

/** Hydrate params from URL. Returns true if any CRT params were found. */
function hydrateFromQuery(p: CRTParams): boolean {
  const params = new URLSearchParams(window.location.search);
  const obj = p as unknown as Record<string, unknown>;
  let found = false;
  for (const [key, val] of params.entries()) {
    if (!(key in CRT_DEFAULTS)) continue;
    if (COLOR_KEYS.has(key)) {
      const nums = val.split(',').map(Number);
      if (nums.length === 3 && nums.every(n => !isNaN(n))) {
        obj[key] = { r: nums[0], g: nums[1], b: nums[2] };
        found = true;
      }
    } else {
      const n = Number(val);
      if (!isNaN(n)) {
        obj[key] = n;
        found = true;
      }
    }
  }
  return found;
}

// ---- URL sync (debounced) ----

let urlTimer: ReturnType<typeof setTimeout> | undefined;
function syncURL(p: CRTParams) {
  clearTimeout(urlTimer);
  urlTimer = setTimeout(() => {
    const qs = paramsToQuery(p);
    const url = window.location.pathname + qs + window.location.hash;
    window.history.replaceState(null, '', url);
  }, 300);
}

// ---- Hook ----

export function useCRTTweakpane() {
  const paneRef = useRef<{ dispose: () => void } | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const showPane = async (collapsed = false) => {
      // Dynamic import so tweakpane isn't in the main bundle
      const { Pane } = await import('tweakpane');
      const pane = new Pane({ title: 'CRT Parameters', expanded: true });
      const folderExpanded = !collapsed;

      // Style: position top-right, high z-index, make it interactive and resizable
      const container = pane.element.parentElement!;
      container.style.position = 'fixed';
      container.style.top = '12px';
      container.style.right = '12px';
      container.style.zIndex = '99999';
      container.style.pointerEvents = 'auto';
      container.style.maxHeight = '90vh';
      container.style.overflowY = 'auto';
      container.style.width = '380px';
      container.style.resize = 'horizontal';
      container.style.minWidth = '280px';
      container.style.maxWidth = '90vw';

      const onChange = () => syncURL(crtParams);

      // -- Grid --
      const grid = pane.addFolder({ expanded: folderExpanded, title: 'Grid' });
      grid.addBinding(crtParams, 'dotSpacing', { label: 'Dot spacing — grid cell size (px)', min: 4, max: 64, step: 1 }).on('change', onChange);
      grid.addBinding(crtParams, 'dotBaseRadius', { label: 'Dot radius — base size before variation', min: 0.1, max: 5, step: 0.1 }).on('change', onChange);

      // -- Speed --
      const speed = pane.addFolder({ expanded: folderExpanded, title: 'Beam Speed' });
      speed.addBinding(crtParams, 'speedVariation', { label: 'Organic noise — amplitude added to beam speed', min: 0, max: 2, step: 0.01 }).on('change', onChange);
      speed.addBinding(crtParams, 'speedSmoothing', { label: 'Smoothing — easing factor (higher = snappier)', min: 0.001, max: 0.5, step: 0.001 }).on('change', onChange);
      speed.addBinding(crtParams, 'mouseSpeedInfluence', { label: 'Mouse influence — cursor Y warps scan speed', min: 0, max: 3, step: 0.05 }).on('change', onChange);

      // -- Characters --
      const chars = pane.addFolder({ expanded: folderExpanded, title: 'Floating Characters' });
      chars.addBinding(crtParams, 'charDensity', { label: 'Spawn rate — probability per dot per frame', min: 0, max: 0.2, step: 0.001 }).on('change', onChange);
      chars.addBinding(crtParams, 'charLifetimeMin', { label: 'Min lifetime — shortest lifespan (frames)', min: 5, max: 200, step: 1 }).on('change', onChange);
      chars.addBinding(crtParams, 'charLifetimeMax', { label: 'Max lifetime — longest lifespan (frames)', min: 10, max: 300, step: 1 }).on('change', onChange);

      // -- Noise & Glitch --
      const noise = pane.addFolder({ expanded: folderExpanded, title: 'Noise & Glitch' });
      noise.addBinding(crtParams, 'noiseDensity', { label: 'Static noise — pixel count as fraction of area', min: 0, max: 0.02, step: 0.0001 }).on('change', onChange);
      noise.addBinding(crtParams, 'glitchChance', { label: 'Glitch chance — per-frame probability of h-shift', min: 0, max: 0.05, step: 0.0005 }).on('change', onChange);

      // -- Barrel distortion --
      const barrel = pane.addFolder({ expanded: folderExpanded, title: 'Barrel Distortion' });
      barrel.addBinding(crtParams, 'barrelStrength', { label: 'Strength — negative = convex CRT bulge, 0 = flat', min: -0.15, max: 0.15, step: 0.001 }).on('change', onChange);

      // -- Click ripple --
      const ripple = pane.addFolder({ expanded: folderExpanded, title: 'Click Ripple' });
      ripple.addBinding(crtParams, 'rippleSpeed', { label: 'Expansion speed — px per frame at 60fps', min: 0.5, max: 20, step: 0.5 }).on('change', onChange);
      ripple.addBinding(crtParams, 'rippleMaxRadius', { label: 'Max radius — ripple dies at this size (px)', min: 20, max: 800, step: 10 }).on('change', onChange);
      ripple.addBinding(crtParams, 'rippleRingWidth', { label: 'Ring width — influence band thickness (px)', min: 5, max: 200, step: 5 }).on('change', onChange);

      // -- Boot sequence --
      const boot = pane.addFolder({ expanded: folderExpanded, title: 'Boot Sequence' });
      boot.addBinding(crtParams, 'bootDuration', { label: 'Duration — frames for fade-in sequence', min: 10, max: 300, step: 5 }).on('change', onChange);

      // -- Screen breathe --
      const breathe = pane.addFolder({ expanded: folderExpanded, title: 'Screen Breathe' });
      breathe.addBinding(crtParams, 'breatheFrequency', { label: 'Frequency — Hz of slow brightness oscillation', min: 0, max: 0.2, step: 0.001 }).on('change', onChange);
      breathe.addBinding(crtParams, 'breatheAmplitude', { label: 'Amplitude — brightness variation per cycle', min: 0, max: 0.2, step: 0.005 }).on('change', onChange);

      // -- Exclusion zone --
      const excl = pane.addFolder({ expanded: folderExpanded, title: 'Exclusion Zone' });
      excl.addBinding(crtParams, 'excludeMargin', { label: 'Margin — extra padding around content (px)', min: 0, max: 100, step: 1 }).on('change', onChange);
      excl.addBinding(crtParams, 'excludeFade', { label: 'Fade — gradient distance at boundary (px)', min: 0, max: 200, step: 1 }).on('change', onChange);

      // -- Afterglow --
      const glow = pane.addFolder({ expanded: folderExpanded, title: 'Afterglow' });
      glow.addBinding(crtParams, 'afterglowWidth', { label: 'Trail width — phosphor glow behind beam (px)', min: 0, max: 400, step: 5 }).on('change', onChange);

      // -- Dark theme --
      const dark = pane.addFolder({ expanded: folderExpanded, title: 'Dark Theme' });
      dark.addBinding(crtParams, 'darkBaseAlpha', { label: 'Base alpha — overall dot opacity', min: 0, max: 1, step: 0.01 }).on('change', onChange);
      dark.addBinding(crtParams, 'darkBeamColor', { label: 'Beam color — scan beam tint', }).on('change', onChange);
      dark.addBinding(crtParams, 'darkDotColor', { label: 'Dot color — grid dot base color', }).on('change', onChange);
      dark.addBinding(crtParams, 'darkCharColor', { label: 'Char color — floating character tint', }).on('change', onChange);
      dark.addBinding(crtParams, 'darkGlowAlphaScale', { label: 'Glow intensity — beam glow on dots', min: 0, max: 2, step: 0.01 }).on('change', onChange);
      dark.addBinding(crtParams, 'darkCursorAlphaScale', { label: 'Cursor glow — proximity brightness boost', min: 0, max: 0.3, step: 0.005 }).on('change', onChange);
      dark.addBinding(crtParams, 'darkRippleAlphaScale', { label: 'Ripple glow — click ripple brightness', min: 0, max: 2, step: 0.01 }).on('change', onChange);

      // -- Light theme --
      const light = pane.addFolder({ expanded: folderExpanded, title: 'Light Theme' });
      light.addBinding(crtParams, 'lightBaseAlpha', { label: 'Base alpha — overall dot opacity', min: 0, max: 1, step: 0.01 }).on('change', onChange);
      light.addBinding(crtParams, 'lightBeamColor', { label: 'Beam color — scan beam tint', }).on('change', onChange);
      light.addBinding(crtParams, 'lightDotColor', { label: 'Dot color — grid dot base color', }).on('change', onChange);
      light.addBinding(crtParams, 'lightCharColor', { label: 'Char color — floating character tint', }).on('change', onChange);
      light.addBinding(crtParams, 'lightGlowAlphaScale', { label: 'Glow intensity — beam glow on dots', min: 0, max: 2, step: 0.01 }).on('change', onChange);
      light.addBinding(crtParams, 'lightCursorAlphaScale', { label: 'Cursor glow — proximity brightness boost', min: 0, max: 0.3, step: 0.005 }).on('change', onChange);
      light.addBinding(crtParams, 'lightRippleAlphaScale', { label: 'Ripple glow — click ripple brightness', min: 0, max: 2, step: 0.01 }).on('change', onChange);

      // Reset button
      pane.addButton({ title: 'Reset to defaults' }).on('click', () => {
        const obj = crtParams as unknown as Record<string, unknown>;
        for (const key of Object.keys(CRT_DEFAULTS) as (keyof CRTParams)[]) {
          const def = CRT_DEFAULTS[key];
          if (typeof def === 'object' && def !== null) {
            obj[key] = { ...def };
          } else {
            obj[key] = def;
          }
        }
        pane.refresh();
        syncURL(crtParams);
      });

      paneRef.current = pane;
      visibleRef.current = true;
    };

    const hidePane = () => {
      if (paneRef.current) {
        paneRef.current.dispose();
        paneRef.current = null;
        visibleRef.current = false;
      }
    };

    const toggle = () => {
      if (visibleRef.current) {
        hidePane();
      } else {
        showPane();
      }
    };

    // Hydrate params from URL and auto-show pane (collapsed) if tweaks were found
    const hasTweaks = hydrateFromQuery(crtParams);
    if (hasTweaks) {
      showPane(true);
    }

    const handleKeydown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K to toggle CRT tweakpane
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      hidePane();
    };
  }, []);
}
