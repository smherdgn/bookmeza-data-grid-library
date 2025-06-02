import React, { useState, useMemo, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  File, 
  FileSpreadsheet,
  X,
  Check,
} from 'lucide-react';
import { SampleDataRow, BookmezaColumn as GridColumn } from '../types'; // Renamed to avoid conflict
import { TEXTS } from '../constants.tsx';

// --- Start of Local Components (copied from BookmezaExportSystem) ---

// Local Bookmeza Button Komponenti
const BookmezaButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  icon: Icon,
  className = "",
  fullWidth = false,
  ...props
}: {
  children?: React.ReactNode; // Made children optional for icon-only buttons
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  icon?: typeof Download; 
  className?: string;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white/80 hover:bg-white/95 text-slate-700 border-2 border-slate-200 hover:border-slate-300 backdrop-blur-sm shadow-md hover:shadow-lg",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70",
    success: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl",
    warning: "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-xl 
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95
        ${variants[variant || 'primary']} ${sizes[size || 'md']}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
};

// Local Modal Komponenti
const BookmezaModal = ({ isOpen, onClose, title, children, size = 'md' }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}) => {
  const modalSizes = { // Renamed to avoid conflict with button sizes
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl' 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto"> {/* Increased z-index */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className={`relative bg-white rounded-2xl shadow-2xl ${modalSizes[size]} w-full`}>
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900" id={`modal-title-${title.replace(/\s+/g, '-')}`}>{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Local Export Progress Komponenti
const ExportProgress = ({ isVisible, progress, message }: {
  isVisible: boolean;
  progress: number;
  message: string;
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-[200]"> {/* Increased z-index */}
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
        <div>
          <div className="text-sm font-medium text-slate-900">{message}</div>
          <div className="w-48 bg-slate-200 rounded-full h-2 mt-1">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
// --- End of Local Components ---

interface ExportableColumn {
  key: keyof SampleDataRow;
  label: string;
  type: 'number' | 'text' | 'email' | 'phone' | 'currency' | 'date' | 'boolean';
}

const ALL_POSSIBLE_EXPORT_COLUMNS: ExportableColumn[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'firstName', label: 'Ad', type: 'text' },
  { key: 'lastName', label: 'Soyad', type: 'text' },
  { key: 'email', label: 'E-posta', type: 'email' },
  { key: 'phone', label: 'Telefon', type: 'phone' },
  { key: 'department', label: 'Departman', type: 'text' },
  { key: 'city', label: 'Şehir', type: 'text' },
  { key: 'status', label: 'Durum', type: 'text' },
  { key: 'score', label: 'Puan', type: 'number' },
  { key: 'salary', label: 'Maaş', type: 'currency' },
  { key: 'joinDate', label: 'Katılım Tarihi', type: 'date' },
  { key: 'isActive', label: 'Aktif', type: 'boolean' }
];

interface BookmezaAdvancedExporterProps {
  isOpen: boolean;
  onClose: () => void;
  dataToExport: SampleDataRow[];
  gridColumnsDisplayed: GridColumn[];
}

const BookmezaAdvancedExporter: React.FC<BookmezaAdvancedExporterProps> = ({
  isOpen,
  onClose,
  dataToExport,
  gridColumnsDisplayed,
}) => {
  const [selectedExportableColumns, setSelectedExportableColumns] = useState<Record<string, boolean>>({});
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportOptions, setExportOptions] = useState({
    includeHeaders: true,
    delimiter: ',',
    // selectedRowsOnly: false // Future feature
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportMessage, setExportMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const initialSelection: Record<string, boolean> = {};
      ALL_POSSIBLE_EXPORT_COLUMNS.forEach(expCol => initialSelection[expCol.key] = false);

      gridColumnsDisplayed.forEach(gridCol => {
        if (gridCol.key === 'actions') return; // Skip actions column

        if (gridCol.key === 'user') {
          initialSelection['firstName'] = true;
          initialSelection['lastName'] = true;
          initialSelection['email'] = true;
        } else if (initialSelection.hasOwnProperty(gridCol.key)) {
          initialSelection[gridCol.key as keyof SampleDataRow] = true;
        }
      });
      setSelectedExportableColumns(initialSelection);
    }
  }, [isOpen, gridColumnsDisplayed]);

  const getActiveExportColumns = () => {
    return ALL_POSSIBLE_EXPORT_COLUMNS.filter(col => selectedExportableColumns[col.key]);
  };
  
  const downloadFile = (blob: Blob, extension: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bookmeza_DataGrid_Export_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const formatValue = (value: any, type: ExportableColumn['type']) => {
    if (value === null || typeof value === 'undefined') return '';
    switch (type) {
      case 'boolean':
        return value ? TEXTS.yes : TEXTS.no;
      case 'currency':
        return typeof value === 'number' ? `₺${Number(value).toLocaleString('tr-TR')}` : String(value);
      case 'date':
        // Assuming value is already a string like 'dd.mm.yyyy' from SampleDataRow
        return String(value); 
      default:
        return String(value);
    }
  };

  const exportToCSV = async () => {
    const activeCols = getActiveExportColumns();
    const headers = activeCols.map(col => col.label);
    
    const rows = dataToExport.map(row => 
      activeCols.map(col => {
        const value = formatValue(row[col.key], col.type);
        return typeof value === 'string' && value.includes(exportOptions.delimiter) ? `"${value}"` : value;
      })
    );
    
    const csvContent = [
      exportOptions.includeHeaders ? headers.join(exportOptions.delimiter) : null,
      ...rows.map(row => row.join(exportOptions.delimiter))
    ].filter(Boolean).join('\n');
    
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, 'csv');
  };

  const exportToExcel = async () => {
    const activeCols = getActiveExportColumns();
    const headersHtml = activeCols.map(col => `<th style="background-color: #f0f0f0; border: 1px solid #ddd; padding: 8px; font-weight: bold;">${col.label}</th>`).join('');
    
    const rowsHtml = dataToExport.map(row => {
      const cells = activeCols.map(col => {
        const value = formatValue(row[col.key], col.type);
        return `<td style="border: 1px solid #ddd; padding: 8px;">${value || ''}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    
    const htmlTable = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bookmeza Export</title>
          <style> table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f0f0f0; font-weight: bold; } </style>
        </head>
        <body><table><thead><tr>${headersHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></body>
      </html>`;
    
    const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    downloadFile(blob, 'xls');
  };

  const exportToPDF = async () => {
    const activeCols = getActiveExportColumns();
    const headersHtml = activeCols.map(col => `<th style="border: 1px solid #333; padding: 10px; background-color: #f8f9fa; font-weight: bold; text-align: left; font-size: 10px;">${col.label}</th>`).join('');
    
    const rowsHtml = dataToExport.map(row => {
      const cells = activeCols.map(col => {
        const value = formatValue(row[col.key], col.type);
        return `<td style="border: 1px solid #ccc; padding: 6px; font-size: 9px;">${value || ''}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    
    const htmlContent = `
      <!DOCTYPE html><html><head><meta charset="utf-8"><title>Bookmeza Raporu</title>
      <style>body{font-family:Arial,sans-serif;margin:15px;} .header{text-align:center;margin-bottom:20px;} .title{font-size:20px;font-weight:bold;color:#333;margin-bottom:8px;} .subtitle{font-size:12px;color:#666;} table{width:100%;border-collapse:collapse;margin:15px 0;} .footer{margin-top:25px;text-align:center;font-size:10px;color:#666;}</style></head>
      <body><div class="header"><div class="title">Bookmeza Veri Raporu</div><div class="subtitle">Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')} | Toplam Kayıt: ${dataToExport.length}</div></div>
      <table><thead><tr>${headersHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>
      <div class="footer"><p>Bu rapor Bookmeza Data Grid sistemi tarafından oluşturulmuştur.</p></div></body></html>`;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      alert(TEXTS.popupBlocker || 'Lütfen popup engelleyiciyi devre dışı bırakın ve tekrar deneyin.');
    }
  };

  const exportToWord = async () => {
    const activeCols = getActiveExportColumns();
    const headersHtml = activeCols.map(col => `<th style="border: 1px solid #000; padding: 8px; background-color: #f0f0f0;">${col.label}</th>`).join('');
    
    const rowsHtml = dataToExport.map(row => {
      const cells = activeCols.map(col => {
        const value = formatValue(row[col.key], col.type);
        return `<td style="border: 1px solid #000; padding: 8px;">${value || ''}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    
    const wordContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"><title>Bookmeza Raporu</title>
      <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
      <style>body{font-family:Arial,sans-serif;} .header{text-align:center;margin-bottom:20px;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #000;padding:8px;} th{background-color:#f0f0f0;}</style></head>
      <body><div class="header"><h1>Bookmeza Veri Raporu</h1><p>Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')} | Toplam Kayıt: ${dataToExport.length}</p></div>
      <table><thead><tr>${headersHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
    
    const blob = new Blob([wordContent], { type: 'application/msword;charset=utf-8;' });
    downloadFile(blob, 'doc');
  };

  const handleInitiateExport = async () => {
    const currentActiveCols = getActiveExportColumns();
    if (currentActiveCols.length === 0) {
      alert(TEXTS.selectMinOneColumn || "Lütfen dışa aktarmak için en az bir sütun seçin.");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportMessage(TEXTS.exportStarting || 'Export başlatılıyor...');

    const progressSteps = [
      { progress: 20, message: TEXTS.exportPreparingData || 'Veriler hazırlanıyor...' },
      { progress: 50, message: TEXTS.exportConvertingFormat || 'Format dönüştürülüyor...' },
      { progress: 80, message: TEXTS.exportCreatingFile || 'Dosya oluşturuluyor...' },
      { progress: 100, message: TEXTS.exportCompleted || 'Export tamamlandı!' }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setExportProgress(step.progress);
      setExportMessage(step.message);
    }

    try {
      switch (exportFormat) {
        case 'csv': await exportToCSV(); break;
        case 'excel': await exportToExcel(); break;
        case 'pdf': await exportToPDF(); break;
        case 'word': await exportToWord(); break;
        default: throw new Error('Invalid export format');
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportMessage(TEXTS.exportError || 'Export sırasında hata oluştu!');
      setExportProgress(100); 
    }

    setTimeout(() => {
      setIsExporting(false);
      if (!(exportFormat === 'pdf' && exportProgress === 100 && exportMessage === (TEXTS.exportCompleted || 'Export tamamlandı!'))) {
         // onClose(); // Optionally close modal, or let user do it.
      }
      if (!exportMessage.includes('hata')) { // Don't reset if error
        setExportProgress(0);
        setExportMessage('');
      }
    }, exportMessage.includes('hata') ? 3000 : 1500);
  };

  const toggleColumnSelection = (columnKey: string) => {
    setSelectedExportableColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }));
  };

  const selectAllExportableColumns = () => {
    const allSelected: Record<string, boolean> = {};
    ALL_POSSIBLE_EXPORT_COLUMNS.forEach(col => allSelected[col.key] = true);
    setSelectedExportableColumns(allSelected);
  };

  const deselectAllExportableColumns = () => {
    const noneSelected: Record<string, boolean> = {};
    ALL_POSSIBLE_EXPORT_COLUMNS.forEach(col => noneSelected[col.key] = false);
    setSelectedExportableColumns(noneSelected);
  };

  const selectedColumnCount = Object.values(selectedExportableColumns).filter(Boolean).length;

  if (!isOpen) return null;

  return (
    <BookmezaModal 
      isOpen={isOpen} 
      onClose={() => { if (!isExporting) onClose(); }} 
      title={TEXTS.advancedExportOptions || "Gelişmiş Dışa Aktarma Seçenekleri"}
      size="xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-8">
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-slate-900 mb-3 text-base">1. {TEXTS.exportFormat || "Export Formatı"}</h3>
          <div className="space-y-2.5">
            {[
              { key: 'csv', label: 'CSV', icon: FileText, desc: TEXTS.csvDescription || 'Virgülle ayrılmış değerler' },
              { key: 'excel', label: 'Excel (XLS)', icon: FileSpreadsheet, desc: TEXTS.excelDescription || 'Microsoft Excel formatı' },
              { key: 'pdf', label: 'PDF', icon: File, desc: TEXTS.pdfDescription || 'Taşınabilir doküman formatı' },
              { key: 'word', label: 'Word (DOC)', icon: FileText, desc: TEXTS.wordDescription || 'Microsoft Word dokümanı' }
            ].map(format => (
              <label key={format.key} className={`flex items-center gap-3 p-3 border rounded-lg hover:border-indigo-400 cursor-pointer transition-all duration-200 ${exportFormat === format.key ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-300' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="exportFormat" value={format.key} checked={exportFormat === format.key} onChange={(e) => setExportFormat(e.target.value)} className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"/>
                <format.icon className={`h-5 w-5 ${exportFormat === format.key ? 'text-indigo-700' : 'text-slate-500'}`} />
                <div>
                  <div className={`font-medium ${exportFormat === format.key ? 'text-indigo-900' : 'text-slate-800'}`}>{format.label}</div>
                  <div className={`text-xs ${exportFormat === format.key ? 'text-indigo-700' : 'text-slate-500'}`}>{format.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 text-base">2. {TEXTS.columnSelection || "Sütun Seçimi"} ({selectedColumnCount}/{ALL_POSSIBLE_EXPORT_COLUMNS.length})</h3>
            <div className="flex gap-2">
              <BookmezaButton size="sm" variant="ghost" onClick={selectAllExportableColumns}>{TEXTS.selectAll || "Tümünü Seç"}</BookmezaButton>
              <BookmezaButton size="sm" variant="ghost" onClick={deselectAllExportableColumns}>{TEXTS.deselectAll || "Temizle"}</BookmezaButton>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50/30 custom-scrollbar" style={{scrollbarWidth: 'thin'}}>
            {ALL_POSSIBLE_EXPORT_COLUMNS.map(column => (
              <label key={column.key} className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded cursor-pointer">
                <input type="checkbox" checked={selectedExportableColumns[column.key] || false} onChange={() => toggleColumnSelection(column.key)} className="form-checkbox h-4 w-4 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"/>
                <span className="text-sm text-slate-700 select-none">{column.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-6">
              <h3 className="font-semibold text-slate-900 mb-3 text-base">3. {TEXTS.settings || "Ayarlar"}</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                  <input type="checkbox" checked={exportOptions.includeHeaders} onChange={(e) => setExportOptions(prev => ({...prev, includeHeaders: e.target.checked}))} className="form-checkbox h-4 w-4 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500"/>
                  <span className="text-sm text-slate-700 select-none">{TEXTS.includeHeaders || "Başlıkları dahil et"}</span>
                </label>
                {exportFormat === 'csv' && (
                  <div className="p-2">
                    <label htmlFor="csv-delimiter" className="block text-sm font-medium text-slate-700 mb-1">{TEXTS.csvDelimiter || "CSV Ayırıcı"}</label>
                    <select id="csv-delimiter" value={exportOptions.delimiter} onChange={(e) => setExportOptions(prev => ({...prev, delimiter: e.target.value}))} className="w-full sm:w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                      <option value=",">{TEXTS.comma || "Virgül (,)"}</option>
                      <option value=";">{TEXTS.semicolon || "Noktalı virgül (;)"}</option>
                      <option value="\t">{TEXTS.tab || "Tab"}</option>
                    </select>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3">
        <BookmezaButton variant="secondary" onClick={() => { if (!isExporting) onClose(); }} disabled={isExporting} className="sm:w-auto w-full">{TEXTS.cancel}</BookmezaButton>
        <BookmezaButton variant="success" icon={Download} onClick={handleInitiateExport} disabled={isExporting || selectedColumnCount === 0} fullWidth={false} className="sm:w-auto w-full">
          {isExporting ? (TEXTS.exporting || 'Dışa Aktarılıyor...') : `${TEXTS.export} (${exportFormat.toUpperCase()})`}
        </BookmezaButton>
      </div>
      <ExportProgress isVisible={isExporting} progress={exportProgress} message={exportMessage} />
    </BookmezaModal>
  );
};

export default BookmezaAdvancedExporter;
