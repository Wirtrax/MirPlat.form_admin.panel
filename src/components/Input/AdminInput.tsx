import React, { useId } from 'react';
import clsx from 'clsx';
import s from './Input.module.scss';
import type { InputProps } from './InputProps';
import Search from '../../assets/ico/interface/search.svg?react';

const AdminInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, type = 'text', showSearchIcon, disabled, id, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const isSearch = showSearchIcon ?? type === 'search';

    return (
      <div className={clsx(s.input, className)}>
        {label && (
          <label htmlFor={inputId} className={s['input__label']}>
            {label}
          </label>
        )}

        <div className={clsx(s['input__field'], { [s['input__field--disabled']]: disabled })}>
          {isSearch && <Search className={s['input__icon']} />}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={clsx(s['input__control'], { [s['input__control--with-icon']]: isSearch })}
            {...rest}
          />
        </div>
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';

export default AdminInput;
