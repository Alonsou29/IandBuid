import React from "react";
import DataTable from "react-data-table-component";

export default function EmployeeDetailTable({ employee, address, workHistory, references, military }) {
  const brandRed = "#b91c1c";

  const commonStyles = {
    headCells: {
      style: {
        backgroundColor: "#fef2f2",
        color: brandRed,
        fontWeight: "600",
        fontSize: "14px",
        justifyContent: "center",
        borderBottom: `2px solid ${brandRed}`,
      },
    },
    rows: {
      style: {
        fontSize: "13px",
        textAlign: "center",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f3f4f6",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#fee2e2",
        borderBottomColor: "#fca5a5",
        outline: `1px solid ${brandRed}`,
      },
    },
  };

  const employeeCols = [
    { name: "ID", selector: r => r.social_id, center: true },
    { name: "Name", selector: r => r.name, center: true },
    { name: "Last Name", selector: r => r.lastname, center: true },
    { name: "Email", selector: r => r.email, center: true },
    { name: "Phone", selector: r => r.phone_number, center: true },
    { name: "Age", selector: r => r.age, center: true },
    { name: "Birthday", selector: r => r.birthday, center: true },
    { name: "Travel", selector: r => r.avaible_travel ? "Yes" : "No", center: true },
    { name: "Immigration Status", selector: r => r.status, center: true },
  ];

  const addressCols = [
    { name: "Street", selector: r => r.street, center: true },
    { name: "City", selector: r => r.city, center: true },
    { name: "State", selector: r => r.state, center: true },
    { name: "ZIP", selector: r => r.zip, center: true },
  ];

  const workCols = [
    { name: "Employer", selector: r => r.emplo_name, center: true },
    { name: "Title", selector: r => r.title, center: true },
    { name: "Start", selector: r => r.start_work, center: true },
    { name: "End", selector: r => r.end_work, center: true },
    { name: "Reason", selector: r => r.reason_leaving, center: true },
  ];

  const refCols = [
    { name: "Name", selector: r => r.fullname, center: true },
    { name: "Phone", selector: r => r.phone_number, center: true },
    { name: "Email", selector: r => r.email, center: true },
  ];

  const milCols = [
    { name: "Branch", selector: r => r.military_desc, center: true },
    { name: "Start", selector: r => r.start_services, center: true },
    { name: "End", selector: r => r.end_services, center: true },
  ];

  return (
    <div className="text-gray-800 space-y-8 p-1">
      {/* Información personal */}
      <div className="border border-red-200 rounded-xl shadow-sm p-5 bg-white">
        <h3 className="text-lg font-semibold mb-4 text-red-800 border-b border-red-300 pb-2 ">👤 Personal Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
          <div><strong>Driver License:</strong> {employee?.social_id}</div>
          <div><strong>Name:</strong> {employee?.name}</div>
          <div><strong>Last Name:</strong> {employee?.lastname}</div>
          <div><strong>Email:</strong> {employee?.email}</div>
          <div><strong>Phone:</strong> {employee?.phone_number}</div>
          <div><strong>Age:</strong> {employee?.age}</div>
          <div><strong>Birthday:</strong> {employee?.birthday}</div>
          <div><strong>Travel Available:</strong> {employee?.avaible_travel ? "Yes" : "No"}</div>
          <div><strong>Immigration Status:</strong> {employee?.status}</div>
        </div>
      </div>

      {/* Secciones con tablas */}
      <div>
        <h4 className="text-md font-semibold text-red-800 mb-2">📍 Address</h4>
        <DataTable columns={addressCols} data={address} noHeader dense customStyles={commonStyles} />
      </div>

      <div>
        <h4 className="text-md font-semibold text-red-800 mb-2">🛠️ Work History</h4>
        <DataTable columns={workCols} data={workHistory} noHeader dense customStyles={commonStyles} />
      </div>

      <div>
        <h4 className="text-md font-semibold text-red-800 mb-2">👥 References</h4>
        <DataTable columns={refCols} data={references} noHeader dense customStyles={commonStyles} />
      </div>

      {military?.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-red-800 mb-2">🎖️ Military Service</h4>
          <DataTable columns={milCols} data={military} noHeader dense customStyles={commonStyles} />
        </div>
      )}
    </div>
  );
}
