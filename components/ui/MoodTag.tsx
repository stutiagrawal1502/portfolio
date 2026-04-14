interface MoodTagProps {
  mood: string
  className?: string
}

export function MoodTag({ mood, className = '' }: MoodTagProps) {
  return (
    <span className={`mood-tag ${className}`}>{mood}</span>
  )
}
