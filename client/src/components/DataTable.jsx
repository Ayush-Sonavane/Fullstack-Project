import { useState } from 'react';
import { HiOutlineChevronUp, HiOutlineChevronDown, HiOutlineSelector } from 'react-icons/hi';

/**
 * Reusable sortable data table component.
 * Columns: [{ key, label, sortable?, render? }]
 */
const DataTable = ({ columns, data, onRowClick, emptyMessage = 'No data found.' }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ASC' });

  const handleSort = (key) => {
    const column = columns.find((c) => c.key === key);
    if (!column?.sortable) return;

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  // Sort data locally
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key] ?? '';
    const bVal = b[sortConfig.key] ?? '';

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortConfig.direction === 'ASC' ? aVal - bVal : bVal - aVal;
    }

    const compare = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' });
    return sortConfig.direction === 'ASC' ? compare : -compare;
  });

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <HiOutlineSelector className="w-3.5 h-3.5 text-surface-400 group-hover:text-surface-600 transition-colors" />;
    }
    return sortConfig.direction === 'ASC'
      ? <HiOutlineChevronUp className="w-3.5 h-3.5 text-primary-600" />
      : <HiOutlineChevronDown className="w-3.5 h-3.5 text-primary-600" />;
  };

  if (data.length === 0) {
    return (
      <div className="glass-card-static p-16 text-center border-dashed border-2 border-surface-200">
        <p className="text-surface-400 text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="data-table-container overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`
                    ${col.sortable ? 'sortable group' : ''} 
                    ${sortConfig.key === col.key ? 'sorted' : ''}
                  `}
                >
                  <div className="flex items-center gap-1.5 select-none">
                    <span>{col.label}</span>
                    {col.sortable && <SortIcon columnKey={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick?.(row)}
                className={`
                  ${onRowClick ? 'cursor-pointer hover:bg-primary-50/50' : ''}
                  transition-colors duration-150
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-4 px-6 border-b border-surface-100">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
