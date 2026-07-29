export const helpContent = {
  dashboard: {
    title: "Dashboard help",
    body: (
      <>
        <p>
          The dashboard gives a quick operational view of your AI notes workspace. The total notes statistic shows how much knowledge is stored, while summarized and unsummarized counts show how many notes already have AI-generated summaries. Words captured estimates the volume of written material across your notes.
        </p>
        <p>
          Workspace health highlights summary coverage, the most recent update, and whether the note collection is ready for search. Use this page to understand overall progress before jumping into note management or semantic search.
        </p>
      </>
    ),
  },
  notes: {
    title: "All Notes help",
    body: (
      <>
        <p>
          All Notes is the main management view for your stored notes. The search field performs fast local keyword filtering across title, content, and summary. It is case insensitive, ignores extra spaces, and highlights matched text in the visible results.
        </p>
        <p>
          Use View to open the full note details page, Edit to update the note content, Summary to request an AI summary, and Delete to remove the note after confirmation. This search is separate from Semantic Search and is intended for exact word-based filtering.
        </p>
      </>
    ),
  },
  create: {
    title: "Create Note help",
    body: (
      <>
        <p>
          Create Note is where new knowledge enters the system. Effective notes usually have a specific title and content that captures context, decisions, examples, and follow-up details. Clear notes produce better summaries and better semantic search matches later.
        </p>
        <p>
          Prefer complete sentences, include important terminology, and avoid mixing unrelated topics in one note. After saving, you can open the note details page to generate an AI summary or use semantic search once embeddings are created by the backend.
        </p>
      </>
    ),
  },
  view: {
    title: "View Note help",
    body: (
      <>
        <p>
          The View Note page shows the complete note content and its AI summary status. When you click Generate Summary, the frontend calls the Laravel summary endpoint, and the backend sends the note content to Google Gemini.
        </p>
        <p>
          Gemini returns a concise summary, Laravel stores it in the note record, and the page updates immediately with the new summary. The original note content remains the source of truth, while the summary is a generated helper for faster review.
        </p>
      </>
    ),
  },
  edit: {
    title: "Edit Note help",
    body: (
      <>
        <p>
          Edit Note lets you update the title and content of an existing note. These changes affect what users read, what keyword search matches, and what future AI operations should use as source material.
        </p>
        <p>
          If a note already has a summary, editing the content does not automatically rewrite that summary. Open the note details page and generate a fresh summary when the content changes meaningfully, so the stored AI summary stays aligned with the latest note.
        </p>
      </>
    ),
  },
  semanticSearch: {
    title: "Semantic Search help",
    body: (
      <>
        <p>
          Semantic Search is different from keyword search because it understands meaning instead of only exact words. Google Gemini converts both notes and your query into embeddings, which are numerical representations of meaning.
        </p>
        <p>
          The backend compares embeddings using cosine similarity and ranks the most relevant notes first. Similar meaning can return useful results even when the same words are not present. Try searches such as Laravel Routing, Authentication, React State Management, Docker Containers, and API Security.
        </p>
      </>
    ),
  },
};
