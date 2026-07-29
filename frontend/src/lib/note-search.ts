import type { Note } from "@/types/note";

export function getSearchTerms(query: string) {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

export function noteMatchesSearch(note: Note, terms: string[]) {
  if (terms.length === 0) {
    return true;
  }

  const searchable = `${note.title} ${note.content} ${note.summary ?? ""}`.toLowerCase();

  return terms.every((term) => searchable.includes(term));
}

export function searchExcerpt(value: string, terms: string[], length = 220) {
  if (value.length <= length) {
    return value;
  }

  const lowerValue = value.toLowerCase();
  const firstIndex = terms
    .map((term) => lowerValue.indexOf(term))
    .filter((index) => index >= 0)
    .sort((first, second) => first - second)[0];

  if (firstIndex === undefined) {
    return `${value.slice(0, length).trim()}...`;
  }

  const start = Math.max(0, firstIndex - Math.floor(length / 3));
  const end = Math.min(value.length, start + length);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < value.length ? "..." : "";

  return `${prefix}${value.slice(start, end).trim()}${suffix}`;
}
