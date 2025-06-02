
import { LucideIcon } from 'lucide-react'; // Ensure lucide-react is a dependency

export interface SampleDataRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string; 
  department: string; 
  city: string; 
  score: number;
  salary: number;
  joinDate: string; 
  isActive: boolean;
  avatar: string;
}

export interface SortConfig {
  key: keyof SampleDataRow | 'user' | null;
  direction: 'asc' | 'desc';
}

export interface BookmezaColumn {
  key: keyof SampleDataRow | 'user' | 'actions';
  label: string;
  type?: 'number' | 'badge' | 'boolean' | 'custom';
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  width?: string;
  render?: (value: any, row: SampleDataRow) => React.ReactNode;
}

export interface BookmezaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BookmezaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export interface BookmezaModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: ModalSize;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export interface FormDataValues {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  city: string;
  status: string;
  score?: number;
  salary?: number;
  joinDate?: string;
  isActive?: boolean;
  avatar?: string;
}
export interface AutoFormProps {
  data?: FormDataValues | null;
  onSave: (data: SampleDataRow) => void;
  onCancel: () => void;
  mode?: 'add' | 'edit';
}

export interface BookmezaDataGridProps {
  data: SampleDataRow[];
  columnsConfig?: BookmezaColumn[]; // Optional: if user wants to override default columns
  title?: string;
  onEdit?: (row: SampleDataRow) => void;
  onDelete?: (row: SampleDataRow) => void;
  onAdd?: (newData: SampleDataRow) => void;
  onRowClick?: (row: SampleDataRow) => void;
}
