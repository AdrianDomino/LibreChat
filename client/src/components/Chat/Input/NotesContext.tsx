import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

type DocDto = { unid: string; items: Record<string, unknown> }; // match what Java sends
type Incoming = string | DocDto | DocDto[];

interface NotesContextType {
  docs: DocDto[];
  addNotes: (payload: Incoming) => void;
  clearNotes: () => void;
  getNotesContext: () => string; // JSON string to prepend/attach
}

const isDebug = (() => {
  try {
    return localStorage.getItem('notesDbg') === '1';
  } catch {
    return false;
  }
})();
const dlog = (...args: any[]) => isDebug && console.debug('[NotesContext]', ...args);

const NotesContext = createContext<NotesContextType | undefined>(undefined);

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  // store in a Map for O(1) merge, expose array for consumers
  const [docsMap, setDocsMap] = useState<Map<string, DocDto>>(new Map());
  const docsRef = useRef(docsMap); // keep ref for window handler

  // keep ref in sync
  useEffect(() => {
    docsRef.current = docsMap;
  }, [docsMap]);

  const addNotes = useCallback((payload: Incoming) => {
    let arr: DocDto[] = [];
    try {
      if (typeof payload === 'string') {
        const parsed = JSON.parse(payload);
        // Java sends a single DocDto or an array – figure it out
        if (Array.isArray(parsed)) arr = parsed as DocDto[];
        else if (parsed.unid) arr = [parsed as DocDto];
        else if (parsed.notes_ctx) {
          // in case you feed back getNotesContext output
          const n = parsed.notes_ctx;
          arr = Array.isArray(n) ? n : [n];
        }
      } else if (Array.isArray(payload)) {
        arr = payload;
      } else {
        arr = [payload];
      }
    } catch (e) {
      dlog('Failed to parse payload, storing raw text', payload, e);
      // store text blob as pseudo doc
      arr = [{ unid: `text-${Date.now()}`, items: { text: String(payload) } }];
    }

    setDocsMap((prev) => {
      const next = new Map(prev);
      for (const d of arr) {
        if (d && d.unid) next.set(d.unid, d);
      }
      return next;
    });
  }, []);

  const clearNotes = useCallback(() => setDocsMap(new Map()), []);

  const getNotesContext = useCallback(() => {
    const list = Array.from(docsRef.current.values());
    if (!list.length) return '';
    const json = JSON.stringify({ notes_ctx: list });
    dlog('getNotesContext returning', json);
    return json;
  }, []);

  // Expose a global hook for the Java plugin
  useEffect(() => {
    (window as any).receiveNotesContext = (s: string) => {
      dlog('window.receiveNotesContext <-', s);
      addNotes(s);
    };
    return () => {
      delete (window as any).receiveNotesContext;
    };
  }, [addNotes]);

  return (
    <NotesContext.Provider
      value={{
        docs: Array.from(docsMap.values()),
        addNotes,
        clearNotes,
        getNotesContext,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within a NotesProvider');
  return ctx;
};
