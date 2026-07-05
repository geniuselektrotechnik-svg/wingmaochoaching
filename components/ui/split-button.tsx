"use client"

import type React from "react"

/**
 * Button im Landing-Design: eckiges Textfeld + separate Pfeil-Box mit 2px Lücke
 * (entspricht .wm-btn-split auf der Startseite).
 */
interface SplitButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "yellow" | "dark"
  direction?: "right" | "left"
  className?: string
  type?: "button" | "submit"
}

function Arrow({ direction }: { direction: "right" | "left" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="17"
      height="17"
      className={direction === "left" ? "rotate-180" : ""}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function SplitButton({
  children,
  onClick,
  disabled = false,
  variant = "yellow",
  direction = "right",
  className = "",
  type = "button",
}: SplitButtonProps) {
  const boxBase = "flex items-center transition-colors duration-200"
  const txtStyle =
    variant === "yellow"
      ? "bg-[#fae608] text-[#0a0a0a] group-hover:bg-[#ffef4d]"
      : "bg-[#141414] text-white border border-white/15 group-hover:bg-[#1e1e1e]"
  const arwStyle = "bg-[#fae608] text-[#0a0a0a] group-hover:bg-[#ffef4d]"

  const txtBox = (
    <span className={`${boxBase} ${txtStyle} px-[22px] py-4 font-semibold text-[16px] leading-none whitespace-nowrap flex-1 justify-center`}>
      {children}
    </span>
  )
  const arrowBox = (
    <span className={`${boxBase} ${arwStyle} justify-center px-[15px]`}>
      <Arrow direction={direction} />
    </span>
  )

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group inline-flex items-stretch gap-[2px] select-none disabled:opacity-35 disabled:pointer-events-none ${className}`}
    >
      {direction === "left" ? arrowBox : null}
      {txtBox}
      {direction === "right" ? arrowBox : null}
    </button>
  )
}
