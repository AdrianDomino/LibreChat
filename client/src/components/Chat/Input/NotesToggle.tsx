import React, { useEffect, useState, useCallback } from 'react';
import { StickyNote } from 'lucide-react';
import { TooltipAnchor } from '~/components';
import { cn } from '~/utils';

type NotesToggleProps = {
  onToggle: (enabled: boolean) => void;
  initialValue?: boolean;
  disabled?: boolean;
  className?: string;
};

const isDebug = (() => {
  try {
    return localStorage.getItem('notesDbg') === '1';
  } catch {
    return false;
  }
})();
const dlog = (...args: any[]) => isDebug && console.debug('[NotesToggle]', ...args);

const NotesToggle: React.FC<NotesToggleProps> = ({
  onToggle,
  initialValue = false,
  disabled = false,
  className,
}) => {
  const [enabled, setEnabled] = useState(initialValue);

  // Update internal state when initialValue prop changes
  useEffect(() => {
    setEnabled(initialValue);
  }, [initialValue]);

  useEffect(() => {
    dlog('mount, initialValue:', initialValue);
    return () => {
      dlog('unmount');
    };
  }, [initialValue]);

  useEffect(() => {
    onToggle(enabled);
    try {
      localStorage.setItem('sendNotesCtx', enabled ? '1' : '0');
    } catch (error) {
      console.warn('Failed to save notes context preference to localStorage:', error);
    }
    dlog('state ->', enabled);
  }, [enabled, onToggle]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setEnabled((e) => !e);
  }, [disabled]);

  const titleText = enabled ? 'Disable Notes context' : 'Enable Notes context';

  const btn = (
    <button
      type="button"
      aria-pressed={enabled}
      aria-label={titleText}
      disabled={disabled}
      onClick={handleToggle}
      data-testid="notes-toggle-button"
      className={cn(
        'flex size-9 items-center justify-center rounded-full p-1 transition-colors',
        'hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50',
        enabled ? 'text-primary' : 'text-text-tertiary opacity-70',
        disabled && 'cursor-not-allowed opacity-40',
        className,
      )}
    >
      {enabled ? <StickyNote className="icon-md" /> : <StickyNote className="icon-md" />}
    </button>
  );

  return (
    <TooltipAnchor
      render={btn}
      id="notes-toggle-button"
      description={titleText}
      disabled={disabled}
    />
  );
};

export default NotesToggle;
