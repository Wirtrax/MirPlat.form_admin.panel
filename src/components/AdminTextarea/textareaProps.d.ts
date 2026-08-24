import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label?: string;
  disabled?: boolean;
  id?: string;
  rows?: number;
}
