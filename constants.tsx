import React from 'react'; // Required for JSX in render functions
import { BookmezaColumn, SampleDataRow } from './types'; 

export const TEXTS = {
  searchPlaceholder: "Ara...",
  filters: "Filtreler",
  export: "Dışa Aktar",
  addNew: "Yeni Ekle",
  recordsFound: "kayıt bulundu",
  selected: "seçili",
  noDataFound: "Veri bulunamadı",
  view: "Görüntüle",
  edit: "Düzenle",
  delete: "Sil",
  actions: "İşlemler",
  close: "Kapat",
  cancel: "İptal",
  save: "Kaydet",
  yes: "Evet",
  no: "Hayır",
  all: "Tümü",
  clear: "Temizle",
  rowsPerPage: "Sayfa başına:",
  of: "/",
  confirmDeleteTitle: (name: string) => `${TEXTS.delete} - ${name}`,
  confirmDeleteMessage: (name: string) => `${name} kaydını silmek istediğinizden emin misiniz?`,
  userManagementSystem: "Çalışan Yönetim Sistemi",
  dataGridTitle: "Bookmeza Data Grid",
  dataGridDescription: "Modern, responsive ve tam özellikli React data grid komponenti",
  featureFull: "Tam Özellikli",
  featureFullDesc: "CRUD işlemleri, arama, filtreleme, sıralama",
  featureAutoForms: "Otomatik Formlar",
  featureAutoFormsDesc: "Add ve Edit formları otomatik çalışıyor",
  featureResponsive: "Responsive",
  featureResponsiveDesc: "Mobil ve desktop için optimize",
  // Updated featureCSV to reflect advanced export
  featureCSV: "Gelişmiş Dışa Aktarma", 
  featureCSVDesc: "CSV, Excel, PDF, Word formatlarında dışa aktarma",
  usageTitle: "Basit Kullanım",
  department: "Departman",
  status: "Durum",

  // New texts for Advanced Exporter
  advancedExportOptions: "Gelişmiş Dışa Aktarma Seçenekleri",
  exportFormat: "Export Formatı",
  columnSelection: "Sütun Seçimi",
  selectAll: "Tümünü Seç",
  deselectAll: "Temizle",
  settings: "Ayarlar",
  includeHeaders: "Başlıkları dahil et",
  csvDelimiter: "CSV Ayırıcı",
  comma: "Virgül (,)",
  semicolon: "Noktalı virgül (;)",
  tab: "Tab",
  exporting: "Dışa Aktarılıyor...",
  exportStarting: "Export başlatılıyor...",
  exportPreparingData: "Veriler hazırlanıyor...",
  exportConvertingFormat: "Format dönüştürülüyor...",
  exportCreatingFile: "Dosya oluşturuluyor...",
  exportCompleted: "Export tamamlandı!",
  exportError: "Export sırasında hata oluştu!",
  popupBlocker: "Lütfen popup engelleyiciyi devre dışı bırakın ve tekrar deneyin.",
  selectMinOneColumn: "Lütfen dışa aktarmak için en az bir sütun seçin.",
  csvDescription: 'Virgülle ayrılmış değerler',
  excelDescription: 'Microsoft Excel formatı',
  pdfDescription: 'Taşınabilir doküman formatı',
  wordDescription: 'Microsoft Word dokümanı',
};

export const STATUSES = ['Aktif', 'Pasif', 'Beklemede'];
export const DEPARTMENTS = ['Yazılım', 'Pazarlama', 'Satış', 'İK', 'Finans'];
export const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];
export const FIRST_NAMES = ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Elif'];
export const LAST_NAMES = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik'];

export const PAGE_SIZES = [5, 10, 25, 50];

export const DEFAULT_COLUMNS: BookmezaColumn[] = [
  { 
    key: 'id', 
    label: 'ID', 
    type: 'number', 
    sortable: true, 
    width: '80px'
  },
  { 
    key: 'user', 
    label: 'Kullanıcı', 
    sortable: true, 
    searchable: true,
    render: (value: any, row: SampleDataRow): React.ReactNode => (
      <div className="flex items-center gap-3">
        <img src={row.avatar} alt={`${row.firstName} ${row.lastName} avatar`} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
        <div>
          <div className="font-medium text-slate-900">{row.firstName} {row.lastName}</div>
          <div className="text-xs text-slate-500">{row.email}</div>
        </div>
      </div>
    )
  },
  { 
    key: 'department', 
    label: 'Departman', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'status', 
    label: 'Durum', 
    type: 'badge', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'score', 
    label: 'Puan', 
    sortable: true,
    render: (value: number): React.ReactNode => (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-slate-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: `${value}%` }} />
        </div>
        <span className="text-xs font-medium text-slate-600">{value}</span>
      </div>
    )
  },
  { 
    key: 'isActive', 
    label: 'Aktif', 
    type: 'boolean', 
    sortable: true
  }
];
