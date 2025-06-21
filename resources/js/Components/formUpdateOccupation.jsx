import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa Axios

function FormularioComponenteEdicion({ recursoId, onSuccess }) { // Asume que recibes el ID del recurso a editar
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [ubication, setUbication] = useState('');

  // Opcional: Cargar los datos existentes del recurso cuando el componente se monta
  useEffect(() => {
    if (recursoId) {
      const fetchRecurso = async () => {
        try {
          // Usando Axios para GET
          const response = await axios.get(`/udtOccupation/${recursoId}`);
          const data = response.data; // Axios automáticamente parsea el JSON a response.data

          // Llenar el formulario con los datos existentes
          setName(data.data.name); // Asumiendo que la API devuelve { data: { ... } }
          setType(data.data.type);
          setDescription(data.data.description);
          setStatus(data.data.status);
          setUbication(data.data.ubication);
        } catch (error) {
          console.error('Error al cargar el recurso:', error);
          if (error.response) {
            // El servidor respondió con un estado fuera del rango 2xx
            console.error('Datos de error:', error.response.data);
            console.error('Estado del error:', error.response.status);
          } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error('No se recibió respuesta del servidor:', error.request);
          } else {
            // Algo más causó el error
            console.error('Error:', error.message);
          }
          alert('Error al cargar el recurso. Revisa la consola para más detalles.');
        }
      };
      fetchRecurso();
    }
  }, [recursoId]); // Se ejecuta cada vez que 'recursoId' cambia

  const handleSubmit = async (event) => {
    event.preventDefault();

    const datosActualizados = {
      name,
      type,
      description,
      status,
      ubication,
    };

    try {
      // Usando Axios para PUT
      const response = await axios.put(`/updateOccupation/${recursoId}`, datosActualizados, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      // Axios automáticamente maneja la propiedad 'data' para el cuerpo de la respuesta
      console.log('Recurso actualizado exitosamente:', response.data);

        // ✅ Llamar a onSuccess con la data actualizada
    if (typeof onSuccess === 'function') {
      onSuccess(response.data.data); // <-- ESTA LÍNEA es la clave
    }

      // Opcional: Redirigir al usuario o hacer algo más después de la actualización exitosa
      // history.push('/alguna-otra-pagina');

    } catch (error) {
      console.error('Hubo un error al enviar los datos:', error);
      if (error.response) {
        // El servidor respondió con un estado fuera del rango 2xx
        console.error('Datos de error:', error.response.data);
        console.error('Estado del error:', error.response.status);
        alert(`Error al actualizar: ${error.response.data.message || 'Error desconocido'}`);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor:', error.request);
        alert('No se pudo conectar con el servidor.');
      } else {
        // Algo más causó el error
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
  <div className="p-6 max-w-full mx-auto bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold mb-6 text-center text-red-700">Edit Occupation</h2>
    <form onSubmit={handleSubmit}>

      <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">
        Name <span className="text-red-500">*</span>
      </label>
      <input
        id="nombre"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Enter occupation name"
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
        placeholder="Enter occupation type"
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
        placeholder="Enter a description (optional)"
      ></textarea>

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
        <option value="">Select status</option>
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </select>

      <label htmlFor="ubication" className="block mb-2 font-semibold text-gray-700">
        Location <span className="text-red-500">*</span>
      </label>
      <input
        id="ubication"
        type="text"
        value={ubication}
        onChange={e => setUbication(e.target.value)}
        required
        className="mb-6 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Enter location"
      />

      <button
        type="submit"
        className="w-full py-3 text-white font-semibold rounded bg-red-600 hover:bg-red-700 transition-colors duration-300"
      >
        Update
      </button>
    </form>
  </div>
);
}

export default FormularioComponenteEdicion;
