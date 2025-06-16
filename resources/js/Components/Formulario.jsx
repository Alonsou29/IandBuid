import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

const MySwal = withReactContent(Swal);

export default function Formulario() {
  const [files, setFiles] = useState([]);

  // Maneja la subida de archivos PDF y valida máximo 10
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      (file) => file.type === 'application/pdf'
    );

    if (selectedFiles.length + files.length > 10) {
      MySwal.fire('Error', 'You can upload a maximum of 10 PDF files.', 'error');
      return;
    }

    setFiles([...files, ...selectedFiles]);
  };

  // Permite eliminar un archivo seleccionado por su índice
  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
  };

  // Validación de campos y control del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const social_id = form.social_id.value.trim();
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const dob = new Date(form.dob.value);
    const city = form.city.value.trim();
    const state = form.state.value.trim();
    const phone = form.phone.value.trim();

    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const isBeforeBirthday =
      monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate());

    const actualAge = isBeforeBirthday ? age - 1 : age;

    // Validar edad
    if (actualAge < 18 || actualAge > 70) {
      MySwal.fire('Invalid Age', 'Age must be between 18 and 70 years.', 'error');
      return;
    }

    // Validar que no contengan números
    const hasNumbers = (str) => /\d/.test(str);

    if (hasNumbers(firstName) || hasNumbers(lastName)) {
      MySwal.fire('Invalid Name', 'First and Last Name should not contain numbers.', 'error');
      return;
    }

    if (hasNumbers(city) || hasNumbers(state)) {
      MySwal.fire('Invalid Address', 'City and State should not contain numbers.', 'error');
      return;
    }

        // Validar teléfono (no debe contener letras)
    if (/[a-zA-Z]/.test(phone)) {
      MySwal.fire('Invalid Phone', 'Phone number should not contain letters.', 'error');
      return;
    }

    const response = await axios.post('/createEmployee', form);
     console.log('Cliente registrado:', response.data.client);

        // Si todo está correcto envia el exitoso del envio owo
        MySwal.fire('Success', 'Form submitted successfully!', 'success');

        alert(
        `Datos enviados:\n` +
        `Social id: ${social_id}\n`+
        `First Name: ${firstName}\n` +
        `Last Name: ${lastName}\n` +
        `Date of Birth: ${dob.toLocaleDateString()}\n` +
        `City: ${city}\n` +
        `State: ${state}\n` +
        `Phone: ${phone}\n` +
        `Archivos PDF: ${files.map(f => f.name).join(', ') || 'Ninguno'}`
        );
        };

  return (
<form
  onSubmit={handleSubmit}
  className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 bg-white rounded-lg shadow"
>
  {/* nombre y apellido - grid responsive */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="block font-semibold mb-1">First Name</label>
      <input
        type="text"
        name="firstName"
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholder="Enter first name"
      />
    </div>
    <div>
      <label className="block font-semibold mb-1">Last Name</label>
      <input
        type="text"
        name="lastName"
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholder="Enter last name"
      />
    </div>
    <div>
      <label className="block font-semibold mb-1">Social Id</label>
      <input
        type="text"
        name="social_id"
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholder="Enter social id"
      />
    </div>
  </div>

  {/* fecha de cumple */}
  <div>
    <label className="block font-semibold mb-1">Date of Birth</label>
    <input
      type="date"
      name="dob"
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  </div>

  {/* direccion */}
  <h3 className="text-xl font-bold mt-6 text-red-600">Address</h3>
  <div className="space-y-4">
    <div>
      <label className="block font-semibold mb-1">Street</label>
      <input
        type="text"
        name="street"
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholder="123 Main St"
      />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className="block font-semibold mb-1">City</label>
        <input
          type="text"
          name="city"
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="City"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">State</label>
        <input
          type="text"
          name="state"
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="State"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">ZIP</label>
        <input
          type="number"
          name="zip"
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="ZIP Code"
        />
      </div>
    </div>
  </div>

  {/* contacto */}
  <h3 className="text-xl font-bold mt-6 text-red-600">Contact Information</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="block font-semibold mb-1">Email</label>
      <input
        type="email"
        name="email"
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholder="example@example.com"
      />
    </div>
    <div>
      <label className="block font-semibold mb-1">Cell Phone</label>
      <input
        type="tel"
        name="phone"
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholder="+1 123 456 7890"
      />
    </div>
  </div>

  {/* sección subida PDFs */}
  <div>
    <label className="block font-semibold mb-2">Upload PDFs (Max 10)</label>
    <input
      type="file"
      accept="application/pdf"
      multiple
      onChange={handleFileChange}
      className="block mb-4 w-full"
    />

    {/* mostrar archivos seleccionados */}
    {files.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm max-w-xs truncate"
            title={file.name}
          >
            <span className="truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className="ml-2 text-red-600 hover:text-red-800 font-bold"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* botón submit */}
  <button
    type="submit"
    className="w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
  >
    Submit
  </button>
</form>

  );
}
