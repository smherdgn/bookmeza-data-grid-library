
import { SampleDataRow } from '../types';
import { STATUSES, DEPARTMENTS, CITIES, FIRST_NAMES, LAST_NAMES } from '../constants.tsx';

export const generateSampleData = (count = 100): SampleDataRow[] => {
  return Array.from({ length: count }, (_, i): SampleDataRow => ({
    id: i + 1,
    firstName: FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)],
    lastName: LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)],
    email: `user${i + 1}@bookmeza.com`,
    phone: `+90 5${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')} ${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')} ${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')}`,
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    score: Math.floor(Math.random() * 100),
    salary: Math.floor(Math.random() * 10000) + 5000,
    joinDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('tr-TR'),
    isActive: Math.random() > 0.3,
    avatar: `https://picsum.photos/seed/${i + 1}/64/64` 
  }));
};