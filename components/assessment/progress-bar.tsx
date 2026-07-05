interface ProgressBarProps {
  current: number
  total: number
}

/** Fortschritt im Landing-Stil: Meta-Zeile (uppercase, Sperrschrift) + dünner gelber Balken */
export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 text-[13px] font-medium uppercase tracking-[0.04em]">
        <span className="text-white/85">
          Frage {current} von {total}
        </span>
        <span className="text-[#fae608] tabular-nums">{Math.round(percentage)}%</span>
      </div>
      <div className="h-[2px] bg-white/[0.13] overflow-hidden">
        <div
          className="h-full bg-[#fae608] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
