import React from "react";
import DataTable from "react-data-table-component";

export default function EmployeeDetailTable({ address, workHistory, references, military }) {
  const commonStyles = {
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
        fontSize: '13px',
        textAlign: 'center',
        paddingTop: '4px',
        paddingBottom: '4px',
      },
      highlightOnHoverStyle: {
        backgroundColor: '#fee2e2',
        borderBottomColor: '#fca5a5',
        outline: '1px solid #b91c1c',
      },
    },
  };

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
    { name: "Branch", selector: r => r.branch, center: true },
    { name: "Start", selector: r => r.start_services, center: true },
    { name: "End", selector: r => r.end_services, center: true },
  ];

  return (
    <div className="text-left space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-black mb-2">📍 Address</h4>
        <DataTable columns={addressCols} data={address} noHeader dense customStyles={commonStyles} />
      </div>

      <div>
        <h4 className="text-lg font-semibold text-black mb-2">🛠️ Work History</h4>
        <DataTable columns={workCols} data={workHistory} noHeader dense customStyles={commonStyles} />
      </div>

      <div>
        <h4 className="text-lg font-semibold text-black mb-2">👥 References</h4>
        <DataTable columns={refCols} data={references} noHeader dense customStyles={commonStyles} />
      </div>

      {military?.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-black mb-2">🎖️ Military Service</h4>
          <DataTable columns={milCols} data={military} noHeader dense customStyles={commonStyles} />
        </div>
      )}
    </div>
  );
}
