
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import BookmezaInput from './BookmezaInput';
import BookmezaButton from './BookmezaButton';
import { AutoFormProps, SampleDataRow, FormDataValues } from '../types';
import { TEXTS, DEPARTMENTS, CITIES, STATUSES } from '../constants.tsx';

const AutoForm: React.FC<AutoFormProps> = ({ data, onSave, onCancel, mode = 'add' }) => {
  const [formData, setFormData] = useState<FormDataValues>(data || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: DEPARTMENTS[0],
    city: CITIES[0],
    status: STATUSES[0]
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else if (mode === 'add') {
      // Reset to default for add mode if data is null (e.g. after an edit)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: DEPARTMENTS[0],
        city: CITIES[0],
        status: STATUSES[0]
      });
    }
  }, [data, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Lütfen Ad, Soyad ve E-posta alanlarını doldurun.'); // Consider a more elegant notification
      return;
    }
    
    const finalData: SampleDataRow = mode === 'add' ? {
      ...formData,
      id: Date.now(), // Simple ID generation
      score: Math.floor(Math.random() * 100),
      salary: Math.floor(Math.random() * 10000) + 5000,
      joinDate: new Date().toLocaleDateString('tr-TR'),
      isActive: formData.status === 'Aktif',
      avatar: `https://picsum.photos/seed/${Date.now()}/64/64`
    } : {
      // Ensure all fields of SampleDataRow are present for edit, even if not directly editable here
      // This assumes 'data' prop in edit mode already contains these.
      id: formData.id!, // id must exist in edit mode
      score: formData.score || 0,
      salary: formData.salary || 0,
      joinDate: formData.joinDate || new Date().toLocaleDateString('tr-TR'),
      isActive: formData.status === 'Aktif', // Update isActive based on status
      avatar: formData.avatar || `https://picsum.photos/seed/${formData.id}/64/64`,
      ...formData // formData has higher precedence for editable fields
    };
    
    onSave(finalData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BookmezaInput
          name="firstName"
          placeholder="Ad *"
          value={formData.firstName}
          onChange={handleChange}
          icon={User}
        />
        <BookmezaInput
          name="lastName"
          placeholder="Soyad *"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>
      
      <BookmezaInput
        type="email"
        name="email"
        placeholder="E-posta *"
        value={formData.email}
        onChange={handleChange}
        icon={Mail}
      />
      
      <BookmezaInput
        name="phone"
        placeholder="Telefon"
        value={formData.phone}
        onChange={handleChange}
        icon={Phone}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-3 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-400"
        >
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        
        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full px-3 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-400"
        >
          {CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-400"
        >
          {STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      
      <div className="flex gap-3 pt-4 mt-2 border-t border-slate-200">
        <BookmezaButton variant="secondary" onClick={onCancel} className="flex-1">
          {TEXTS.cancel}
        </BookmezaButton>
        <BookmezaButton variant="primary" onClick={handleSubmit} className="flex-1">
          {TEXTS.save}
        </BookmezaButton>
      </div>
    </div>
  );
};

export default AutoForm;