Add a toggle button beside the Tools icon and, if it’s ON, prepend the Notes context to the message you send. Here’s the minimal way to do it.

1. Consume the Notes context in the input bar
Where the Tools icon lives (search for it with rg "Tools" -g client/src -n or grep -R "Tools" client/src), you’ll find the input component (often something like PromptInput.tsx, ChatInput.tsx, or Composer.tsx). Edit that file:

tsx
Copy
Edit
import { useContext, useState, useEffect } from 'react';
import { NotesCtx } from '@/path/to/NotesBridge'; // adjust path

// ...
const { notes } = useContext(NotesCtx);
const [sendNotesCtx, setSendNotesCtx] = useState<boolean>(() => {
  return localStorage.getItem('sendNotesCtx') === '1';
});

useEffect(() => {
  localStorage.setItem('sendNotesCtx', sendNotesCtx ? '1' : '0');
}, [sendNotesCtx]);
Add the toggle button (right of Tools icon)
Put this next to the Tools button JSX:

tsx
Copy
Edit
<button
  type="button"
  title={sendNotesCtx ? 'Include Notes context' : 'Exclude Notes context'}
  onClick={() => setSendNotesCtx(v => !v)}
  className={`mx-1 flex h-6 w-6 items-center justify-center rounded hover:bg-white/10
              ${sendNotesCtx ? 'opacity-100' : 'opacity-40'}`}
>
  {/* Simple SVG icon; swap for any icon lib you use */}
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M4 3h16v18H4z" opacity=".2"/><!-- sheet -->
    <path d="M7 6h10v2H7zm0 4h10v2H7zm0 4h6v2H7z"/><!-- lines -->
  </svg>
</button>
Greyed-out state comes from the opacity-40 class.

