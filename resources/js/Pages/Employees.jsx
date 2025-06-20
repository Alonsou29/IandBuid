import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TablaEmployee from "../Components/tablaEmployee";
import { Head } from "@inertiajs/react";

export default function Employees({ auth, employees: initialEmployees }) {
  const [employees, setEmployees] = useState(initialEmployees);

  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Employees</h2>}
    >
      <Head title="Employees" />

      <div className="py-6">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <TablaEmployee employees={employees} setEmployees={setEmployees} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
