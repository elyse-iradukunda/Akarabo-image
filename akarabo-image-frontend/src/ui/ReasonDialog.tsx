import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { TextAreaField } from './TextAreaField';

export interface ReasonDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Dialog title. */
  title: string;
  /** Explanation shown above the reason field. */
  description?: string;
  /** Label of the confirm button. */
  confirmLabel?: string;
  /** True while the request is in flight. */
  isSubmitting?: boolean;
  /** Called when the dialog is dismissed without a reason. */
  onCancel: () => void;
  /** Called with the reason once the user confirms. */
  onConfirm: (reason: string) => void;
}

/**
 * Collects the mandatory reason for irreversible-but-recorded actions
 * (cancelling a booking, reversing a payment or an expense).
 *
 * The backend keeps the reason forever, so the dialog never allows an empty
 * value.
 */
export function ReasonDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  isSubmitting = false,
  onCancel,
  onConfirm,
}: ReasonDialogProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  // Reset the field every time the dialog opens.
  useEffect(() => {
    if (open) {
      setReason('');
      setError(undefined);
    }
  }, [open]);

  const handleConfirm = () => {
    const trimmed = reason.trim();
    if (trimmed.length < 3) {
      setError('Please give a short reason (at least 3 characters).');
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <button
            type="button"
            className="ak-button ak-button--secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ak-button ak-button--danger"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    >
      {description && <p className="ak-small ak-muted ak-mb-3">{description}</p>}
      <TextAreaField
        label="Reason"
        required
        name="reason"
        rows={4}
        maxLength={500}
        value={reason}
        error={error}
        onChange={(event) => {
          setReason(event.target.value);
          if (error) setError(undefined);
        }}
        placeholder="Why is this happening? This note is kept forever."
      />
    </Modal>
  );
}

export default ReasonDialog;
