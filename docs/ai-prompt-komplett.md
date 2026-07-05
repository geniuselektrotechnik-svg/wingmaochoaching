# KI-Analyse: Wo liegt der Prompt?

Der komplette Prompt für die Assessment-Auswertung liegt **inline** in:

- **Datei:** `app/api/analyze/route.ts`
- **Modell:** `openai/gpt-4o-mini` (via AI SDK), temperature 0.4, max 12000 Output-Tokens
- **Ablauf:** Body-Validierung (UUIDs, Skala 1-10 geklemmt, Freitexte sanitized)
  → `calculateResults()` (lib/scoring.ts) → GPT-Aufruf (1 Retry)
  → JSON-Extraktion → bei Fehlschlag Score-basierter Fallback (`buildFallbackAnalysis`)
  → Speicherung in Supabase (nur bereinigte Antworten, nur wenn `completed_at` noch NULL).

Hinweis: Die frühere Datei `lib/ai-analysis.ts` war toter Code (nirgends importiert,
anderes Modell, widersprüchliches Interface) und wurde am 05.07.2026 entfernt.
