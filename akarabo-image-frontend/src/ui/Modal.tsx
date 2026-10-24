import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from '../assets';

export interface ModalProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Called when the backdrop, the escape key or the close button is used. */
  onClose: () => void;
  /** Dialog title. */
  title: string;
  /** Dialog body. */
  children: ReactNode;
  /** Dialog footer (usually the action buttons). */
  footer?: ReactNode;
}

/** Accessible modal dialog rendered in a portal. */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Lock the page behind the dialog.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="ak-modal__backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="ak-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="ak-modal__header">
          <h2 className="ak-modal__title">{title}</h2>
          <button
            type="button"
            className="ak-button ak-button--ghost ak-button--sm"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <XIcon size={18} />
          </button>
        </header>
        <div className="ak-modal__body">{children}</div>
        {footer && <footer className="ak-modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
