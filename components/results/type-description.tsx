import React from "react"
import { Card } from "@/components/ui/card"
import { typeProfiles } from "@/lib/scoring"
import { CheckCircle, AlertCircle, Target, Lightbulb, TrendingUp, Shield, Handshake, Sprout, Scale } from "lucide-react"

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

export function TypeDescription({ type }: TypeDescriptionProps) {
  const profile = typeProfiles[type]
  const TypeIcon = typeIcons[type] || Target

  if (!profile) {
    return null
  }

  return (
    <Card className="p-6 md:p-10 bg-gradient-to-br from-primary/10 to-card/50 backdrop-blur-sm border-primary/30 shadow-xl">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/20 flex items-center justify-center">
          <TypeIcon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-primary">{type}</h3>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* Charakter */}
        <div>
          <h4 className="text-lg md:text-xl font-semibold mb-3 text-foreground">Charakter</h4>
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">{profile.charakter}</p>
        </div>

        {/* Stärken */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            <h4 className="text-lg md:text-xl font-semibold text-foreground">Stärken</h4>
          </div>
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">{profile.staerken}</p>
        </div>

        {/* Typische Risiken */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
            <h4 className="text-lg md:text-xl font-semibold text-foreground">Typische Risiken</h4>
          </div>
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">{profile.risiken}</p>
        </div>

        {/* Entwicklungsschwerpunkt */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            <h4 className="text-lg md:text-xl font-semibold text-foreground">Entwicklungsschwerpunkt</h4>
          </div>
          <p className="text-sm md:text-base text-foreground/90 leading-relaxed">{profile.entwicklung}</p>
        </div>
      </div>
    </Card>
  )
}
