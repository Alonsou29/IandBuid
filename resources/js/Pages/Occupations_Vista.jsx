import React, { useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import Navbar2 from '/resources/js/Components/Navbar2';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Formulario from "/resources/js/Components/Formulario"; // Ajusta la ruta si es distinta

const MySwal = withReactContent(Swal);


export default function Jobs({ occupations }) {
  const [filterStatus, setFilterStatus] = useState("All");

  // Filtrar trabajos por estado
  const filteredJobs = useMemo(() => {
    return occupations.filter((job) => {
      return filterStatus === "All" || job.status === filterStatus;
    });
  }, [filterStatus, occupations]);

  return (
    <>
          <Navbar2 />
      <Head  title="Occupations" />
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-8 pt-24">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Occupation Opportunities
        </h1>

        {/* Filtro por estado */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["All", "Activo", "Inactivo"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full border ${
                filterStatus === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
              } transition`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Cartas de trabajos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-red-600 mb-2">
                  {job.name}
                </h2>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Type:</strong> {job.type}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Location:</strong> {job.ubication}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Status:</strong> {job.status}
                </p>
                {job.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {job.description}
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  MySwal.fire({
                    title: "Apply to Job",
                    html: <Formulario selectedJob={job.name} />,
                    showConfirmButton: false,
                    showCloseButton: true,
                    width: "80%",
                    customClass: {
                      popup: 'overflow-auto max-h-[90vh] p-4',
                    },
                  })
                }
                className="mt-auto bg-red-600 text-white font-medium py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Apply Now!
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
