import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import FormularioComponente from "@/Components/FormularioOccupation";
import FormularioComponenteEdicion from "@/Components/formUpdateOccupation"; // Ruta correcta

const MySwal = withReactContent(Swal);

export default function TablaOccupations({ occupations, setOccupations, onOccupationSeleccionado }) {
  const [filterText, setFilterText] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

 const handleCrearClick = () => {
    MySwal.fire({
      allowOutsideClick: false,
      html: (
        <FormularioComponente
          onSuccess={(newOccupation) => {
            // Cerrar el modal
            MySwal.close();
            // Actualizar el estado con el nuevo elemento agregado
            setOccupations(prev => [...prev, newOccupation]);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Occupation created and table updated!',
            });
          }}
        />
      ),
      showConfirmButton: false,
      showCloseButton: true,
      width: '800px',
      customClass: {
        popup: 'swal2-no-padding'
      }
    });
  };

  const filteredData = useMemo(() => {
    if (!filterText) return occupations;
    const lowerFilter = filterText.toLowerCase();
    return occupations.filter(item =>
      Object.values(item).some(
        val => val && val.toString().toLowerCase().includes(lowerFilter)
      )
    );
  }, [filterText, occupations]);

  const columns = [
    {
      name: 'Id',
      selector: row => row.id,
      sortable: true,
      center: true,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      center: true,
    },
    {
      name: 'Type',
      selector: row => row.type,
      sortable: true,
      center: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
      center: true,
    },
    {
      name: 'Ubication',
      selector: row => row.ubication,
      sortable: true,
      center: true,
    },
    {
      name: 'Applications',
      selector: row => row.applications,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
      selector: row => row.status === 1 ? 'Active' : 'Inactive',
      sortable: true,
      center: true,
    },
    {
  name: 'Delete',
  cell: row => (
    <button
      className="p-1 rounded hover:bg-red-700 transition-colors"
      onClick={async () => {
        const confirm = await Swal.fire({
          title: 'Are you sure?',
          text: `This will permanently delete "${row.name}"`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#dc2626',
          cancelButtonColor: '#6b7280',
        });

        if (confirm.isConfirmed) {
          try {
            await axios.delete(`/deleteOccupation/${row.id}`);
            setOccupations(prev => prev.filter(o => o.id !== row.id));

            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Occupation has been deleted.',
              timer: 2000,
              showConfirmButton: false,
            });
          } catch (error) {
            console.error('Delete failed:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete occupation.',
            });
          }
        }
      }}
      aria-label="Delete"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
      </svg>
    </button>
  ),
  ignoreRowClick: true,
  allowOverflow: true,
  button: true,
  center: true,
},
{
  name: 'Modify',
  cell: row => (
    <button
      className="p-1 rounded hover:bg-yellow-800 transition-colors"
      onClick={() => {
        MySwal.fire({
          allowOutsideClick: false,
          html: (
            <FormularioComponenteEdicion
              recursoId={row.id}
              onSuccess={(updatedOccupation) => {
                MySwal.close();
                setOccupations(prev =>
                  prev.map(o => o.id === updatedOccupation.id ? updatedOccupation : o)
                );
                Swal.fire({
                  icon: 'success',
                  title: 'Updated!',
                  text: 'Occupation updated successfully.',
                  timer: 2000,
                  showConfirmButton: false,
                });
              }}
            />
          ),
          showConfirmButton: false,
          showCloseButton: true,
          width: '800px',
          customClass: {
            popup: 'swal2-no-padding'
          }
        });
      }}
      aria-label="Modify"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-yellow-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3.536z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16v4h4l11-11-4-4-11 11z" />
      </svg>
    </button>
  ),
  ignoreRowClick: true,
  allowOverflow: true,
  button: true,
  center: true,
}


  ];

  const handleRowClick = async (row) => {
    if (selectedRow?.id === row.id) {
      setSelectedRow(null);
      onOccupationSeleccionado && onOccupationSeleccionado(null);
    } else {
      setSelectedRow(row);
      try {
        const response = await axios.get('', { params: { idOccupation: row.id } });
        onOccupationSeleccionado && onOccupationSeleccionado(response.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    }
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#b91c1c', // rojo oscuro
        color: '#fef2f2',           // rojo muy claro casi blanco
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
        backgroundColor: '#fee2e2', // rojo muy suave para hover
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
        <h2 className="text-xl font-bold text-red-800"></h2>
        <button
          onClick={handleCrearClick}
          className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition-colors font-semibold"
        >
          Crear
        </button>
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
        onRowClicked={handleRowClick}
        pointerOnHover
        highlightOnHover
        customStyles={customStyles}
        selectableRows={false}
        persistTableHead
      />
    </div>
  );
}
