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
  'data-testid'?: string;
  'data-testid-title'?: string;
  'data-testid-description'?: string;
  'data-testid-primary-button'?: string;
  'data-testid-secondary-button'?: string;
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
  'data-testid': dataTestId,
  'data-testid-title': dataTestIdTitle,
  'data-testid-description': dataTestIdDescription,
  'data-testid-primary-button': dataTestIdPrimaryButton,
  'data-testid-secondary-button': dataTestIdSecondaryButton,
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
    <div className={modalClasses} data-testid={dataTestId}>
      <div className={styles.contentArea}>
        <h2 className={titleClasses} data-testid={dataTestIdTitle}>{title}</h2>
        <p className={descriptionClasses} data-testid={dataTestIdDescription}>{description}</p>
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
            data-testid={dataTestIdSecondaryButton}
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
          data-testid={dataTestIdPrimaryButton}
        >
          {primaryButtonText}
        </Button>
      </div>
    </div>
  );
};

export default Modal;

