/* eslint-disable no-console */
import React, { useEffect, createContext, useState, useRef, useCallback, ReactNode } from 'react';
import { useNotes } from './components/Chat/Input/NotesContext';

// ---- Types ----
export type NotesPayload = any;

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
    __notesBridgeInstalled?: boolean;
  }
}

// ---- Debug helpers ----
const DEBUG = (() => {
  try {
    return (
      /(?:^|[?&])notesDebug=1(?:&|$)/.test(window.location.search) ||
      localStorage.getItem('notesDbg') === '1'
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

const dlog = (...args: any[]) => DEBUG && console.debug('[NotesBridge]', ...args);

export function NotesBridge({ children }: Readonly<{ children: ReactNode }>) {
  const [notes, setNotes] = useState<NotesPayload | null>(null);
  const lastJsonRef = useRef<string | null>(null);
  const { setNotes: setNotesContext } = useNotes();

  const receiveNotesContext = useCallback(
    (json: string) => {
      if (BREAK_ON_MSG) debugger; // eslint-disable-line no-debugger
      dlog('receiveNotesContext raw:', json);

      if (json === lastJsonRef.current) {
        dlog('Duplicate payload; skipping');
        return;
      }

      try {
        const parsed = JSON.parse(json);
        dlog('Parsed payload:', parsed);
        setNotes(parsed);
        // Update the NotesContext with the new notes data
        setNotesContext(typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
        lastJsonRef.current = json;
        window.dispatchEvent(new CustomEvent('notes-context', { detail: parsed }));
      } catch (err) {
        console.error('[NotesBridge] JSON parse failed:', err, 'raw=', json);
      }
    },
    [setNotesContext],
  );

  const sendToPlugin = useCallback((payload: any) => {
    const str = JSON.stringify(payload);
    dlog('sendToPlugin ->', str);
    if (typeof window.callPlugin === 'function') {
      try {
        window.callPlugin(str);
      } catch (e) {
        console.error('[NotesBridge] callPlugin failed:', e);
      }
    } else {
      dlog('window.callPlugin not present');
    }
  }, []);

  useEffect(() => {
    dlog('mount');
    if (window.__notesBridgeInstalled) {
      dlog('Already installed; replacing old handler');
    }
    window.__notesBridgeInstalled = true;

    const oldReceive = window.receiveNotesContext;
    window.receiveNotesContext = receiveNotesContext;
    window.__notesBridgeTest = (obj: any) => receiveNotesContext(JSON.stringify(obj));
    dlog('receiveNotesContext installed. oldReceive exists?', !!oldReceive);

    return () => {
      window.receiveNotesContext = oldReceive;
      delete window.__notesBridgeTest;
      dlog('unmount; handler restored');
    };
  }, [receiveNotesContext]);

  return <NotesCtx.Provider value={{ notes, sendToPlugin }}>{children}</NotesCtx.Provider>;
}

export default NotesBridge;
