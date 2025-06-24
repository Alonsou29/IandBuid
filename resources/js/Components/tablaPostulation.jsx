import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

export default function TablePostulation({ occupationId, occupationName }) {
  const [applicants, setApplicants] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`/postu/${occupationId}`);
        setApplicants(response.data.Employees || []);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setLoading(false);
      }
    };

    if (occupationId) {
      fetchApplicants();
    }
  }, [occupationId]);

  const filteredApplicants = useMemo(() => {
    if (!filterText) return applicants;
    const lower = filterText.toLowerCase();
    return applicants.filter(applicant =>
      Object.values(applicant).some(val =>
        val?.toString().toLowerCase().includes(lower)
      )
    );
  }, [filterText, applicants]);

  const availableTravelText = (val) => {
    if (val === 1) return 'Yes';
    if (val === 0) return 'No';
    return 'N/A';
  };

  const handleDownloadCertificate = (applicant) => {
    alert(`Downloading certificates for ${applicant.name} ${applicant.lastname}`);
  };

  const handleDownloadResume = (applicant) => {
    alert(`Downloading resume for ${applicant.name} ${applicant.lastname}`);
  };

  const handleDownloadContract = (applicant) => {
    alert(`Downloading contract for ${applicant.name} ${applicant.lastname}`);
  };

  const columns = [
    {
      name: 'ID',
      selector: row => row.social_id,
      sortable: true,
      center: true,
      minWidth: '60px',
      wrap: true,
    },
    {
      name: 'Name',
      selector: row => `${row.name} ${row.lastname || ''}`.trim(),
      sortable: true,
      center: true,
      minWidth: '120px',
      wrap: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      center: true,
      minWidth: '220px',
      wrap: true,
    },
    {
      name: 'Phone',
      selector: row => row.phone_number || 'N/A',
      center: true,
      minWidth: '140px',
      wrap: true,
    },
    {
      name: 'Available to Travel',
      selector: row => availableTravelText(row.avaible_travel),
      center: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'State Migratory',
      selector: row => row.state_migratory || 'N/A',
      center: true,
      minWidth: '140px',
      wrap: true,
    },
    {
      name: 'Download Info',
      center: true,
      minWidth: '260px',
      cell: row => (
        <div className="flex justify-center gap-2 flex-wrap">
          <button
            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs"
            onClick={() => handleDownloadCertificate(row)}
          >
            Certificates
          </button>
          <button
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
            onClick={() => handleDownloadResume(row)}
          >
            Resume
          </button>
          <button
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
            onClick={() => handleDownloadContract(row)}
          >
            Contract
          </button>
        </div>
      ),
    },
  ];

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
        minHeight: '50px',
      },
      highlightOnHoverStyle: {
        backgroundColor: '#fee2e2',
        borderBottomColor: '#fca5a5',
        outline: '1px solid #b91c1c',
      },
    },
    pagination: {
      style: {
        fontSize: '12px',
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full h-[360px]">
      <h3 className="text-lg font-semibold mb-2 border-b-4 border-red-700 pb-1">
        Applicants for this Occupation
      </h3>

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
          placeholder="Search..."
          className="bg-gray-100 w-full text-sm focus:outline-none focus:ring-0 border-none ml-2"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredApplicants}
        progressPending={loading}
        pagination
        highlightOnHover
        pointerOnHover
        persistTableHead
        customStyles={customStyles}
        noDataComponent={<div className="p-4 text-gray-600">No applicants found</div>}
        dense
        wrap
      />
    </div>
  );
}
