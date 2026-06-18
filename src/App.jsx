import React, { useEffect, useMemo, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { marked } from 'marked';
import { buildTheme, onColorFor } from './theme.js';
import Showcase from './Showcase.jsx';
import PhoneFrame from './PhoneFrame.jsx';
import docMarkdown from '../docs/color-conversion.md?raw';
import { paperSettings } from './paperIcon.jsx';

/* The control panel uses plain DOM elements (rendered by react-dom) so we can
   use the native color picker. The preview uses react-native-paper components. */

// Convert any theme color value to an rgb()/rgba() string for display.
function toRgbString(value) {
  if (!value || value === 'transparent') return value || '—';
  if (value.startsWith('#')) {
    let h = value.slice(1);
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const int = parseInt(h.slice(0, 6), 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;
    if (h.length === 8) {
      const a = (parseInt(h.slice(6, 8), 16) / 255).toFixed(2);
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }
  return value; // already rgb()/rgba()
}

// Flatten theme.colors (including the nested elevation object) into rows.
function colorRows(colors) {
  const rows = [];
  Object.entries(colors).forEach(([key, val]) => {
    if (key === 'elevation' && val && typeof val === 'object') {
      Object.entries(val).forEach(([lvl, v]) => rows.push([`elevation.${lvl}`, v]));
    } else if (typeof val === 'string') {
      rows.push([key, val]);
    }
  });
  return rows;
}

// Resolve a token name (supports "elevation.level1") against theme.colors.
function resolveToken(colors, name) {
  if (name.includes('.')) {
    const [a, b] = name.split('.');
    return colors[a]?.[b];
  }
  return colors[name];
}

// Curated mapping: which theme color variables each component relies on.
const COMPONENT_TOKENS = [
  { component: 'Text / Typography', tokens: ['onSurface', 'onSurfaceVariant'] },
  { component: 'Button (contained)', tokens: ['primary', 'onPrimary'] },
  { component: 'Button (tonal)', tokens: ['secondaryContainer', 'onSecondaryContainer'] },
  { component: 'Button (elevated)', tokens: ['surface', 'primary', 'elevation.level1'] },
  { component: 'Button (outlined)', tokens: ['primary', 'outline'] },
  { component: 'Button (text)', tokens: ['primary'] },
  { component: 'FAB', tokens: ['primaryContainer', 'onPrimaryContainer'] },
  { component: 'Icon button (contained)', tokens: ['primary', 'onPrimary'] },
  { component: 'Chip (assist)', tokens: ['surfaceVariant', 'onSurfaceVariant', 'outline'] },
  { component: 'Chip (selected/filter)', tokens: ['secondaryContainer', 'onSecondaryContainer'] },
  { component: 'Text input', tokens: ['primary', 'onSurface', 'onSurfaceVariant', 'outline', 'surfaceVariant', 'error'] },
  { component: 'Checkbox / Radio / Switch', tokens: ['primary', 'onPrimary', 'outline'] },
  { component: 'Segmented buttons', tokens: ['secondaryContainer', 'onSecondaryContainer', 'outline', 'onSurface'] },
  { component: 'Card', tokens: ['surface', 'onSurface', 'outline', 'elevation.level1'] },
  { component: 'Surface (elevation)', tokens: ['elevation.level1', 'elevation.level2', 'elevation.level3', 'elevation.level4', 'elevation.level5'] },
  { component: 'List item', tokens: ['onSurface', 'onSurfaceVariant'] },
  { component: 'Data table', tokens: ['onSurface', 'onSurfaceVariant', 'outlineVariant'] },
  { component: 'Avatar', tokens: ['primary', 'onPrimary', 'tertiary', 'onTertiary'] },
  { component: 'Badge', tokens: ['error', 'onError'] },
  { component: 'Appbar', tokens: ['surface', 'onSurface', 'elevation.level2'] },
  { component: 'Bottom navigation', tokens: ['secondaryContainer', 'onSecondaryContainer', 'onSurfaceVariant', 'surface'] },
  { component: 'Menu', tokens: ['surface', 'onSurface', 'elevation.level2'] },
  { component: 'Drawer item (active)', tokens: ['secondaryContainer', 'onSecondaryContainer', 'onSurfaceVariant'] },
  { component: 'Dialog / Modal', tokens: ['surface', 'onSurface', 'primary'] },
  { component: 'Snackbar', tokens: ['inverseSurface', 'inverseOnSurface', 'inversePrimary'] },
  { component: 'Banner', tokens: ['surface', 'onSurface', 'primary'] },
  { component: 'Tooltip', tokens: ['inverseSurface', 'inverseOnSurface'] },
  { component: 'Progress / Activity indicator', tokens: ['primary'] },
];

// Trigger a client-side file download.
function downloadFile(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ColorField({ label, value, onChange }) {
  const on = onColorFor(value);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 44, height: 44, border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            fontFamily: 'monospace',
            fontSize: 13,
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid #ccc',
            textTransform: 'uppercase',
          }}
        />
        <span
          title={`On color: ${on}`}
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: value,
            color: on,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            border: '1px solid rgba(0,0,0,0.15)',
          }}
        >
          A
        </span>
      </div>
      <div style={{ fontSize: 11, color: '#777', marginTop: 4 }}>
        On {label}: <code>{on}</code> (auto contrast)
      </div>
    </div>
  );
}

