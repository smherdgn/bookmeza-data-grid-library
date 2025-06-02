import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Search, Filter, Download, Eye, Edit, Trash2, Plus,
  ArrowUpDown, ArrowUp, ArrowDown, X
} from 'lucide-react';
import { BookmezaDataGridProps, SampleDataRow, SortConfig, BookmezaColumn } from '../types';
import { TEXTS, DEFAULT_COLUMNS, PAGE_SIZES } from '../constants.tsx';
import BookmezaInput from './BookmezaInput';
import BookmezaButton from './BookmezaButton';
import BookmezaModal from './BookmezaModal';
import ConfirmDialog from './ConfirmDialog';
import AutoForm from './AutoForm';
import BookmezaAdvancedExporter from './BookmezaAdvancedExporter'; // Import the new advanced exporter

const BookmezaDataGrid: React.FC<BookmezaDataGridProps> = ({ 
  data = [],
  columnsConfig, 
  title = TEXTS.userManagementSystem,
  onEdit,
  onDelete,
  onAdd,
  onRowClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[1]);
  const [filters, setFilters] = useState<Partial<Record<keyof SampleDataRow, string>>>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const [detailData, setDetailData] = useState<SampleDataRow | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  const [deleteData, setDeleteData] = useState<SampleDataRow | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [showAdd, setShowAdd] = useState(false);
  
  const [editData, setEditData] = useState<SampleDataRow | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  
  const [isMobile, setIsMobile] = useState(false);
  const [showAdvancedExportModal, setShowAdvancedExportModal] = useState(false); // State for advanced export modal

  const columns = useMemo(() => columnsConfig || DEFAULT_COLUMNS, [columnsConfig]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(row =>
        columns.some(col => {
          if (col.searchable) {
            if (col.key === 'user') {
              return `${row.firstName} ${row.lastName} ${row.email}`.toLowerCase().includes(lowerSearchTerm);
            }
            const value = row[col.key as keyof SampleDataRow];
            return String(value).toLowerCase().includes(lowerSearchTerm);
          }
          return false;
        }) || `${row.firstName} ${row.lastName} ${row.email} ${row.department}`.toLowerCase().includes(lowerSearchTerm)
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        result = result.filter(row => 
          String(row[key as keyof SampleDataRow]).toLowerCase().includes(String(value).toLowerCase())
        );
      }
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof SampleDataRow];
        let bVal: any = b[sortConfig.key as keyof SampleDataRow];
        
        if (sortConfig.key === 'user') {
          aVal = `${a.firstName} ${a.lastName}`;
          bVal = `${b.firstName} ${b.lastName}`;
        }
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, searchTerm, filters, sortConfig, columns]);

  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = processedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: keyof SampleDataRow | 'user') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: number, e?: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRows(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };
  
  const renderCell = useCallback((row: SampleDataRow, column: BookmezaColumn) => {
    const value = row[column.key as keyof SampleDataRow];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    switch (column.type) {
      case 'badge':
        const badgeColors: Record<string, string> = {
          'Aktif': 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20',
          'Pasif': 'bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20',
          'Beklemede': 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20'
        };
        return (
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${badgeColors[value as string] || 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20'}`}>
            {value as string}
          </span>
        );
      
      case 'boolean':
        return (
          <div className="flex items-center">
            <div className={`w-2.5 h-2.5 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="ml-2 text-sm text-slate-600">{value ? TEXTS.yes : TEXTS.no}</span>
          </div>
        );
      
      case 'number':
        return <span className="font-mono text-sm text-slate-700">{value as number}</span>;
      
      default:
        return <span className="text-sm text-slate-700">{String(value)}</span>;
    }
  }, []);

  const getUniqueFilterValues = useCallback((columnKey: keyof SampleDataRow) => {
    return [...new Set(data.map(row => row[columnKey]))].filter(Boolean).sort();
  }, [data]);

  const filterableColumns = useMemo(() => columns.filter(col => col.filterable && (col.key !== 'user' && col.key !== 'actions')), [columns]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-xl border border-slate-200/80 overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-200/80 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">{title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {processedData.length} {TEXTS.recordsFound}
                {selectedRows.size > 0 && `, ${selectedRows.size} ${TEXTS.selected}`}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-3">
              <BookmezaInput
                placeholder={TEXTS.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}}
                icon={Search}
                className="w-full sm:w-auto lg:w-64"
              />
              
              {filterableColumns.length > 0 && (
                <BookmezaButton
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={Filter}
                  aria-expanded={showFilters}
                >
                  {TEXTS.filters}
                </BookmezaButton>
              )}
              
              <BookmezaButton
                variant="secondary"
                onClick={() => setShowAdvancedExportModal(true)} // Open advanced export modal
                icon={Download}
              >
                {TEXTS.export}
              </BookmezaButton>
              
              {onAdd && (
                <BookmezaButton
                  variant="primary"
                  onClick={() => { setEditData(null); setShowAdd(true);}}
                  icon={Plus}
                >
                  {TEXTS.addNew}
                </BookmezaButton>
              )}
            </div>
          </div>

          {showFilters && filterableColumns.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(filterableColumns.length + 1, 4)} gap-4`}>
                {filterableColumns.map(col => (
                  <div key={col.key}>
                    <label htmlFor={`filter-${col.key}`} className="block text-xs font-medium text-slate-700 mb-1">{col.label}</label>
                    <select
                      id={`filter-${col.key}`}
                      value={filters[col.key as keyof SampleDataRow] || ''}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, [col.key]: e.target.value }));
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-400"
                    >
                      <option value="">{TEXTS.all}</option>
                      {getUniqueFilterValues(col.key as keyof SampleDataRow).map(value => (
                        <option key={String(value)} value={String(value)}>{String(value)}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="flex items-end">
                  <BookmezaButton
                    variant="ghost"
                    onClick={() => { setFilters({}); setCurrentPage(1);}}
                    className="w-full"
                  >
                    {TEXTS.clear}
                  </BookmezaButton>
                </div>
              </div>
            </div>
          )}
        </div>

        {processedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Search className="h-16 w-16 text-slate-300 mb-4" strokeWidth={1.5} />
            <p className="text-lg font-medium">{TEXTS.noDataFound}</p>
            <p className="text-sm text-slate-400">Filtrelerinizi değiştirmeyi veya yeni kayıt eklemeyi deneyin.</p>
          </div>
        ) : (
          <>
            {isMobile ? (
              <div className="p-2 sm:p-4 space-y-3">
                {paginatedData.map((row) => (
                  <div
                    key={row.id}
                    className="bg-white border border-slate-200/80 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img src={row.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <h3 className="font-semibold text-slate-900">{row.firstName} {row.lastName}</h3>
                          <p className="text-xs text-slate-500">{row.email}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        aria-label={`Select row ${row.id}`}
                        checked={selectedRows.has(row.id)}
                        onChange={(e) => handleSelectRow(row.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="form-checkbox h-5 w-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                      {columns.filter(c => c.key !== 'id' && c.key !== 'user' && c.key !== 'actions' && c.key !== 'avatar').slice(0,4).map(col => (
                         <div key={`mobile-${row.id}-${col.key}`}>
                           <span className="text-slate-500 text-xs">{col.label}: </span> 
                           {renderCell(row, col)}
                         </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 pt-3 border-t border-slate-200/80">
                      <BookmezaButton size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setDetailData(row); setShowDetail(true);}} icon={Eye} className="flex-1">{TEXTS.view}</BookmezaButton>
                      {onEdit && <BookmezaButton size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setEditData(row); setShowEdit(true);}} icon={Edit} className="flex-1">{TEXTS.edit}</BookmezaButton>}
                      {onDelete && <BookmezaButton size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); setDeleteData(row); setShowDeleteConfirm(true);}} icon={Trash2} className="flex-1">{TEXTS.delete}</BookmezaButton>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-slate-50/70">
                    <tr>
                      <th className="w-12 px-4 sm:px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          aria-label="Select all rows on current page"
                          checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                          onChange={handleSelectAll}
                          className="form-checkbox h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                      </th>
                      {columns.map(column => (
                        <th key={column.key} className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider" style={{ width: column.width }}>
                          <div className="flex items-center gap-1">
                            <span>{column.label}</span>
                            {column.sortable && (
                              <button
                                onClick={() => handleSort(column.key as keyof SampleDataRow | 'user')}
                                className="text-slate-400 hover:text-slate-700 transition-colors"
                                aria-label={`Sort by ${column.label}`}
                              >
                                {sortConfig.key === column.key ? (
                                  sortConfig.direction === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                                ) : (
                                  <ArrowUpDown className="h-3.5 w-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="w-32 px-4 sm:px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">{TEXTS.actions}</th>
                    </tr>
                  </thead>
                  
                  <tbody className="bg-white divide-y divide-slate-200/80">
                    {paginatedData.map((row) => (
                      <tr
                        key={row.id}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                        className={`hover:bg-slate-50/70 transition-colors group ${selectedRows.has(row.id) ? 'bg-indigo-50/50' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
                      >
                        <td className="px-4 sm:px-6 py-3.5">
                          <input
                            type="checkbox"
                            aria-label={`Select row ${row.id}`}
                            checked={selectedRows.has(row.id)}
                            onChange={(e) => handleSelectRow(row.id, e)}
                            onClick={(e) => e.stopPropagation()}
                            className="form-checkbox h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                          />
                        </td>
                        
                        {columns.map(column => (
                          <td key={column.key} className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                            {renderCell(row, column)}
                          </td>
                        ))}
                        
                        <td className="px-4 sm:px-6 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); setDetailData(row); setShowDetail(true);}} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100/70 rounded-md transition-colors" title={TEXTS.view}><Eye className="h-4 w-4" /></button>
                            {onEdit && <button onClick={(e) => { e.stopPropagation(); setEditData(row); setShowEdit(true);}} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100/70 rounded-md transition-colors" title={TEXTS.edit}><Edit className="h-4 w-4" /></button>}
                            {onDelete && <button onClick={(e) => { e.stopPropagation(); setDeleteData(row); setShowDeleteConfirm(true);}} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-100/70 rounded-md transition-colors" title={TEXTS.delete}><Trash2 className="h-4 w-4" /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {totalPages > 1 && (
          <div className="bg-slate-50/50 border-t border-slate-200/80 px-4 sm:px-6 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-700">{TEXTS.rowsPerPage}</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1);}}
                  className="px-2 py-1 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  aria-label={TEXTS.rowsPerPage}
                >
                  {PAGE_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                 <span className="text-xs text-slate-700">
                  {startIndex + 1}-{Math.min(startIndex + pageSize, processedData.length)} {TEXTS.of} {processedData.length}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <BookmezaButton variant="ghost" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} icon={ChevronLeft} aria-label="Previous Page"><></></BookmezaButton>
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 3) pageNum = i + 1;
                    else if (currentPage <= 2) pageNum = i + 1;
                    else if (currentPage >= totalPages - 1) pageNum = totalPages - (3 - 1) + i;
                    else pageNum = currentPage - 1 + i;
                    if(pageNum > totalPages || pageNum < 1) return null;
                    return (
                      <BookmezaButton key={pageNum} variant={currentPage === pageNum ? "primary" : "ghost"} size="sm" onClick={() => setCurrentPage(pageNum)}>{pageNum}</BookmezaButton>
                    );
                  })}

                {totalPages > 3 && currentPage < totalPages - 2 && <span className="text-slate-500">...</span>}
                {totalPages > 3 && currentPage < totalPages -1 && currentPage > 2 && <BookmezaButton variant={currentPage === totalPages ? "primary" : "ghost"} size="sm" onClick={() => setCurrentPage(totalPages)}>{totalPages}</BookmezaButton>}
                
                <BookmezaButton variant="ghost" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} icon={ChevronRight} aria-label="Next Page"><></></BookmezaButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {onAdd && <BookmezaModal isOpen={showAdd} onClose={() => setShowAdd(false)} title={TEXTS.addNew} size="lg">
        <AutoForm onSave={(newData) => { onAdd(newData); setShowAdd(false);}} onCancel={() => setShowAdd(false)} mode="add" />
      </BookmezaModal>}

      {onEdit && <BookmezaModal isOpen={showEdit} onClose={() => {setShowEdit(false); setEditData(null);}} title={TEXTS.edit + (editData ? ` - ${editData.firstName} ${editData.lastName}` : '')} size="lg">
        <AutoForm data={editData} onSave={(updatedData) => { onEdit(updatedData); setShowEdit(false); setEditData(null);}} onCancel={() => {setShowEdit(false); setEditData(null);}} mode="edit" />
      </BookmezaModal>}

      <BookmezaModal isOpen={showDetail} onClose={() => setShowDetail(false)} title={TEXTS.view + (detailData ? ` - ${detailData.firstName} ${detailData.lastName}` : '')} size="lg">
        {detailData && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg">
              <img src={detailData.avatar} alt="Avatar" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white shadow-md object-cover" />
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold text-slate-900">{detailData.firstName} {detailData.lastName}</h3>
                <p className="text-slate-600">{detailData.email}</p>
                <div className="mt-1">{renderCell(detailData, { key: 'status', label: TEXTS.status, type: 'badge' })}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {[
                { label: TEXTS.department, value: detailData.department },
                { label: TEXTS.status, value: renderCell(detailData, {key: 'status', label: TEXTS.status, type: 'badge'}) },
                { label: "Telefon", value: detailData.phone || '-' },
                { label: "Şehir", value: detailData.city || '-' },
                { label: "Puan", value: renderCell(detailData, {key: 'score', label: 'Puan', render: DEFAULT_COLUMNS.find(c=>c.key==='score')?.render! } )},
                { label: "Maaş", value: detailData.salary.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) },
                { label: "Katılım Tarihi", value: detailData.joinDate },
                { label: "Aktif", value: renderCell(detailData, {key: 'isActive', label: 'Aktif', type: 'boolean'}) },
              ].map(item => (
                <div key={item.label} className="bg-slate-50/70 p-3 rounded-md border border-slate-200/80">
                  <div className="text-xs font-medium text-slate-500 mb-0.5">{item.label}</div>
                  <div className="text-slate-800">{item.value}</div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-slate-200/80">
              <BookmezaButton variant="secondary" onClick={() => setShowDetail(false)} className="flex-1">{TEXTS.close}</BookmezaButton>
              {onEdit && <BookmezaButton variant="primary" onClick={() => { setShowDetail(false); setEditData(detailData); setShowEdit(true);}} icon={Edit} className="flex-1">{TEXTS.edit}</BookmezaButton>}
            </div>
          </div>
        )}
      </BookmezaModal>

      {deleteData && <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => { if (deleteData) { onDelete?.(deleteData); setDeleteData(null);}}}
        title={TEXTS.confirmDeleteTitle(`${deleteData.firstName} ${deleteData.lastName}`)}
        message={TEXTS.confirmDeleteMessage(`${deleteData.firstName} ${deleteData.lastName}`)}
      />}

      {/* Advanced Export Modal */}
      <BookmezaAdvancedExporter 
        isOpen={showAdvancedExportModal}
        onClose={() => setShowAdvancedExportModal(false)}
        dataToExport={processedData} // Pass filtered and sorted data
        gridColumnsDisplayed={columns} // Pass current grid column configuration
      />
    </>
  );
};

export default BookmezaDataGrid;
