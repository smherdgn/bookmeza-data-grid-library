
import React from 'react';
import { AlertCircle } from 'lucide-react';
import BookmezaModal from './BookmezaModal';
import BookmezaButton from './BookmezaButton';
import { ConfirmDialogProps } from '../types';
import { TEXTS } from '../constants.tsx';

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}) => (
  <BookmezaModal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <p className="text-sm text-slate-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-center">
        <BookmezaButton variant="secondary" onClick={onClose}>
          {TEXTS.cancel}
        </BookmezaButton>
        <BookmezaButton variant="danger" onClick={() => { onConfirm(); onClose(); }}>
          {TEXTS.yes}
        </BookmezaButton>
      </div>
    </div>
  </BookmezaModal>
);

export default ConfirmDialog;