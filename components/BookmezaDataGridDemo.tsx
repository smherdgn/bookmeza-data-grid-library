
import React, { useState } from 'react';
import { Settings, FileText, Phone, Download as DownloadIcon } from 'lucide-react'; // Renamed to avoid conflict
import BookmezaDataGrid from './BookmezaDataGrid';
import { SampleDataRow } from '../types';
import { generateSampleData } from '../utils/generateSampleData';
import { TEXTS } from '../constants.tsx';

const BookmezaDataGridDemo: React.FC = () => {
  const [sampleData, setSampleData] = useState<SampleDataRow[]>(() => generateSampleData(100));

  const handleEdit = (row: SampleDataRow) => {
    console.log('Editing:', row);
    setSampleData(prev => prev.map(item => 
      item.id === row.id ? {...item, ...row, isActive: row.status === 'Aktif'} : item // Ensure isActive reflects status
    ));
  };

  const handleDelete = (rowToDelete: SampleDataRow) => {
    console.log('Deleting:', rowToDelete);
    setSampleData(prev => prev.filter(item => item.id !== rowToDelete.id));
  };

  const handleAdd = (newData: SampleDataRow) => {
    console.log('Adding:', newData);
    setSampleData(prev => [...prev, {...newData, isActive: newData.status === 'Aktif'}]); // Ensure isActive reflects status
  };

  const handleRowClick = (row: SampleDataRow) => {
    console.log('Row clicked:', row);
    // Example: Open a detail view or navigate, for now just log
  };

  const featureCards = [
    { icon: Settings, title: TEXTS.featureFull, description: TEXTS.featureFullDesc, gradient: "from-indigo-500 to-purple-500" },
    { icon: FileText, title: TEXTS.featureAutoForms, description: TEXTS.featureAutoFormsDesc, gradient: "from-emerald-500 to-teal-500" },
    { icon: Phone, title: TEXTS.featureResponsive, description: TEXTS.featureResponsiveDesc, gradient: "from-amber-500 to-orange-500" },
    { icon: DownloadIcon, title: TEXTS.featureCSV, description: TEXTS.featureCSVDesc, gradient: "from-rose-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-100 p-4 sm:p-6 lg:p-8 antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center py-8 sm:py-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            {TEXTS.dataGridTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            {TEXTS.dataGridDescription}
          </p>
        </header>

        <main>
          <BookmezaDataGrid
            data={sampleData}
            title={TEXTS.userManagementSystem}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onRowClick={handleRowClick}
          />
        </main>

        <section className="py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map(card => (
              <div key={card.title} className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1.5">{card.title}</h3>
                <p className="text-sm text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-lg">
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">{TEXTS.usageTitle}</h3>
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 text-sm text-slate-300 font-mono overflow-x-auto shadow-inner">
            <pre>{`<BookmezaDataGrid
  data={yourDataArray}
  title="My Awesome Data Table"
  onAdd={handleAddNewItem}
  onEdit={handleEditItem}
  onDelete={handleDeleteItem}
  onRowClick={handleRowInteraction}
/>`}</pre>
          </div>
        </section>
        
        <footer className="text-center py-8 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Bookmeza Solutions. All rights reserved.</p>
          <p>Built with React, TypeScript, and Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
}

export default BookmezaDataGridDemo;