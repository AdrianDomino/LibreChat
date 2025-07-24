/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import React, {
  useEffect,
  createContext,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from 'react';

type NotesPayload = any;

interface NotesContextShape {
  notes: NotesPayload | null;
  sendToPlugin: (payload: any) => void;
}

export const NotesCtx = createContext<NotesContextShape>({
  notes: null,
  sendToPlugin: () => {},
});

// ---- augment window for TS ----
declare global {
  interface Window {
    receiveNotesContext?: (json: string) => void;
    callPlugin?: (payload: string) => void;
    __notesBridgeTest?: (obj: any) => void;
  }
}

const DEBUG = (() => {
  try {
    return (
      /(?:^|\?|&)notesDebug=1(?:&|$)/.test(window.location.search) ||
      localStorage.getItem('notesDebug') === '1'
    );
  } catch {
    return false;
  }
})();

const BREAK_ON_MSG = (() => {
  try {
    return localStorage.getItem('notesDebugBreak') === '1';
  } catch {
    return false;
  }
})();

function dlog(...args: any[]) {
  if (DEBUG) console.debug('[NotesBridge]', ...args);
}

export function NotesBridge({ children }: Readonly<{ children: ReactNode }>) {
  const [notes, setNotes] = useState<NotesPayload | null>(null);
  const lastJsonRef = useRef<string | null>(null);

  const receiveNotesContext = useCallback((json: string) => {
    if (BREAK_ON_MSG) {
      // eslint-disable-next-line no-debugger
      debugger;
    }
    dlog('receiveNotesContext raw:', json);

    if (json === lastJsonRef.current) {
      dlog('Duplicate payload; skipping');
      return;
    }

    try {
      const parsed = JSON.parse(json);
      dlog('Parsed payload:', parsed);
      setNotes(parsed);
      lastJsonRef.current = json;
      window.dispatchEvent(new CustomEvent('notes-context', { detail: parsed }));
    } catch (err) {
      console.error('[NotesBridge] JSON parse failed:', err, 'raw=', json);
    }
  }, []);

  const sendToPlugin = useCallback((payload: any) => {
    const str = JSON.stringify(payload);
    dlog('sendToPlugin ->', str);
    window.callPlugin?.(str);
  }, []);

  useEffect(() => {
    const oldReceive = window.receiveNotesContext;
    window.receiveNotesContext = receiveNotesContext;
    window.__notesBridgeTest = (obj: any) => receiveNotesContext(JSON.stringify(obj));
    dlog('receiveNotesContext installed.');

    return () => {
      window.receiveNotesContext = oldReceive;
      delete window.__notesBridgeTest;
      dlog('receiveNotesContext removed.');
    };
  }, [receiveNotesContext]);

  return <NotesCtx.Provider value={{ notes, sendToPlugin }}>{children}</NotesCtx.Provider>;
}
