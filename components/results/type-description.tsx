import React from "react"
import { typeProfiles } from "@/lib/scoring"
import { Target, Lightbulb, TrendingUp, Shield, Handshake, Sprout, Scale } from "lucide-react"

interface TypeDescriptionProps {
  type: string
}

// Icon-Mapping für jeden Unternehmenstyp
const typeIcons: { [key: string]: React.ElementType } = {
  "Der Visionär": Lightbulb,
  "Der Growth-Leader": TrendingUp,
  "Der Strategische Umsetzer": Shield,
  "Der Sales-Entrepreneur": Handshake,
  "Der Entwickler": Sprout,
  "Der Ausgewogene Unternehmer": Scale,
}

/** Unterabschnitt im Landing-Stil: gelbes / LABEL / + Text */
function Block({ label, text, muted = false }: { label: string; text: string; muted?: boolean }) {
  return (
    <div className="p-6 md:p-7 bg-[#0d0d0d] border border-white/10">
      <p
        className={`text-[13px] font-semibold uppercase tracking-[0.08em] mb-3 ${
          muted ? "text-white/60" : "text-[#fae608]"
        }`}
      >
        / {label} /
      </p>
      <p className="text-[15px] text-white/80 leading-relaxed">{text}</p>
    </div>
  )
}

export function TypeDescription({ type }: TypeDescriptionProps) {
  const profile = typeProfiles[type]
  const TypeIcon = typeIcons[type] || Target

  if (!profile) {
    return null
  }

  return (
    <div>
      {/* Kopf im Landing-Stil */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#fae608] flex items-center justify-center shrink-0">
          <TypeIcon className="w-8 h-8 md:w-10 md:h-10 text-[#0a0a0a]" strokeWidth={1.6} />
        </div>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#fae608]">/ Ihr Profil /</p>
          <h3 className="text-2xl md:text-3xl font-medium tracking-[-0.02em] text-white mt-1">{type}</h3>
        </div>
      </div>
      <div className="h-[2px] w-full bg-[#fae608]/70 mb-[2px]" />

      <div className="grid md:grid-cols-2 gap-[2px]">
        <Block label="Charakter" text={profile.charakter} />
        <Block label="Stärken" text={profile.staerken} />
        <Block label="Typische Risiken" text={profile.risiken} muted />
        <Block label="Entwicklungsschwerpunkt" text={profile.entwicklung} />
      </div>
    </div>
  )
}
