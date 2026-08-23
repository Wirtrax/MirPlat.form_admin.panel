import React, { useId } from 'react';
import clsx from 'clsx';
import s from './AdminTextarea.module.scss';
import type { TextareaProps } from './textareaProps';

const AdminTextarea: React.FC<TextareaProps> = ({ className = '', label, disabled, id, rows = 4, ...rest }) => {
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
        <textarea id={textareaId} disabled={disabled} rows={rows} className={clsx(s['textarea__control'])} {...rest} />
      </div>
    </div>
  );
};

export default AdminTextarea;
