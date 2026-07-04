"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import type { CategoryScore } from "@/lib/scoring"

// Bunte Farben für jede Kategorie (Statistik-Style)
const CATEGORY_COLORS = [
  "#3b82f6", // Blau
  "#22c55e", // Grün
  "#f59e0b", // Orange/Gelb
  "#ef4444", // Rot
  "#a855f7", // Lila
  "#06b6d4", // Cyan
]

interface ScoreChartProps {
  categoryScores: CategoryScore[]
}

// Farbe nach Index der Kategorie
const getCategoryColor = (index: number): string => {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}

export function ScoreChart({ categoryScores }: ScoreChartProps) {
  if (!categoryScores || categoryScores.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Keine Kategorie-Daten verfuegbar</p>
      </div>
    )
  }
  
  const pieData = categoryScores.map((cat, index) => ({
    name: cat.category,
    value: cat.percentage,
    color: getCategoryColor(index),
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-semibold">{payload[0].name}</p>
          <p className="text-primary text-lg font-bold">{payload[0].value}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4" data-chart-loaded="true">
      {/* Progress Bars */}
      <div className="space-y-4">
        {categoryScores.map((cat, index) => (
          <div key={cat.category} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">{cat.category}</span>
              <span className="font-semibold" style={{ color: getCategoryColor(index) }}>
                {cat.percentage}%
              </span>
            </div>
            <div className="h-4 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: getCategoryColor(index),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
