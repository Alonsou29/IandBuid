import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TablaOccupations from "@/Components/tablaOccupation";
import { Head } from "@inertiajs/react";

export default function Occupations({ auth, occupations: initialOccupations }) {
 
  const [occupations, setOccupations] = useState(initialOccupations);

  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Occupations</h2>}
    >
      <Head title="Occupations" />

      <div className="py-6">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Paso la lista y la función para actualizar */}
          <TablaOccupations occupations={occupations} setOccupations={setOccupations} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
