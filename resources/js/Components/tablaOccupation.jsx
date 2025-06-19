import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";

export default function TablaOccupations({ occupations, onOccupationSeleccionado }) {
  const [filterText, setFilterText] = useState('');
  const [tableData, setTableData] = useState(occupations);
  const [selectedRow, setSelectedRow] = useState();
  console.log(occupations);
  const filteredData = useMemo(() => {
    if (!filterText) return tableData;
    return tableData.filter(item =>
      Object.values(item).some(
        val => val && val.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [filterText, tableData]);

  const columns = [
    {
      name: 'Id',
      selector: row => row.id,
      sortable: true,
      cell: row => <div className="text-center">{row.id}</div>,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      cell: row => <div className="text-center">{row.name}</div>,
    },
    {
      name: 'Type',
      selector: row => row.type,
      sortable: true,
      cell: row => <div className="text-center">{row.type}</div>,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
      cell: row => <div className="text-center">{row.description}</div>,
    },
    {
      name: 'Ubication',
      selector: row => row.ubication,
      sortable: true,
      cell: row => <div className="text-center">{row.ubication}</div>,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => <div className="text-center">{row.status}</div>,
    },
    {
      name: 'delete',
      cell: row => (
        <div className="w-full flex justify-center">
          <button
            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            onClick={async () => await axios.delete(`deleteOccupation/${row.id}`)}
          >
            delete
          </button>
        </div>
      ),
    },
        {
      name: 'Modify',
      cell: row => (
        <div className="w-full flex justify-center">
          <button
            className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            onClick={async () => await axios.get(`deleteOccupation/${row.id}`)}
          >
            Modify
          </button>
        </div>
      ),
    },
  ];

  const handleRowClick = async(row)=>{
      if (selectedRow && selectedRow.id === row.id) {
        setSelectedRow(null);
        onOccupationSeleccionado && onOccupationSeleccionado(null);
      } else {
        setSelectedRow(row);
        try {
          const response = await axios.get('', {
            params: { idOccupation: row.id }
          });
        console.log(row.codigo)
        console.log(response.data)
          onOccupationSeleccionado && onOccupationSeleccionado(response.data);
        } catch (error) {
          console.error('Error al cargar el histórico de facturas:', error);
        }
      }
  }



  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#1E3A8A',
        color: 'white',
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
        backgroundColor: '#ffe5e5',
        borderBottomColor: '#ffcccc',
        outline: '1px solid #e60000',
      },
    },
    pagination: {
      style: {
        fontSize: '12px',
        color: '#4B5563',
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full flex flex-col">
      <div className="flex justify-between items-center border-b-4 border-sky-600 pb-2">
        <h2 className="text-xl font-bold text-gray-800">Occupations:</h2>
      </div>

      <div className="relative mr-10 justify-start items-start bg-blue-50">
        <a href="/formularioOccupation">crear</a>
      </div>


      <div className="mt-4">
        <div className="mb-4 flex items-center bg-gray-100 rounded-full px-2 py-1 w-[280px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
          <input
            type="text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder="Buscar..."
            className="bg-gray-100 w-full text-sm focus:outline-none focus:ring-0 border-none"
            style={{ width: '0px', paddingLeft: '4px', flex: 1 }}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          onRowClicked={handleRowClick}
          pointerOnHover
          highlightOnHover
          customStyles={customStyles}
        />
      </div>
    </div>
  );
}
