import React, { useId } from 'react';
import clsx from 'clsx';
import s from './AdminTextarea.module.scss';
import type { TextareaProps } from './textareaProps';

const AdminTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, disabled, id, rows = 4, ...rest }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className={clsx(s.textarea, className)}>
        {label && (
          <label htmlFor={textareaId} className={s['textarea__label']}>
            {label}
          </label>
        )}

        <div className={clsx(s['textarea__field'], { [s['textarea__field--disabled']]: disabled })}>
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            rows={rows}
            className={clsx(s['textarea__control'])}
            {...rest}
          />
        </div>
      </div>
    );
  }
);

AdminTextarea.displayName = 'AdminTextarea';

export default AdminTextarea;
