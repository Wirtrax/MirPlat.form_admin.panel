import React from 'react';
import s from './CheckboxAdmin.module.scss';
import type { CheckboxAdminProps } from './checkboxAdminProps';

const CheckboxAdmin = React.forwardRef<HTMLInputElement, CheckboxAdminProps>(
  ({ label, subtitle, isCheck, name, onChange }, ref) => {
    return (
      <div className={s['switch']}>
        <input
          ref={ref}
          type="checkbox"
          checked={isCheck}
          onChange={onChange}
          id={name}
          name={name}
          className={s['switch__input']}
        />
        <label htmlFor={name} className={s['switch__label']}>
          {label}
        </label>
        <span className={s['switch__info']}>{subtitle}</span>
      </div>
    );
  }
);

export default CheckboxAdmin;
