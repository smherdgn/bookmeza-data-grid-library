
import React, { useState, useMemo } from 'react';
import { 
  Download, 
  FileText, 
  File, 
  FileSpreadsheet,
  Settings,
  Filter,
  Eye,
  Check,
  X,
  Calendar,
  Users,
  BarChart3,
  Printer,
  Share2,
  Copy
} from 'lucide-react';

// Örnek veri
const generateSampleData = (count = 50) => {
  const statuses = ['Aktif', 'Pasif', 'Beklemede'];
  const departments = ['Yazılım', 'Pazarlama', 'Satış', 'İK', 'Finans'];
  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];
  const firstNames = ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Elif'];
  const lastNames = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: `user${i + 1}@bookmeza.com`,
    phone: `+90 5${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    score: Math.floor(Math.random() * 100),
    salary: Math.floor(Math.random() * 10000) + 5000,
    joinDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('tr-TR'),
    isActive: Math.random() > 0.3
  }));
};

// Bookmeza Button Komponenti (Lokal)
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
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  icon?: typeof Download; // Made icon optional and typed specifically
  className?: string;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> // Allow other standard button props
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

// Modal Komponenti
const BookmezaModal = ({ isOpen, onClose, title, children, size = 'md' }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className={`relative bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full`}>
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

// Export Progress Komponenti
const ExportProgress = ({ isVisible, progress, message }: {
  isVisible: boolean;
  progress: number;
  message: string;
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
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

// Ana Export Sistemi
const BookmezaExportSystem = () => {
  const [sampleData] = useState(generateSampleData(100));
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({});
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportOptions, setExportOptions] = useState({
    includeHeaders: true,
    dateFormat: 'dd/mm/yyyy',
    encoding: 'utf-8',
    delimiter: ',',
    includeFilters: false,
    selectedRowsOnly: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportMessage, setExportMessage] = useState('');

  // Columns definition
  const availableColumns = useMemo(() => [
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
  ], []);

  // Initialize selected columns
  React.useEffect(() => {
    const initialSelection: Record<string, boolean> = {};
    availableColumns.forEach(col => {
      initialSelection[col.key] = true;
    });
    setSelectedColumns(initialSelection);
  }, [availableColumns]);

  // Export functions
  const exportToCSV = async () => {
    const selectedCols = availableColumns.filter(col => selectedColumns[col.key]);
    const headers = selectedCols.map(col => col.label);
    
    const rows = sampleData.map(row => 
      selectedCols.map(col => {
        let value = (row as any)[col.key];
        if (col.type === 'boolean') {
          value = value ? 'Evet' : 'Hayır';
        } else if (col.type === 'currency') {
          value = value ? `₺${Number(value).toLocaleString('tr-TR')}` : value;
        }
        return typeof value === 'string' && value.includes(exportOptions.delimiter) ? `"${value}"` : value;
      })
    );
    
    const csvContent = [
      exportOptions.includeHeaders ? headers.join(exportOptions.delimiter) : null,
      ...rows.map(row => row.join(exportOptions.delimiter))
    ].filter(Boolean).join('\n');
    
    const BOM = '\uFEFF'; // UTF-8 BOM for Turkish characters
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, 'csv');
  };

  const exportToExcel = async () => {
    const selectedCols = availableColumns.filter(col => selectedColumns[col.key]);
    const headers = selectedCols.map(col => `<th style="background-color: #f0f0f0; border: 1px solid #ddd; padding: 8px; font-weight: bold;">${col.label}</th>`).join('');
    
    const rows = sampleData.map(row => {
      const cells = selectedCols.map(col => {
        let value = (row as any)[col.key];
        if (col.type === 'boolean') {
          value = value ? 'Evet' : 'Hayır';
        } else if (col.type === 'currency') {
          value = value ? Number(value).toLocaleString('tr-TR') : value;
        }
        return `<td style="border: 1px solid #ddd; padding: 8px;">${value || ''}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    
    const htmlTable = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bookmeza Export</title>
          <style>
            table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f0f0f0; font-weight: bold; }
          </style>
        </head>
        <body>
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    downloadFile(blob, 'xls');
  };

  const exportToPDF = async () => {
    const selectedCols = availableColumns.filter(col => selectedColumns[col.key]);
    const headers = selectedCols.map(col => `<th style="border: 1px solid #333; padding: 12px; background-color: #f8f9fa; font-weight: bold; text-align: left;">${col.label}</th>`).join('');
    
    const rows = sampleData.map(row => {
      const cells = selectedCols.map(col => {
        let value = (row as any)[col.key];
        if (col.type === 'boolean') {
          value = value ? 'Evet' : 'Hayır';
        } else if (col.type === 'currency') {
          value = value ? `₺${Number(value).toLocaleString('tr-TR')}` : value;
        }
        return `<td style="border: 1px solid #333; padding: 8px; font-size: 12px;">${value || ''}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bookmeza Rapor</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
            .subtitle { font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Bookmeza Veri Raporu</div>
            <div class="subtitle">Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}</div>
            <div class="subtitle">Toplam Kayıt: ${sampleData.length}</div>
          </div>
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="footer">
            <p>Bu rapor Bookmeza Data Grid sistemi tarafından oluşturulmuştur.</p>
          </div>
        </body>
      </html>
    `;
    
    // PDF için print dialog aç
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus(); // For some browsers
      printWindow.print();
      // Consider closing the window after print, but it can be tricky:
      // printWindow.onafterprint = () => printWindow.close(); 
    } else {
      alert('Lütfen popup engelleyiciyi devre dışı bırakın ve tekrar deneyin.');
    }
  };

  const exportToWord = async () => {
    const selectedCols = availableColumns.filter(col => selectedColumns[col.key]);
    const headers = selectedCols.map(col => `<th style="border: 1px solid #000; padding: 8px; background-color: #f0f0f0;">${col.label}</th>`).join('');
    
    const rows = sampleData.map(row => {
      const cells = selectedCols.map(col => {
        let value = (row as any)[col.key];
        if (col.type === 'boolean') {
          value = value ? 'Evet' : 'Hayır';
        } else if (col.type === 'currency') {
          value = value ? `₺${Number(value).toLocaleString('tr-TR')}` : value;
        }
        return `<td style="border: 1px solid #000; padding: 8px;">${value || ''}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    
    const wordContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>Bookmeza Rapor</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>90</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 8px; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bookmeza Veri Raporu</h1>
            <p>Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}</p>
            <p>Toplam Kayıt: ${sampleData.length}</p>
          </div>
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;
    
    const blob = new Blob([wordContent], { type: 'application/msword;charset=utf-8;' });
    downloadFile(blob, 'doc');
  };

  const downloadFile = (blob: Blob, extension: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bookmeza_Export_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (selectedCount === 0) {
      alert("Lütfen dışa aktarmak için en az bir sütun seçin.");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportMessage('Export başlatılıyor...');

    // Progress simulation
    const progressSteps = [
      { progress: 20, message: 'Veriler hazırlanıyor...' },
      { progress: 50, message: 'Format dönüştürülüyor...' },
      { progress: 80, message: 'Dosya oluşturuluyor...' },
      { progress: 100, message: 'Export tamamlandı!' }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Shorter delay
      setExportProgress(step.progress);
      setExportMessage(step.message);
    }

    try {
      switch (exportFormat) {
        case 'csv':
          await exportToCSV();
          break;
        case 'excel':
          await exportToExcel();
          break;
        case 'pdf':
          await exportToPDF();
          break;
        case 'word':
          await exportToWord();
          break;
        default:
          setExportMessage('Geçersiz export formatı!');
          await exportToCSV(); // Fallback
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportMessage('Export sırasında hata oluştu!');
      setExportProgress(100); // Ensure bar is full on error message for visibility
    }

    setTimeout(() => {
      setIsExporting(false);
      if(! (exportFormat === 'pdf' && exportProgress === 100 && exportMessage === 'Export tamamlandı!')) {
        // Don't hide modal immediately for PDF if print dialog is open
         setShowExportModal(false);
      }
      // Reset progress unless it's a specific error message we want to keep
      if (exportMessage !== 'Export sırasında hata oluştu!' && exportMessage !== 'Geçersiz export formatı!') {
        setExportProgress(0);
        setExportMessage('');
      }
    }, exportMessage.includes('hata') || exportMessage.includes('Geçersiz') ? 3000 : 1500); // Longer for error messages
  };

  const toggleColumnSelection = (columnKey: string) => {
    setSelectedColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const selectAllColumns = () => {
    const allSelected: Record<string, boolean> = {};
    availableColumns.forEach(col => {
      allSelected[col.key] = true;
    });
    setSelectedColumns(allSelected);
  };

  const deselectAllColumns = () => {
    const noneSelected: Record<string, boolean> = {};
    availableColumns.forEach(col => {
      noneSelected[col.key] = false;
    });
    setSelectedColumns(noneSelected);
  };

  const selectedCount = Object.values(selectedColumns).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 lg:p-8 antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-4">
            Bookmeza Export System
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Gelişmiş dışa aktarma sistemi - CSV, Excel, PDF, Word desteği
          </p>
        </div>

        {/* Export Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{sampleData.length}</div>
                <div className="text-sm text-slate-500">Toplam Kayıt</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{availableColumns.length}</div>
                <div className="text-sm text-slate-500">Toplam Sütun</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">4</div>
                <div className="text-sm text-slate-500">Export Formatı</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{new Date().toLocaleDateString('tr-TR')}</div>
                <div className="text-sm text-slate-500">Bugünün Tarihi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Export Trigger */}
        <div className="text-center">
            <BookmezaButton 
                variant="primary" 
                size="lg" 
                icon={Download} 
                onClick={() => setShowExportModal(true)}
                className="shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
                Verileri Dışa Aktar
            </BookmezaButton>
        </div>
        
        {/* Export Modal */}
        <BookmezaModal 
          isOpen={showExportModal} 
          onClose={() => { if (!isExporting) setShowExportModal(false); }} 
          title="Dışa Aktarma Seçenekleri" 
          size="xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-8">
            {/* Format Selection */}
            <div className="lg:col-span-1">
              <h3 className="font-semibold text-slate-900 mb-3 text-base">1. Export Formatı</h3>
              <div className="space-y-2.5">
                {[
                  { key: 'csv', label: 'CSV', icon: FileText, desc: 'Virgülle ayrılmış değerler' },
                  { key: 'excel', label: 'Excel (XLS)', icon: FileSpreadsheet, desc: 'Microsoft Excel formatı' },
                  { key: 'pdf', label: 'PDF', icon: File, desc: 'Taşınabilir doküman formatı' },
                  { key: 'word', label: 'Word (DOC)', icon: FileText, desc: 'Microsoft Word dokümanı' }
                ].map(format => (
                  <label key={format.key} className={`flex items-center gap-3 p-3 border rounded-lg hover:border-indigo-400 cursor-pointer transition-all duration-200 ${exportFormat === format.key ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-300' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="radio"
                      name="exportFormat"
                      value={format.key}
                      checked={exportFormat === format.key}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <format.icon className={`h-5 w-5 ${exportFormat === format.key ? 'text-indigo-700' : 'text-slate-500'}`} />
                    <div>
                      <div className={`font-medium ${exportFormat === format.key ? 'text-indigo-900' : 'text-slate-800'}`}>{format.label}</div>
                      <div className={`text-xs ${exportFormat === format.key ? 'text-indigo-700' : 'text-slate-500'}`}>{format.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Column Selection */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 text-base">2. Sütun Seçimi ({selectedCount}/{availableColumns.length})</h3>
                <div className="flex gap-2">
                  <BookmezaButton size="sm" variant="ghost" onClick={selectAllColumns}>Tümünü Seç</BookmezaButton>
                  <BookmezaButton size="sm" variant="ghost" onClick={deselectAllColumns}>Temizle</BookmezaButton>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50/30 custom-scrollbar">
                {availableColumns.map(column => (
                  <label key={column.key} className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColumns[column.key] || false}
                      onChange={() => toggleColumnSelection(column.key)}
                      className="form-checkbox h-4 w-4 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-slate-700 select-none">{column.label}</span>
                  </label>
                ))}
              </div>

              {/* Export Settings */}
              <div className="mt-6">
                  <h3 className="font-semibold text-slate-900 mb-3 text-base">3. Ayarlar</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeHeaders}
                        onChange={(e) => setExportOptions(prev => ({...prev, includeHeaders: e.target.checked}))}
                        className="form-checkbox h-4 w-4 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700 select-none">Başlıkları dahil et</span>
                    </label>

                    {/* Placeholder for future options like selected rows only
                    <label className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer opacity-50">
                      <input
                        type="checkbox"
                        checked={exportOptions.selectedRowsOnly}
                        disabled 
                        onChange={(e) => setExportOptions(prev => ({...prev, selectedRowsOnly: e.target.checked}))}
                        className="form-checkbox h-4 w-4 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700 select-none">Sadece seçili satırlar (yakında)</span>
                    </label>
                    */}

                    {exportFormat === 'csv' && (
                      <div className="p-2">
                        <label htmlFor="csv-delimiter" className="block text-sm font-medium text-slate-700 mb-1">CSV Ayırıcı</label>
                        <select
                          id="csv-delimiter"
                          value={exportOptions.delimiter}
                          onChange={(e) => setExportOptions(prev => ({...prev, delimiter: e.target.value}))}
                          className="w-full sm:w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                          <option value=",">Virgül (,)</option>
                          <option value=";">Noktalı virgül (;)</option>
                          <option value="\t">Tab</option>
                        </select>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3">
            <BookmezaButton 
                variant="secondary" 
                onClick={() => { if (!isExporting) setShowExportModal(false); }}
                disabled={isExporting}
                className="sm:w-auto w-full"
            >
                İptal
            </BookmezaButton>
            <BookmezaButton 
                variant="success" 
                icon={Download} 
                onClick={handleExport}
                disabled={isExporting || selectedCount === 0}
                fullWidth={false}
                className="sm:w-auto w-full"
            >
                {isExporting ? 'Dışa Aktarılıyor...' : `Dışa Aktar (${exportFormat.toUpperCase()})`}
            </BookmezaButton>
          </div>
        </BookmezaModal>

        <ExportProgress isVisible={isExporting} progress={exportProgress} message={exportMessage} />

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Bookmeza Solutions. Tüm hakları saklıdır.</p>
          <p>React, TypeScript ve Tailwind CSS ile geliştirildi.</p>
        </footer>
      </div>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1; /* slate-300 */
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8; /* slate-500 */
          }
          /* For Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f1f1;
          }
        `}
      </style>
    </div>
  );
};

export default BookmezaExportSystem;
