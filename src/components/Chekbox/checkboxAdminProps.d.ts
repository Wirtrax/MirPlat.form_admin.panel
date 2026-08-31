export interface CheckboxAdminProps {
  label?: string;
  subtitle?: string;
  isCheck: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
