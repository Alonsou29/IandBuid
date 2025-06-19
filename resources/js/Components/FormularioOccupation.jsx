import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

function FormularioComponente({ onSuccess }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [ubication, setUbication] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !type || !status || !ubication) {
      Swal.fire({
        icon: 'error',
        title: 'Required Fields',
        text: 'Please fill out the required fields: Name, Type, Status, and Location.',
      });
      return;
    }

    const datosFormulario = { name, type, description, status, ubication };

    try {
      setLoading(true);
      const response = await axios.post('/createOccupation', datosFormulario);
      setLoading(false);

      // Llama onSuccess con la ocupación nueva recibida del backend
      if (onSuccess) onSuccess(response.data);
      console.log("Nueva ocupación:", response.data);


      // Limpia formulario (opcional si el modal se cierra)
      setName('');
      setType('');
      setDescription('');
      setStatus('');
      setUbication('');
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was a problem submitting the data, please try again.',
      });
      console.error(error);
    }
  };
  return (
    <div className="p-6 max-w-full mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-red-700">Data Form</h2>
      <form onSubmit={handleSubmit}>

        <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter name"
        />

        <label htmlFor="type" className="block mb-2 font-semibold text-gray-700">
          Type <span className="text-red-500">*</span>
        </label>
        <input
          id="type"
          type="text"
          value={type}
          onChange={e => setType(e.target.value)}
          required
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter type"
        />

        <label htmlFor="description" className="block mb-2 font-semibold text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows="4"
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter description"
        />

        <label htmlFor="status" className="block mb-2 font-semibold text-gray-700">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          value={status}
          onChange={e => setStatus(e.target.value)}
          required
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select a status</option>
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>

        <label htmlFor="ubication" className="block mb-2 font-semibold text-gray-700">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          id="ubication"
          type="text"
          value={ubication}
          onChange={e => setUbication(e.target.value)}
          className="mb-6 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter location"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded ${
            loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          } transition-colors duration-300`}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default FormularioComponente;
