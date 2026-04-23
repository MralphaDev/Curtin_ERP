'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [hover, setHover] = useState(null);

  const locale = useMemo(() => {
    const seg = pathname.split('/')[1];
    return seg === 'zh' ? 'zh' : 'en';
  }, [pathname]);

  const switchLocale = (target) => {
    const segments = pathname.split('/');

    if (segments[1] === 'en' || segments[1] === 'zh') {
      segments[1] = target;
    } else {
      segments.splice(1, 0, target);
    }

    router.push(segments.join('/'));
  };

  return (
    <div className="z-50">
      <div className="track">
        <div className={`indicator ${locale}`} />

        <button
          onClick={() => switchLocale('en')}
          onMouseEnter={() => setHover('en')}
          onMouseLeave={() => setHover(null)}
          className={`btn ${locale === 'en' ? 'active' : ''} ${hover === 'en' ? 'hover' : ''}`}
        >
          EN
        </button>

        <button
          onClick={() => switchLocale('zh')}
          onMouseEnter={() => setHover('zh')}
          onMouseLeave={() => setHover(null)}
          className={`btn ${locale === 'zh' ? 'active' : ''} ${hover === 'zh' ? 'hover' : ''}`}
        >
          中文
        </button>
      </div>

      <style jsx>{`
        .track {
          position: relative;
          display: flex;
          padding: 4px;

          border-radius: 999px;

          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(20px);

          border: 1px solid rgba(148, 163, 184, 0.25);

          box-shadow:
            0 8px 24px rgba(15, 23, 42, 0.06);
        }

        /* ===== BUTTON (modern thin typography) ===== */
        .btn {
          position: relative;
          z-index: 2;

          border: none;
          background: transparent;

          padding: 6px 14px;

          font-size: 12.5px;
          font-weight: 400; /* 👈 key change: thinner */
          letter-spacing: 0.02em;

          color: rgba(15, 23, 42, 0.55); /* softer gray-blue */

          cursor: pointer;

          transition:
            transform 0.22s ease,
            color 0.25s ease,
            opacity 0.25s ease;
        }

        /* hover = subtle lift only (no glow explosion) */
        .btn.hover {
          transform: translateY(-1px);
          color: rgba(15, 23, 42, 0.85);
        }

        /* active = slightly darker, not bold */
        .btn.active {
          color: rgba(15, 23, 42, 0.9);
          font-weight: 500;
        }

        /* ===== INDICATOR (soft + minimal) ===== */
        .indicator {
          position: absolute;
          top: 4px;
          bottom: 4px;
          width: calc(50% - 4px);

          border-radius: 999px;

          background: rgba(226, 232, 240, 0.6);

          transition:
            transform 0.35s cubic-bezier(.2,.9,.2,1);
        }

        .indicator.en {
          transform: translateX(0%);
          left: 4px;
        }

        .indicator.zh {
          transform: translateX(100%);
          left: 4px;
        }
      `}</style>
    </div>
  );
}