interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Frage {current} von {total}
        </span>
        <span className="text-sm font-medium text-primary">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
