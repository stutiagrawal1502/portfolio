interface PoemRendererProps {
  content: string
  className?: string
}

export function PoemRenderer({ content, className = '' }: PoemRendererProps) {
  // Strip any markdown symbols
  const cleaned = content
    .replace(/^#{1,6}\s/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')

  return (
    <pre
      className={`poem-body ${className}`}
      style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic',
        fontSize: '19px',
        lineHeight: 2,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {cleaned}
    </pre>
  )
}
