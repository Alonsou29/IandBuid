import React, { useState } from 'react';

function FormularioComponente() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [ubication, setUbication] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const datosFormulario = {
      name,
      type,
      description,
      status,
      ubication,
    };
    console.log('Datos del formulario enviados:', datosFormulario);

    const response = await axios.post('/createOccupation', datosFormulario);
    console.log(response);
    setName('');
    setType('');
    setDescription('');
    setStatus('');
    setUbication('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Formulario de Datos</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
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
          Enviar
        </button>
      </form>
    </div>
  );
}

export default FormularioComponente;