const builtInPresets = [
  { name: 'New TecDoc', primary: '#00529D', secondary: '#2C3647', tertiary: '#E87B00' },
  { name: 'Material', primary: '#6750A4', secondary: '#3A7BD5', tertiary: '#00897B' },
];

const defaultPreset = builtInPresets[0];

const STORAGE_KEY = 'whitelabel.customPresets';

function loadCustomPresets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [brand, setBrand] = useState({
    primary: defaultPreset.primary,
    secondary: defaultPreset.secondary,
    tertiary: defaultPreset.tertiary,
  });
  const [mode, setMode] = useState('light');
  const [customPresets, setCustomPresets] = useState(loadCustomPresets);
  const [docsOpen, setDocsOpen] = useState(false);
  const [mappingOpen, setMappingOpen] = useState(false);
  const [tokenMapOpen, setTokenMapOpen] = useState(false);

  const docHtml = useMemo(() => marked.parse(docMarkdown), []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [customPresets]);

  const applyPreset = (p) =>
    setBrand({ primary: p.primary, secondary: p.secondary, tertiary: p.tertiary });

  const saveCurrentAsPreset = () => {
    const suggested = `Custom ${customPresets.length + 1}`;
    const name = window.prompt('Name this preset:', suggested);
    if (name === null) return; // cancelled
    const trimmed = name.trim() || suggested;
    setCustomPresets((prev) => {
      const next = prev.filter((p) => p.name.toLowerCase() !== trimmed.toLowerCase());
      return [...next, { name: trimmed, ...brand }];
    });
  };

  const deletePreset = (name) =>
    setCustomPresets((prev) => prev.filter((p) => p.name !== name));

  const theme = useMemo(() => buildTheme(brand, mode), [brand, mode]);

  // Which preset matches the current colors? Otherwise it's a custom setting.
  const activePresetName = useMemo(() => {
    const eq = (a, b) => (a || '').toLowerCase() === (b || '').toLowerCase();
    const found = [...builtInPresets, ...customPresets].find(
      (p) =>
        eq(p.primary, brand.primary) &&
        eq(p.secondary, brand.secondary) &&
        eq(p.tertiary, brand.tertiary)
    );
    return found ? found.name : 'Custom';
  }, [brand, customPresets]);

  const exportBaseName = `theme-mapping-${activePresetName.replace(/\s+/g, '-').toLowerCase()}-${mode}`;

  const handleDownloadJson = () => {
    const rows = colorRows(theme.colors);
    const data = {
      preset: activePresetName,
      mode,
      brand,
      colors: Object.fromEntries(
        rows.map(([name, value]) => [
          name,
          { value, hex: value.startsWith('#') ? value.toUpperCase() : null, rgb: toRgbString(value) },
        ])
      ),
    };
    downloadFile(`${exportBaseName}.json`, JSON.stringify(data, null, 2), 'application/json');
  };

  const handleDownloadCsv = () => {
    const rows = colorRows(theme.colors);
    const header = 'Variable,Hex,RGB';
    const body = rows
      .map(([name, value]) => {
        const hex = value.startsWith('#') ? value.toUpperCase() : '';
        return `${name},${hex},"${toRgbString(value)}"`;
      })
      .join('\n');
    downloadFile(`${exportBaseName}.csv`, `${header}\n${body}`, 'text/csv');
  };
  const set = (key) => (value) => setBrand((b) => ({ ...b, [key]: value }));

  const swatchEntries = [
    ['primary', theme.colors.primary],
    ['onPrimary', theme.colors.onPrimary],
    ['secondary', theme.colors.secondary],
    ['onSecondary', theme.colors.onSecondary],
    ['tertiary', theme.colors.tertiary],
    ['onTertiary', theme.colors.onTertiary],
    ['background', theme.colors.background],
    ['surface', theme.colors.surface],
    ['surfaceVariant', theme.colors.surfaceVariant],
    ['outline', theme.colors.outline],
    ['onSurface', theme.colors.onSurface],
    ['error', theme.colors.error],
  ];

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      {/* ---- Control panel ---- */}
      <aside
        style={{
          width: 340,
          minWidth: 340,
          height: '100%',
          overflowY: 'auto',
          borderRight: '1px solid #e0e0e0',
          padding: 24,
          boxSizing: 'border-box',
          background: '#fafafa',
        }}
      >
        <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Brand colors</h2>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#666', lineHeight: 1.4 }}>
          Set the 3 brand colors a customer would configure. Everything else stays neutral
          gray/black. On-colors are computed automatically per mode.
        </p>

        <button
          onClick={() => setDocsOpen(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '10px 0',
            marginBottom: 20,
            borderRadius: 8,
            border: '1px solid #d0d0d0',
            background: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: '#1f2430',
          }}
        >
          📖 Theming docs
        </button>

        <ColorField label="Primary" value={brand.primary} onChange={set('primary')} />
        <ColorField label="Secondary" value={brand.secondary} onChange={set('secondary')} />
        <ColorField label="Tertiary" value={brand.tertiary} onChange={set('tertiary')} />

        <div style={{ margin: '20px 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <label style={{ fontSize: 13, fontWeight: 600 }}>Presets</label>
            <button
              onClick={saveCurrentAsPreset}
              title="Save the current colors as a new preset"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 6,
                border: '1px solid #ccc',
                background: '#fff',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              + Save current
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[...builtInPresets, ...customPresets].map((p, idx) => {
              const isCustom = idx >= builtInPresets.length;
              return (
                <span
                  key={`${p.name}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: '1px solid #ccc',
                    background: '#fff',
                    fontSize: 12,
                  }}
                >
                  <button
                    onClick={() => applyPreset(p)}
                    title={`Apply ${p.name}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      border: 'none',
                      background: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    <span style={{ display: 'flex' }}>
                      {[p.primary, p.secondary, p.tertiary].map((c, i) => (
                        <span
                          key={i}
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: c,
                            marginLeft: i ? -4 : 0,
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        />
                      ))}
                    </span>
                    {p.name}
                  </button>
                  {isCustom && (
                    <button
                      onClick={() => deletePreset(p.name)}
                      title={`Delete ${p.name}`}
                      aria-label={`Delete ${p.name}`}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#999',
                        fontSize: 15,
                        lineHeight: 1,
                        padding: 0,
                        marginLeft: -2,
                      }}
                    >
                      ×
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ margin: '20px 0' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Mode
          </label>
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #ccc' }}>
            {['light', 'dark'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontSize: 13,
                  background: mode === m ? brand.primary : '#fff',
                  color: mode === m ? onColorFor(brand.primary) : '#333',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Resolved theme tokens
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {swatchEntries.map(([name, color]) => (
              <div
                key={name}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 6,
                  overflow: 'hidden',
                  fontSize: 10,
                }}
              >
                <div style={{ height: 28, background: color, borderBottom: '1px solid #e0e0e0' }} />
                <div style={{ padding: '4px 6px' }}>
                  <div style={{ fontWeight: 600 }}>{name}</div>
                  <code style={{ color: '#777' }}>{String(color)}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ---- Live preview (inline phone) ---- */}
      <main
        style={{
          flex: 1,
          height: '100%',
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background:
            mode === 'dark'
              ? 'radial-gradient(circle at 50% 30%, #2a2a2a, #141414)'
              : 'radial-gradient(circle at 50% 30%, #f0f0f3, #d9d9de)',
          padding: 24,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            onClick={() => setTokenMapOpen(true)}
            title="Show which color variables each component uses"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              background: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.85)',
              color: mode === 'dark' ? '#f2f2f2' : '#222',
              boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          >
            Component ⟷ Color Token
          </div>

          <div
            onClick={() => setMappingOpen(true)}
            title="View full color mapping"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              background: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.85)',
              color: mode === 'dark' ? '#f2f2f2' : '#222',
              boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          >
            <span style={{ display: 'flex' }}>
              {[brand.primary, brand.secondary, brand.tertiary].map((c, i) => (
                <span
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: c,
                    marginLeft: i ? -4 : 0,
                    border: '1px solid rgba(0,0,0,0.15)',
                  }}
                />
              ))}
            </span>
            {activePresetName}
          </div>
        </div>

        <PhoneFrame mode={mode}>
          <PaperProvider theme={theme} settings={paperSettings}>
            <Showcase />
          </PaperProvider>
        </PhoneFrame>
      </main>

      {/* ---- Theming documentation panel ---- */}
      {docsOpen && (
        <div
          onClick={() => setDocsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(760px, 92vw)',
              height: '100%',
              background: '#fff',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid #e5e7eb',
                flexShrink: 0,
              }}
            >
              <strong style={{ fontSize: 15 }}>Theming documentation</strong>
              <button
                onClick={() => setDocsOpen(false)}
                aria-label="Close documentation"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: '1px solid #d0d0d0',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <div
              className="doc-content"
              style={{ padding: '20px 28px', overflowY: 'auto' }}
              dangerouslySetInnerHTML={{ __html: docHtml }}
            />
          </div>
        </div>
      )}

      {/* ---- Color mapping modal ---- */}
      {mappingOpen && (
        <div
          onClick={() => setMappingOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 24,
            boxSizing: 'border-box',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(640px, 96vw)',
              maxHeight: '88vh',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid #e5e7eb',
                flexShrink: 0,
              }}
            >
              <div>
                <strong style={{ fontSize: 15 }}>Color mapping</strong>
                <span style={{ fontSize: 12, color: '#777', marginLeft: 8 }}>
                  {activePresetName} · {mode}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={handleDownloadJson}
                  title="Download mapping as JSON"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    height: 32,
                    padding: '0 12px',
                    borderRadius: 6,
                    border: '1px solid #d0d0d0',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  ⬇ JSON
                </button>
                <button
                  onClick={handleDownloadCsv}
                  title="Download mapping as CSV"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    height: 32,
                    padding: '0 12px',
                    borderRadius: 6,
                    border: '1px solid #d0d0d0',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  ⬇ CSV
                </button>
                <button
                  onClick={() => setMappingOpen(false)}
                  aria-label="Close color mapping"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    border: '1px solid #d0d0d0',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <div style={{ overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ position: 'sticky', top: 0, background: '#f7f8fa' }}>
                    <th style={{ textAlign: 'left', padding: '8px 16px', borderBottom: '1px solid #e5e7eb', width: 40 }}></th>
                    <th style={{ textAlign: 'left', padding: '8px 16px', borderBottom: '1px solid #e5e7eb' }}>Variable</th>
                    <th style={{ textAlign: 'left', padding: '8px 16px', borderBottom: '1px solid #e5e7eb' }}>Hex</th>
                    <th style={{ textAlign: 'left', padding: '8px 16px', borderBottom: '1px solid #e5e7eb' }}>RGB</th>
                  </tr>
                </thead>
                <tbody>
                  {colorRows(theme.colors).map(([name, value]) => (
                    <tr key={name}>
                      <td style={{ padding: '6px 16px', borderBottom: '1px solid #f0f0f0' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            background: value,
                            border: '1px solid rgba(0,0,0,0.15)',
                          }}
                        />
                      </td>
                      <td style={{ padding: '6px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 500 }}>
                        {name}
                      </td>
                      <td style={{ padding: '6px 16px', borderBottom: '1px solid #f0f0f0', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                        {typeof value === 'string' && value.startsWith('#') ? value : '—'}
                      </td>
                      <td style={{ padding: '6px 16px', borderBottom: '1px solid #f0f0f0', fontFamily: 'monospace', color: '#555' }}>
                        {toRgbString(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---- Component ⟷ Color Token modal ---- */}
      {tokenMapOpen && (
        <div
          onClick={() => setTokenMapOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 24,
            boxSizing: 'border-box',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(720px, 96vw)',
              maxHeight: '88vh',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid #e5e7eb',
                flexShrink: 0,
              }}
            >
              <div>
                <strong style={{ fontSize: 15 }}>Component ⟷ Color Token</strong>
                <span style={{ fontSize: 12, color: '#777', marginLeft: 8 }}>
                  {activePresetName} · {mode}
                </span>
              </div>
              <button
                onClick={() => setTokenMapOpen(false)}
                aria-label="Close"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: '1px solid #d0d0d0',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ position: 'sticky', top: 0, background: '#f7f8fa' }}>
                    <th style={{ textAlign: 'left', padding: '8px 16px', borderBottom: '1px solid #e5e7eb', width: '34%' }}>
                      Component
                    </th>
                    <th style={{ textAlign: 'left', padding: '8px 16px', borderBottom: '1px solid #e5e7eb' }}>
                      Color variables
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPONENT_TOKENS.map(({ component, tokens }) => (
                    <tr key={component}>
                      <td style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 600, verticalAlign: 'top' }}>
                        {component}
                      </td>
                      <td style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {tokens.map((name) => {
                            const val = resolveToken(theme.colors, name);
                            return (
                              <span
                                key={name}
                                title={typeof val === 'string' ? val.toUpperCase() : ''}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  padding: '3px 8px 3px 4px',
                                  borderRadius: 999,
                                  border: '1px solid #e0e0e0',
                                  background: '#fafafa',
                                  fontFamily: 'monospace',
                                  fontSize: 11.5,
                                }}
                              >
                                <span
                                  style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: '50%',
                                    background: val,
                                    border: '1px solid rgba(0,0,0,0.18)',
                                  }}
                                />
                                {name}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
