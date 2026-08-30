import {
  createElement,
  useEffect,
  useRef,
  type ElementType,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

interface BroadcastEditableTextProps {
  value: string;
  onChange?: (value: string) => void;
  interactive: boolean;
  label: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
}

function plainText(element: HTMLElement): string {
  return (element.innerText ?? element.textContent ?? '').replace(/\r/g, '').trim();
}

export function BroadcastEditableText({
  value,
  onChange,
  interactive,
  label,
  as = 'span',
  className = '',
  multiline = false,
}: BroadcastEditableTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || document.activeElement === element) return;
    if (element.innerText !== value) element.innerText = value;
  }, [value]);

  function stop(event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>): void {
    if (!interactive) return;
    event.stopPropagation();
  }

  function commit(event: FocusEvent<HTMLElement>): void {
    if (!interactive || !onChange) return;
    const next = plainText(event.currentTarget);
    if (next !== value) onChange(next);
  }

  function keyDown(event: KeyboardEvent<HTMLElement>): void {
    if (!interactive) return;
    if (event.key === 'Escape') {
      event.currentTarget.innerText = value;
      event.currentTarget.blur();
      return;
    }
    if (!multiline && event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }

  return createElement(
    as,
    {
      ref,
      className: `broadcast-editable-text ${className}`.trim(),
      contentEditable: interactive,
      suppressContentEditableWarning: true,
      spellCheck: false,
      role: interactive ? 'textbox' : undefined,
      tabIndex: interactive ? 0 : undefined,
      title: interactive ? `Click to edit ${label}` : undefined,
      'data-operator-editable': interactive ? 'true' : undefined,
      'aria-label': interactive ? label : undefined,
      onClick: stop,
      onFocus: stop,
      onBlur: commit,
      onKeyDown: keyDown,
    },
    value,
  );
}
