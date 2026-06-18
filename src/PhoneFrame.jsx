import React from 'react';

/**
 * A pure-DOM smartphone mockup (bezel, dynamic island, status bar, home bar).
 * It does NOT know about the Paper theme; the children render their own
 * surfaces/colors. `mode` only drives the status-bar / home-bar tint so the
 * OS chrome stays readable on top of the app surface.
 */
function StatusIcons({ tint }) {
  const bar = (h) => (
    <span
      style={{
        width: 3,
        height: h,
        background: tint,
        borderRadius: 1,
        display: 'inline-block',
      }}
    />
  );
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
      {/* signal */}
      <span style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, marginRight: 4 }}>
        {bar(4)}
        {bar(6)}
        {bar(8)}
        {bar(10)}
      </span>
      {/* wifi */}
      <span
        style={{
          width: 15,
          height: 11,
          marginRight: 4,
          maskImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 18'><path d='M12 18l11-13a17 17 0 00-22 0z'/></svg>\")",
          WebkitMaskImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 18'><path d='M12 18l11-13a17 17 0 00-22 0z'/></svg>\")",
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          background: tint,
        }}
      />
      {/* battery */}
      <span style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <span
          style={{
            width: 22,
            height: 11,
            border: `1px solid ${tint}`,
            borderRadius: 3,
            padding: 1.5,
            boxSizing: 'border-box',
            opacity: 0.9,
          }}
        >
          <span style={{ display: 'block', width: '80%', height: '100%', background: tint, borderRadius: 1 }} />
        </span>
        <span style={{ width: 1.5, height: 4, background: tint, borderRadius: 1, opacity: 0.6 }} />
      </span>
    </div>
  );
}

export default function PhoneFrame({ children, mode = 'light', width = 390, height = 820 }) {
  const chrome = mode === 'dark' ? '#FFFFFF' : '#111111';
  const screenH = height - 24; // minus bezel padding (12px top + 12px bottom)

  return (
    <div
      style={{
        width,
        height,
        background: '#0a0a0a',
        borderRadius: 56,
        padding: 12,
        boxSizing: 'border-box',
        boxShadow:
          '0 0 0 2px #2a2a2a, 0 30px 60px rgba(0,0,0,0.45), inset 0 0 2px rgba(255,255,255,0.25)',
        position: 'relative',
      }}
    >
      {/* side buttons */}
      <span style={{ position: 'absolute', left: -3, top: 130, width: 3, height: 32, background: '#1c1c1c', borderRadius: 2 }} />
      <span style={{ position: 'absolute', left: -3, top: 180, width: 3, height: 56, background: '#1c1c1c', borderRadius: 2 }} />
      <span style={{ position: 'absolute', left: -3, top: 250, width: 3, height: 56, background: '#1c1c1c', borderRadius: 2 }} />
      <span style={{ position: 'absolute', right: -3, top: 200, width: 3, height: 80, background: '#1c1c1c', borderRadius: 2 }} />

      {/* screen */}
      <div
        style={{
          width: '100%',
          height: screenH,
          borderRadius: 44,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          background: '#000',
        }}
      >
        {/* status bar */}
        <div
          style={{
            height: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: chrome, fontVariantNumeric: 'tabular-nums' }}>
            9:41
          </span>
          <StatusIcons tint={chrome} />
        </div>

        {/* dynamic island */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 118,
            height: 34,
            background: '#000',
            borderRadius: 20,
            zIndex: 30,
          }}
        />

        {/* app content (with room under the status bar) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 44, minHeight: 0 }}>
          {children}
        </div>

        {/* home indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 134,
            height: 5,
            borderRadius: 3,
            background: chrome,
            opacity: 0.5,
            zIndex: 20,
          }}
        />
      </div>
    </div>
  );
}
