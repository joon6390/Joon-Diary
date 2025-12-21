import React from 'react';
import { Button } from '../button';
import styles from './styles.module.css';

export interface ModalProps {
  variant?: 'info' | 'danger';
  actions?: 'single' | 'dual';
  theme?: 'light' | 'dark';
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryClick: () => void;
  onSecondaryClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  variant = 'info',
  actions = 'single',
  theme = 'light',
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  disabled = false,
  className,
}) => {
  // Prepare for future variant expansion (danger, etc.)
  const modalClasses = [
    styles.modal,
    styles[variant],
    styles[theme],
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const titleClasses = [
    styles.title,
    styles[theme],
  ]
    .filter(Boolean)
    .join(' ');

  const descriptionClasses = [
    styles.description,
    styles[theme],
  ]
    .filter(Boolean)
    .join(' ');

  const buttonAreaClasses = [
    styles.buttonArea,
    styles[actions],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={modalClasses}>
      <div className={styles.contentArea}>
        <h2 className={titleClasses}>{title}</h2>
        <p className={descriptionClasses}>{description}</p>
      </div>
      <div className={buttonAreaClasses}>
        {actions === 'dual' && secondaryButtonText && onSecondaryClick && (
          <Button
            variant="secondary"
            theme="light"
            size="large"
            onClick={onSecondaryClick}
            disabled={disabled}
            className={styles.button}
          >
            {secondaryButtonText}
          </Button>
        )}
        <Button
          variant="primary"
          theme="light"
          size="large"
          onClick={onPrimaryClick}
          disabled={disabled}
          className={actions === 'single' ? styles.buttonFull : styles.button}
        >
          {primaryButtonText}
        </Button>
      </div>
    </div>
  );
};

export default Modal;

