import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import EmployeeDetailTable from "./EmployeeDetailTable";

const MySwal = withReactContent(Swal);

export default function TablaEmployee({ employees }) {
  const [filterText, setFilterText] = useState("");

  const filteredEmployees = useMemo(() => {
    const lower = filterText.toLowerCase();
    return employees.filter(emp =>
      Object.values(emp).some(
        val => val?.toString().toLowerCase().includes(lower)
      )
    );
  }, [filterText, employees]);

  const availableText = val => (val ? "Yes" : "No");

  const handleMoreInfo = async (social_id) => {
    try {
        const res = await axios.get(`/EmployeeWithSocialId/${social_id}`);
        const verifyDocuments = await axios.get(`/verifyDocuments/${social_id}`);
        const { employee, address, reference, workHistory } = res.data;
        const {hasCtf , hasContract} = verifyDocuments.data;

        const military = [{
            military_desc: employee.military_desc || 'N/A', // ✅ CORRECTO
            start_services: employee.start_services || 'N/A',
            end_services: employee.end_services || 'N/A',
        }];

        var varFooter;

        if(hasCtf === 1 && hasContract === 1){ // si tiene certificacion y contrato
            varFooter = `
            <div class="flex justify-center gap-4 mt-4">
                <a href="/download/${employee.social_id}/certification" target="_blank" class="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Download Certifications
                </a>
                <a href="/download/${employee.social_id}/resume" target="_blank" class="bg-green-600 text-white px-3 py-1 rounded text-sm">
                Download Resume
                </a>
                <a href="/download/${employee.social_id}/license" target="_blank" class="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                Download Driver License
                </a>
                    <a href="/download/${employee.social_id}/contract" target="_blank" class="bg-purple-600 text-white px-3 py-1 rounded text-sm">
                Download Contract
                </a>
            </div>
                `
        }else if(hasCtf === 0 && hasContract === 1){ // si tiene contrato pero no certificacion
            varFooter = `
            <div class="flex justify-center gap-4 mt-4">
                <a href="/download/${employee.social_id}/resume" target="_blank" class="bg-green-600 text-white px-3 py-1 rounded text-sm">
                Download Resume
                </a>
                <a href="/download/${employee.social_id}/license" target="_blank" class="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                Download Driver License
                </a>
                    <a href="/download/${employee.social_id}/contract" target="_blank" class="bg-purple-600 text-white px-3 py-1 rounded text-sm">
                Download Contract
                </a>
            </div>
                `
        }else if(hasCtf === 1 && hasContract === 0){ // si tiene certificacion pero no contrato
            varFooter = `
            <div class="flex justify-center gap-4 mt-4">
                <a href="/download/${employee.social_id}/certification" target="_blank" class="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Download Certifications
                </a>
                <a href="/download/${employee.social_id}/resume" target="_blank" class="bg-green-600 text-white px-3 py-1 rounded text-sm">
                Download Resume
                </a>
                <a href="/download/${employee.social_id}/license" target="_blank" class="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                Download Driver License
                </a>
            </div>
                `
        }else{
            varFooter =`
            <div class="flex justify-center gap-4 mt-4">
                <a href="/download/${employee.social_id}/resume" target="_blank" class="bg-green-600 text-white px-3 py-1 rounded text-sm">
                Download Resume
                </a>
                <a href="/download/${employee.social_id}/license" target="_blank" class="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                Download Driver License
                </a>
            </div>
                `
        }

        MySwal.fire({
            title: `${employee.name} ${employee.lastname}`,
            html: (
            <EmployeeDetailTable
                employee={employee}
                address={address}
                workHistory={workHistory}
                references={reference}
                military={military}
            />
            ),
            showConfirmButton: false,
            showCloseButton: true,
            footer: varFooter,
            width: "80%",
            customClass: {
                popup: "swal-wide",
            },
        });
    } catch (err) {
      console.error(err);
      MySwal.fire("Error fetching employee data");
    }
  };

const handleViewApplications = async (employeeId, employeeName) => {
  try {
    const res = await axios.get(`/jobsApplied/${employeeId}`);
    const jobs = res.data.msg;

    if (!jobs || jobs.length === 0) {
      MySwal.fire({
        icon: 'info',
        title: 'No applications found',
        text: `${employeeName} has not applied to any jobs.`,
      });
      return;
    }

    const jobList = jobs.map(job => `
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap">${job.name}</td>
        <td class="px-6 py-4 whitespace-nowrap">${job.type}</td>
        <td class="px-6 py-4 whitespace-nowrap">${job.ubication}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${job.status == 1
            ? '<span class="text-green-600 font-semibold">Active</span>'
            : '<span class="text-red-600 font-semibold">Inactive</span>'}
        </td>
      </tr>
    `).join('');

    MySwal.fire({
      title: `Jobs Applied by ${employeeName}`,
      html: `
        <div class="max-h-[400px] overflow-y-auto border border-gray-300 rounded-lg shadow-md">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-red-700 text-white sticky top-0">
              <tr>
                <th class="px-6 py-3 text-center font-semibold">Name</th>
                <th class="px-6 py-3 text-center font-semibold">Type</th>
                <th class="px-6 py-3 text-center font-semibold">Location</th>
                <th class="px-6 py-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${jobList}
            </tbody>
          </table>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: "1200px",
      background: '#fff',
      customClass: {
        popup: 'p-6',
      },
    });
  } catch (err) {
    console.error(err);
    MySwal.fire("Error fetching job applications.");
  }
};



  const columns = [
    { name: "Name", selector: r => r.name, sortable: true, center: true },
    { name: "Driver License", selector: r => r.social_id, sortable: true, center: true },
    { name: "State", selector: r => r.state, sortable: true, center: true },
    { name: "Travel", selector: r => availableText(r.available_for_travel), center: true },
    {
  name: "Applied",
  center: true,
  cell: row => (
    <button
      className="bg-blue-600 text-white px-3 py-1 rounded"
      onClick={() => handleViewApplications(row.social_id, row.name)}
    >
      {row.jobs_applied}
    </button>
  )
},
,
    {
      name: "",
      cell: row => (
        <button
          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
          onClick={() => handleMoreInfo(row.social_id)}
        >
          More Info
        </button>
      ),
      ignoreRowClick: true,
      button: true,
      center: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#b91c1c",
        color: "#fef2f2",
        fontWeight: "bold",
        fontSize: "14px",
        justifyContent: "center",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        textAlign: "center",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#fee2e2",
        borderBottomColor: "#fca5a5",
        outline: "1px solid #b91c1c",
      },
    },
    pagination: {
      style: {
        fontSize: "12px",
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full flex flex-col">
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
        data={filteredEmployees}
        pagination
        highlightOnHover
        pointerOnHover
        customStyles={customStyles}
        persistTableHead
      />
    </div>
  );
}
