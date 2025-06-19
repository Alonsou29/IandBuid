import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function TablaEmployee({ employees, setEmployees }) {
  const [filterText, setFilterText] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const filteredData = useMemo(() => {
    if (!filterText) return employees;
    const lowerFilter = filterText.toLowerCase();
    return employees.filter(item =>
      Object.values(item).some(
        val => val && val.toString().toLowerCase().includes(lowerFilter)
      )
    );
  }, [filterText, employees]);

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      center: true,
    },
    {
      name: 'Social ID',
      selector: row => row.social_id,
      sortable: true,
      center: true,
    },
    {
      name: 'State',
      selector: row => row.state,
      sortable: true,
      center: true,
    },
    {
      name: 'Available for Travel',
      selector: row => row.available_for_travel ? 'Yes' : 'No',
      sortable: true,
      center: true,
    },
    {
      name: 'Jobs Applied',
      selector: row => row.jobs_applied,
      sortable: false,
      center: true,
    },
    {
      name: 'Download Info',
      cell: row => (
        <button
          onClick={() => handleDownload(row)}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 transition text-sm"
        >
          Download
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    },
  ];

  const handleDownload = (row) => {
    // aqui pudiera ir una pagina de carga
    MySwal.fire({
      icon: 'info',
      title: 'Download',
      text: `Downloading info for ${row.name}... (placeholder)`,
    });
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#b91c1c',
        color: '#fef2f2',
        fontWeight: 'bold',
        fontSize: '14px',
        justifyContent: 'center',
      },
    },
    rows: {
      style: {
        fontSize: '14px',
        textAlign: 'center',
      },
      highlightOnHoverStyle: {
        backgroundColor: '#fee2e2',
        borderBottomColor: '#fca5a5',
        outline: '1px solid #b91c1c',
      },
    },
    pagination: {
      style: {
        fontSize: '12px'
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full flex flex-col">
      <div className="flex justify-between items-center border-b-4 border-red-700 pb-2">
      </div>

      <div className="mt-4 flex justify-start">
        <div className="mb-4 flex items-center bg-gray-100 rounded-full px-3 py-1 w-[280px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
          </svg>
          <input
            type="text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder="Buscar..."
            className="bg-gray-100 w-full text-sm focus:outline-none focus:ring-0 border-none ml-2"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        pointerOnHover
        customStyles={customStyles}
        persistTableHead
      />
    </div>
  );
}
