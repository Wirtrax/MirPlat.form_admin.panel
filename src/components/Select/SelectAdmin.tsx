import React, { useEffect, useRef, useState } from 'react';
import s from './SelectAdmin.module.scss';
import clsx from 'clsx';
import type { Option, SelectProps } from './SelectAdminProps';
import Arrow from '../../assets/ico/interface/arrowdown.svg?react';

export const SelectAdmin: React.FC<SelectProps> = ({
  label,
  error,
  name,
  value,
  options,
  onChange,
  disabled,
  onBlur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option: Option) => {
    onChange({
      target: {
        name,
        value: option.value,
      },
    });
    onBlur?.();
    setIsOpen(false);
  };

  return (
    <div className={s.select} ref={rootRef}>
      {label && <span className={s.select__label}>{label}</span>}

      <div
        className={clsx(
          s.select__field,
          disabled ? s['select__field--disabled'] : '',
          error ? s['select__field--error'] : ''
        )}
        onClick={handleToggle}>
        <button
          type="button"
          className={s.select__control}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}>
          {selected?.label}
        </button>

        <Arrow className={[s.select__icon, isOpen ? s['select__icon--open'] : ''].join(' ')} />

        {isOpen && (
          <ul className={s.select__menu} role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={clsx(s.select__option, option.value === value ? s['select__option--selected'] : '')}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option);
                }}>
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <span className={s.select__error}>{error}</span>}
    </div>
  );
};

export default SelectAdmin;
