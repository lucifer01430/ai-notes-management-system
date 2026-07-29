function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface HighlightTextProps {
  text: string;
  terms: string[];
}

export function HighlightText({ text, terms }: HighlightTextProps) {
  const cleanTerms = [...new Set(terms.filter(Boolean))];

  if (cleanTerms.length === 0) {
    return <>{text}</>;
  }

  const pattern = new RegExp(`(${cleanTerms.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const matched = cleanTerms.some((term) => part.toLowerCase() === term.toLowerCase());

        return matched ? (
          <mark key={`${part}-${index}`} className="rounded-md bg-amber-200/80 px-1 text-zinc-950 dark:bg-amber-300/80">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </>
  );
}
