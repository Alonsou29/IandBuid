import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa Axios

function FormularioComponenteEdicion({ recursoId }) { // Asume que recibes el ID del recurso a editar
  const [nombre, setNombre] = useState('');
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
          const response = await axios.get(`/updateOccupation/${recursoId}`);
          const data = response.data; // Axios automáticamente parsea el JSON a response.data

          // Llenar el formulario con los datos existentes
          setNombre(data.data.nombre); // Asumiendo que la API devuelve { data: { ... } }
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
      nombre,
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
      alert('Recurso actualizado exitosamente!');

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
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Editar Recurso</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="type" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tipo:</label>
          <input
            type="text"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          ></textarea>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="status" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Estado:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Selecciona un estado</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="ubication" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ubicación:</label>
          <input
            type="text"
            id="ubication"
            value={ubication}
            onChange={(e) => setUbication(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Actualizar
        </button>
      </form>
    </div>
  );
}

export default FormularioComponenteEdicion;
