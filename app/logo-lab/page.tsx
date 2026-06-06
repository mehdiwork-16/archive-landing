/* Logo concept lab — preview only. Visit /logo-lab to compare options. */

function Card({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#141414] border border-white/[0.08] p-8 flex flex-col items-center gap-6">
      <div className="h-40 flex items-center justify-center">{children}</div>
      <div className="text-center">
        <p className="text-white text-[12px] tracking-[0.25em] uppercase">{title}</p>
        <p className="text-white/35 text-[11px] mt-1.5">{note}</p>
      </div>
    </div>
  )
}

// ── Concept A: cosmic sparkle + orbit + mini star ───────────────
function MarkA({ s = 120 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 200 200">
      <ellipse cx="100" cy="100" rx="90" ry="29" fill="none" stroke="#fff" strokeWidth="4.5"
               strokeLinecap="round" transform="rotate(-22 100 100)" opacity="0.9" />
      <path d="M100,16 Q113,87 184,100 Q113,113 100,184 Q87,113 16,100 Q87,87 100,16 Z" fill="#fff" />
      <path d="M50,142 Q52.4,155 65,157 Q52.4,159 50,172 Q47.6,159 35,157 Q47.6,155 50,142 Z" fill="#fff" />
    </svg>
  )
}

// ── Concept B: clean minimal sparkle ────────────────────────────
function MarkB({ s = 120 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 200 200">
      <path d="M100,12 Q112,88 188,100 Q112,112 100,188 Q88,112 12,100 Q88,88 100,12 Z" fill="#fff" />
    </svg>
  )
}

// ── Concept C: star + crescent (Algeria flag reference) ─────────
function MarkC({ s = 120 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 200 200">
      {/* Crescent */}
      <path d="M150 100 a55 55 0 1 1 -16 -38 a42 42 0 1 0 16 76 a55 55 0 0 1 0 0 Z" fill="#fff" />
      {/* 4-point sparkle nestled in the crescent opening */}
      <path d="M150,60 Q157,95 192,100 Q157,105 150,140 Q143,105 108,100 Q143,95 150,60 Z" fill="#fff" />
    </svg>
  )
}

// ── Concept D: orbit only, no mini star (clean cosmic) ──────────
function MarkD({ s = 120 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 200 200">
      <ellipse cx="100" cy="100" rx="92" ry="26" fill="none" stroke="#fff" strokeWidth="4"
               strokeLinecap="round" transform="rotate(-18 100 100)" />
      <path d="M100,20 Q111,89 180,100 Q111,111 100,180 Q89,111 20,100 Q89,89 100,20 Z" fill="#fff" />
    </svg>
  )
}

export default function LogoLab() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display italic text-3xl mb-2">Icosium — Logo Concepts</h1>
        <p className="text-white/40 text-sm mb-12">
          Star &amp; cosmic marks. Send your Algeria reference and I&rsquo;ll fuse it in.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Card title="Concept A" note="Sparkle + orbit + mini star (your reference)"><MarkA /></Card>
          <Card title="Concept B" note="Minimal sparkle — cleanest, best for small sizes"><MarkB /></Card>
          <Card title="Concept C" note="Star + crescent — Algeria flag reference"><MarkC /></Card>
          <Card title="Concept D" note="Sparkle + single orbit — refined cosmic"><MarkD /></Card>
        </div>

        {/* Lockups: mark + wordmark */}
        <h2 className="text-[12px] tracking-[0.3em] uppercase text-white/40 mt-16 mb-6">Lockups (mark + name)</h2>
        <div className="space-y-4">
          {[MarkB, MarkD, MarkA].map((Mark, i) => (
            <div key={i} className="bg-[#141414] border border-white/[0.08] px-8 py-7 flex items-center gap-5">
              <Mark s={56} />
              <span className="font-display italic text-white" style={{ fontSize: '2rem', letterSpacing: '0.04em' }}>
                Icosium
              </span>
            </div>
          ))}
        </div>

        {/* Bold wordmark alternative */}
        <h2 className="text-[12px] tracking-[0.3em] uppercase text-white/40 mt-16 mb-6">Bold wordmark (streetwear-ready)</h2>
        <div className="bg-[#141414] border border-white/[0.08] px-8 py-10 flex justify-center">
          <span className="font-poster text-white" style={{ fontSize: '4rem', letterSpacing: '0.06em' }}>
            ICOSIUM
          </span>
        </div>
      </div>
    </div>
  )
}
