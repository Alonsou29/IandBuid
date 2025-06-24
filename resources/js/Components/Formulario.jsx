import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format } from 'date-fns';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const MySwal = withReactContent(Swal);

// Lista de pasos del formulario
const steps = [
  'Job Information',
  'Personal Information (Social ID)',
  'Resume Upload',
  'Personal Information',
  'Military Experience',
  'References',
  'Work History',
  'Additional Information',
  'Submit',
];

export default function Formulario({ selectedJob }) {
  const [toastMessage, setToastMessage] = useState(null);
  const [errores, setErrores] = useState({});
  const [certFiles, setCertFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [step, setStep] = useState(0);
  const [job, setJob] = useState(selectedJob || "");
  const showJobSelect = !selectedJob;
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    social_id: '',
    dob: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    phone: '',
    willingToTravel: '',
    immigrationStatus: '',
    visaExpiryDate: '',
    workAuthorization: false,
    countryOfOrigin: '',
    dfac: '',
    branch: '',
    airport: '',
    startDate: '',
    endDate: '',
    references: [{ name: '', phone: '', email: '' }, { name: '', phone: '', email: '' }],
    workHistory: [
      { employer: '', phone: '', start: '', end: '', title: '', duties: '', reason: '' },
      { employer: '', phone: '', start: '', end: '', title: '', duties: '', reason: '' },
    ],
    referred: '',
    referredBy: '',
    certifications: [],
    resume: null,
    occupation_id: selectedJob?.id || '',
  });

    // --- FUNCIONES PARA MANEJO DE MENSAJES ---
  // Mostrar mensaje tipo toast por 2.5 segundos
const showErrorToast = (msg) => {
  setToastMessage(msg);
  setTimeout(() => setToastMessage(null), 2500);
};


  // --- FUNCIONES DE NAVEGACIÓN ---
  // Avanzar al siguiente paso con validación
  const handleNext = async (e)  => {
    e.preventDefault();

    // Validar campos del paso actual
    if (!validateCurrentStep()) {
      return; // No avanzar si hay errores
    }

  //buscar una mejor forma de realizar esta validacion para ver si exite el employee
  if(formData.social_id != '' &&  step === 1){
    const reqeust = await axios.get(`/EmployeeWithSocialId/${formData.social_id}`).then(response=>{
      if(response.status == 202){
        // console.log(response.data);

        console.log(response.data)

        let employee = response.data.employee;
        let address = response.data.address;

        formData.social_id = employee['social_id'];
        formData.firstName = employee['name'];
        formData.lastName = employee['lastname'];
        formData.dob = employee['birthday'];
        formData.email = employee['email'];
        formData.phone = employee['phone_number'];
        formData.airport = employee['airport'];
        formData.willingToTravel = employee['avaible_travel'] == 1 ? 'Yes':'No';

        console.log(address);
        const mapa = address.map(function(item, index, arr){
          formData.state = item['state'];
          formData.city = item['city'];
          formData.street = item['street'];
          formData.zip = item['zip'];

        });
        setStep(prev => prev + 6);
      }
    });
  }

  setStep(prev => prev + 1);
};



function isValidDate(dateString) {
  // Verifica formato MM/DD/YYYY
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
  if (!regex.test(dateString)) return false;

  // Parsear partes
  const [month, day, year] = dateString.split('/').map(Number);

  // Crear fecha JS (mes - 1 porque JS usa 0-index en meses)
  const date = new Date(year, month - 1, day);

  // Verificar que la fecha sea válida (ej. 02/30 no existe)
  return date.getFullYear() === year &&
         date.getMonth() === month - 1 &&
         date.getDate() === day;
}

function calculateAge(dateString) {
  const [month, day, year] = dateString.split('/').map(Number);
  const dob = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

  // --- VALIDACIONES POR PASO ---
const validateCurrentStep = () => {
  const newErrors = {};

  // Paso 2 - Información Personal
  if (step === 1) {
    const requiredFields = [
      'social_id'
    ];

    // Validar campos vacíos
    requiredFields.forEach(field => {
      if (!formData[field] || String(formData[field]).trim() === '') {
        newErrors[field] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      showErrorToast("Please complete all required fields.");
      setErrores(newErrors);
      return false;
    }
  }


  // Paso 2 - Información Personal
if (step === 3) {
  const requiredFields = [
    'firstName', 'lastName', 'dob',
    'street', 'city', 'state', 'zip',
    'email', 'phone', 'willingToTravel',
    'immigrationStatus', // siempre requerido
  ];

  const newErrors = {};

  // Validar campos vacíos y mostrar toast para cada uno
  requiredFields.forEach(field => {
    if (!formData[field] || String(formData[field]).trim() === '') {
      newErrors[field] = true;
      showErrorToast(`Please complete the field: ${field}`);
    }
  });

  // Validación DOB
  if (formData.dob) {
    if (!isValidDate(formData.dob)) {
      newErrors.dob = true;
      showErrorToast("Please enter a valid date in MM/DD/YYYY format.");
    } else {
      const age = calculateAge(formData.dob);
      if (age < 18 || age > 70) {
        newErrors.dob = true;
        showErrorToast("Age must be between 18 and 70 years.");
      }
    }
  }

  // Validación email
  if (formData.email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = true;
      showErrorToast("Please enter a valid email address.");
    }
  }

  // Validación condicional por immigrationStatus
  const status = formData.immigrationStatus;

  if (status === 'Work Visa' || status === 'Student Visa') {
    // visaExpiryDate obligatorio y válido
    if (!formData.visaExpiryDate || formData.visaExpiryDate.trim() === '') {
      newErrors.visaExpiryDate = true;
      showErrorToast("Visa expiry date is required for Work or Student Visa.");
    } else if (!isValidDate(formData.visaExpiryDate)) {
      newErrors.visaExpiryDate = true;
      showErrorToast("Please enter a valid visa expiry date in MM/DD/YYYY format.");
    }
  }

  // Work Authorization solo requerido si Work Visa
  if (status === 'Work Visa') {
    if (!formData.workAuthorization) {
      newErrors.workAuthorization = true;
      showErrorToast("Authorization to work is required for Work Visa.");
    }
  }

  // Si no es Citizen, countryOfOrigin obligatorio
  if (status && status !== 'Citizen') {
    if (!formData.countryOfOrigin || formData.countryOfOrigin.trim() === '') {
      newErrors.countryOfOrigin = true;
      showErrorToast("Country of origin is required if status is not Citizen.");
    }
  }

  setErrores(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return false;
  }

  return true;
}





  // Paso 3 - Experiencia Militar
if (step === 4) {
  const requiredFields = ['dfac', 'branch'];
  const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;

  let hasEmptyFields = false;

  // Validación de campos vacíos
  requiredFields.forEach(field => {
    if (!formData[field] || String(formData[field]).trim() === '') {
      newErrors[field] = true;
      hasEmptyFields = true;
    }
  });

  // Validación del código de aeropuerto (solo si no está vacío)
  if (formData.airport && !/^\d{3,}$/.test(formData.airport)) {
    newErrors.airport = true;
    showErrorToast("Airport code must be numeric and at least 3 digits.");
  }

  // Validación de fechas
  const { startDate, endDate } = formData;
  const isValidDate = (str) => datePattern.test(str);

  if (startDate && !isValidDate(startDate)) {
    newErrors.startDate = true;
    showErrorToast("Start date must be in MM/DD/YYYY format.");
  }

  if (endDate && !isValidDate(endDate)) {
    newErrors.endDate = true;
    showErrorToast("End date must be in MM/DD/YYYY format.");
  }

  // Validación de rango de fechas (solo si ambas son válidas)
  if (
    startDate &&
    endDate &&
    isValidDate(startDate) &&
    isValidDate(endDate)
  ) {
    const [sm, sd, sy] = startDate.split('/').map(Number);
    const [em, ed, ey] = endDate.split('/').map(Number);
    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);

    if (end < start) {
      newErrors.endDate = true;
      showErrorToast("End date cannot be before start date.");
    }
  }

  if (hasEmptyFields) {
    showErrorToast("Please complete all required fields.");
  }

  if (Object.keys(newErrors).length > 0) {
    setErrores(newErrors);
    return false;
  }
}


if (step === 5) {
  const referencesValid = formData.references.some(ref =>
    ref.name.trim() !== '' &&
    ref.phone.trim() !== '' &&
    ref.email.trim() !== ''
  );

  if (!referencesValid) {
    showErrorToast("Please complete at least one reference.");
    return false;
  }

  // Validación de email en las referencias que estén llenas
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmail = formData.references.find(ref =>
    ref.name.trim() !== '' &&
    ref.phone.trim() !== '' &&
    ref.email.trim() !== '' &&
    !emailPattern.test(ref.email.trim())
  );

  if (invalidEmail) {
    showErrorToast("Please enter a valid email address in your reference(s).");
    return false;
  }
}


if (step === 6) {
  const newWorkErrors = [];

  const workValid = formData.workHistory.some((job, i) => {
    const errors = {};
    const isComplete =
      job.employer.trim() !== '' &&
      job.phone.trim() !== '' &&
      job.start.trim() !== '' &&
      job.end.trim() !== '' &&
      job.title.trim() !== '' &&
      job.duties.trim() !== '' &&
      job.reason.trim() !== '';

    // Validación de fechas individuales
    if (job.start && job.end) {
      const start = new Date(job.start);
      const end = new Date(job.end);
      if (end < start) {
        errors.end = true;
        showErrorToast(`Work history ${i + 1}: End date cannot be before start date.`);
      }
    }

    newWorkErrors[i] = errors;
    return isComplete;
  });

  // Si ninguna fila está completa
  if (!workValid) {
    showErrorToast("Please complete at least one work history entry.");
    return false;
  }

  // Si hay errores de fecha en algún registro
  const hasDateError = newWorkErrors.some(e => Object.keys(e).length > 0);
  if (hasDateError) {
    setErrores(prev => ({ ...prev, workHistory: newWorkErrors }));
    return false;
  }

  // Limpiar errores si todo está bien
  setErrores(prev => ({ ...prev, workHistory: [] }));
}

if (step === 7) {
  const newAdditionalErrors = {};

  // Validar si se seleccionó una opción
  if (!formData.referred || formData.referred === '') {
    newAdditionalErrors.referred = true;
  }

  // Si la opción fue "yes", debe indicar quién refirió
  if (formData.referred === 'yes' && (!formData.referredBy || formData.referredBy.trim() === '')) {
    newAdditionalErrors.referredBy = true;
  }

  // Validar que todos los archivos sean PDF (opcional, ya está limitado con accept="application/pdf")
  const invalidFiles = formData.certifications.filter(file => file.type !== 'application/pdf');
  if (invalidFiles.length > 0) {
    showErrorToast("Only PDF files are allowed for certifications.");
    return false;
  }

  if (Object.keys(newAdditionalErrors).length > 0) {
    setErrores(prev => ({ ...prev, additionalInfo: newAdditionalErrors }));
    showErrorToast("Please complete the required fields in this section.");
    return false;
  }

  // Limpiar errores si todo está bien
  setErrores(prev => ({ ...prev, additionalInfo: {} }));
}

  // Si todo está bien
  setErrores({});
  return true;
};





  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleChange = (e) => {
  const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefChange = (index, field, value) => {
    const updated = [...formData.references];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, references: updated }));
  };

  const handleWorkChange = (index, field, value) => {
    const updated = [...formData.workHistory];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, workHistory: updated }));
  };


    // --- MANEJO DE ARCHIVOS ---
  // Validación y agregado de archivo resume (PDF max 5MB, máximo 1 archivo)
 const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    setFiles([selectedFile]); // si sigues usando `files`, mantenlo para la UI
    setFormData(prev => ({ ...prev, resume: selectedFile })); // <-- esto es lo importante
  }



  // Validar tamaño individual
  const oversizedFiles = selected.filter((file) => file.size > maxSizeBytes);
  if (oversizedFiles.length > 0) {
    setErrorMsg(`Each file must be 5MB or less.`);
    setTimeout(() => setErrorMsg(null), 2500);
    return;
  }

  if (selected.length + files.length > 1) {
    setErrorMsg('You can upload a maximum of 1 PDF file.');
    setTimeout(() => setErrorMsg(null), 2500);
    return;
  }

  setErrorMsg(null); // Limpia mensaje si no hay error
  setFiles([...files, ...selected]);
};

  const handleRemoveFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
  };

    // Validación y agregado de archivos de certificación (solo PDF y max 5MB)
 const handleCertFileChange = (e) => {
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const selectedFiles = Array.from(e.target.files);

  // Filtra solo PDFs válidos
  const validFiles = selectedFiles.filter(file => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are allowed for certifications.');
      return false;
    }
    if (file.size > maxSizeBytes) {
      setErrorMsg(`Each certification must be 5MB or less.`);
      return false;
    }
    return true;
  });

  if (validFiles.length > 0) {
    setErrorMsg(null);
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, ...validFiles]
    }));
  } else {
    setTimeout(() => setErrorMsg(null), 2500);
  }
};


const handleRemoveCertFile = (index) => {
  setFormData(prev => {
    const updated = [...prev.certifications];
    updated.splice(index, 1);
    return { ...prev, certifications: updated };
  });
};


  // --- FUNCIONES AUXILIARES ---
  // Verifica si un objeto está vacío o todos sus valores son cadenas vacías

  const isEmptyObject = (obj) => {
  return Object.values(obj).every(value => String(value).trim() === '');
};


const handleSubmit = async (e) => {
  e.preventDefault();

  const formatDateToMySQL = (dateStr) => {
    if (!dateStr) return '';
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const normalizedData = {
    ...formData,
    dfac: formData.dfac === 'Yes' ? 1 : 0,
    willingToTravel: formData.willingToTravel === 'yes' ? 1 : 0,
    referred: formData.referred === 'Yes' ? 1 : 0,
    dob: formatDateToMySQL(formData.dob),
    startDate: formatDateToMySQL(formData.startDate),
    endDate: formatDateToMySQL(formData.endDate),
  };

  const formPayload = new FormData();

  const validRefs = normalizedData.references.filter(ref => !isEmptyObject(ref));
  if (validRefs.length > 0) {
    formPayload.append('references', JSON.stringify(validRefs));
  }

  const validHistory = normalizedData.workHistory
    .filter(job => !isEmptyObject(job))
    .map(job => ({
      ...job,
      start: formatDateToMySQL(job.start),
      end: formatDateToMySQL(job.end),
    }));

  if (validHistory.length > 0) {
    formPayload.append('workHistory', JSON.stringify(validHistory));
  }

Object.entries(normalizedData).forEach(([key, value]) => {
  if (['references', 'workHistory', 'certifications', 'resume'].includes(key)) return;
  formPayload.append(key, value);
});

if (formData.resume) {
  formPayload.append('resume', formData.resume); // clave debe coincidir con el backend
}

if (formData.certifications){
    if (formData.certifications.length > 0) {
      formData.certifications.forEach((file) => {
        formPayload.append('certifications[]', file); // ¡Aquí la clave es 'certifications[]'!
      });
    } else {
      console.warn("No hay archivos seleccionados para subir.");
      return; // O maneja el error como prefieras
    }
}



  // Ahora sí, luego de armar formPayload, puedes ver su contenido
  for (const pair of formPayload.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  try {
    const response = await axios.post('/createEmployee', formPayload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Cliente registrado:', cleanData);
    MySwal.fire('Success', 'Form submitted successfully!', 'success');
  } catch (error) {
  if (error.response) {
    console.error('Error response data:', error.response.data);
    console.log('Error response data:', error.response.data);
    if (error.response.data.validator) {
      const validatorErrors = error.response.data.validator.errors || error.response.data;
      console.log('Errores de validación:', validatorErrors);
      setErrorMsg(JSON.stringify(validatorErrors, null, 2)); // Formatea para legibilidad
    } else {
      setErrorMsg('Error en la validación del formulario.');
    }
  } else {
    setErrorMsg("There was a problem submitting the form. Please try again.");
  }
}

};




  return (
  <>
    {/* Paso actual como título */}
    <div className="text-start mb-6">
      <h2 className="text-3xl font-bold text-red-600">
        Step {step + 1}: {steps[step]}
      </h2>
    </div>

    <form
  onSubmit={handleSubmit}
  className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow rounded space-y-6 h-[360px] overflow-auto"
>

      {/* Paso 1 - job */}
      {step === 0 && (
<div className="flex justify-center items-center min-h-[230px] px-4">
  <div className="w-full max-w-md">
    {showJobSelect ? (
      <select
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition"
        value={job}
        onChange={(e) => setJob(e.target.value)}
      >
        <option value="">Select a job</option>
        {/* Aquí van tus opciones */}
      </select>
    ) : (
      selectedJob && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
          <h3 className="text-2xl font-bold text-red-700">{selectedJob.name}</h3>
          <p>
            <span className="font-semibold text-gray-700">Type: </span>
            <span className="text-gray-600">{selectedJob.type}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">Location: </span>
            <span className="text-gray-600">{selectedJob.ubication}</span>
          </p>
          <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
        </div>
      )
    )}
  </div>
</div>

      )}

{toastMessage && (
  <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
    {toastMessage}
  </div>
)}


{/* Paso 3 - Personal Information */}
      {step === 1 && (
<>
  <div className="flex justify-center items-center min-h-[200px]"> {/* Ajusta min-h según el alto deseado */}
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
        Social ID
      </label>
      <input
        onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
        inputMode="numeric"
        name="social_id"
        placeholder="Social ID"
        value={formData.social_id}
        onChange={handleChange}
        className={`w-full border rounded px-3 py-2 ${
          errores.social_id ? 'border-red-500' : ''
        }`}
      />
    </div>
  </div>
</>

      )}

      {/* Paso 2 - Resume */}
      {step === 2 && (
<div className="flex flex-col items-center justify-center min-h-[290px]">
  <p className="mb-3 text-center max-w-xl">
    <strong>Got a resume?</strong> You can upload it in Word or PDF format and we'll use the information to pre-fill your application, saving you time! If you'd rather not upload one, just click <strong>'Next'</strong>.
  </p>
  <label className="block font-semibold mb-2">Upload PDFs (Max 1)</label>
  <input
    type="file"
    accept="application/pdf"
    onChange={handleFileChange}
    className="block mb-4 w-full max-w-md mt-10"
  />
  {files.length > 0 && (
    <div className="flex flex-wrap gap-2 max-w-md">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm max-w-xs truncate"
        >
          <span className="truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => handleRemoveFile(index)}
            className="ml-2 text-red-600 hover:text-red-800 font-bold"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>

      )}
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-sm animate-fade-in">
            {errorMsg}
          </div>
        )}


      {/* Paso 3 - Personal Information */}
      {step === 3 && (
        <>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column */}
    <div className="pr-6 border-r border-gray-300">
      {/* Personal Information */}
      <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div>
          <label className="text-left block text-sm font-medium text-gray-700">First Name</label>
          <input
            name="firstName"
            pattern="[A-Za-zÀ-ÿ\s]+"
            onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')}
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errores.firstName ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <label className="text-left block text-sm font-medium text-gray-700">Last Name</label>
          <input
            name="lastName"
            pattern="[A-Za-zÀ-ÿ\s]+"
            onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')}
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errores.lastName ? 'border-red-500' : ''}`}
          />
        </div>
          <div>
            <label className="text-left block text-sm font-medium text-gray-700">Date of Birth</label>
            <div className="flex justify-start">
            <ReactDatePicker
              selected={formData.dob ? parse(formData.dob, "MM/dd/yyyy", new Date()) : null}
              onChange={(date) => {
                const formatted = date ? format(date, "MM/dd/yyyy") : "";
                handleChange({ target: { name: "dob", value: formatted } });
              }}
              placeholderText="MM/DD/YYYY"
              dateFormat="MM/dd/yyyy"
              className={`w-full border rounded px-3 py-2 ${errores.dob ? "border-red-500" : ""}`}
              dropdownMode="select"
            />
          </div>

            </div>
      </div>

      {/* Contact Information */}
      <h2 className="text-2xl font-bold mt-10 mb-4">Contact Information</h2>
      <div className="space-y-4">
        <div>
          <label className="text-left block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errores.email ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <label className="text-left block text-sm font-medium text-gray-700">Phone</label>
          <input
            name="phone"
            onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
            inputMode="numeric"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errores.phone ? 'border-red-500' : ''}`}
          />
        </div>
      </div>
    </div>

    {/* Right Column */}
    <div className="pl-6">
      {/* Address */}
      <h2 className="text-2xl font-bold mb-4">Address</h2>
      <div className="space-y-4">
        <div>
          <label className="text-left block text-sm font-medium text-gray-700">Street</label>
          <input
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errores.street ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <label className="text-left block text-sm font-medium text-gray-700">City</label>
          <input
            pattern="[A-Za-zÀ-ÿ\s]+"
            onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')}
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errores.city ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <label className="text-left block text-sm font-medium text-gray-700">State</label>
          <input
            pattern="[A-Za-zÀ-ÿ\s]+"
            onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')}
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errores.state ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <label className="text-left block text-sm font-medium text-gray-700">ZIP</label>
          <input
            name="zip"
            onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
            inputMode="numeric"
            placeholder="ZIP"
            value={formData.zip}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errores.zip ? 'border-red-500' : ''}`}
          />
        </div>
      </div>

      {/* Travel Availability */}
      <h2 className="text-2xl font-bold mt-10 mb-4">Travel Availability</h2>
      <label className="block text-sm font-medium text-gray-700 mb-1">Are you willing to travel?</label>
      <div className={`flex flex-col sm:flex-row items-center gap-4 ${errores.willingToTravel ? 'border border-red-500 p-2 rounded' : ''}`}>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="willingToTravel"
            value="yes"
            checked={formData.willingToTravel === 'yes'}
            onChange={handleChange}
            className="accent-red-600"
          />
          Yes
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="willingToTravel"
            value="no"
            checked={formData.willingToTravel === 'no'}
            onChange={handleChange}
            className="accent-red-600"
          />
          No
        </label>
      </div>
    </div>
  </div>

      {/* Estado Migratorio */}
      <div className="mt-10 border-t border-gray-300 pt-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Immigration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Current Immigration Status */}
    <div>
      <label className="text-left block text-sm font-medium text-gray-700">Current Immigration Status</label>
      <select
        name="immigrationStatus"
        value={formData.immigrationStatus || ''}
        onChange={handleChange}
        className={`w-full border rounded px-3 py-2 ${errores.immigrationStatus ? 'border-red-500' : ''}`}
      >
        <option value="">Select status</option>
        <option value="Citizen">Citizen</option>
        <option value="Permanent Resident">Permanent Resident</option>
        <option value="Work Visa">Work Visa</option>
        <option value="Student Visa">Student Visa</option>
        <option value="Visitor">Visitor</option>
        <option value="Refugee">Refugee</option>
        <option value="Other">Other</option>
      </select>
    </div>

    {/* Visa Expiry Date */}
 <div>
  <label className="text-left block text-sm font-medium text-gray-700">Visa / Permit Expiry Date</label>
  <div className="flex justify-start">
    <ReactDatePicker
      selected={formData.visaExpiryDate ? parse(formData.visaExpiryDate, "MM/dd/yyyy", new Date()) : null}
      onChange={(date) => {
        const formatted = date ? format(date, "MM/dd/yyyy") : "";
        handleChange({ target: { name: "visaExpiryDate", value: formatted } });
      }}
      placeholderText="MM/DD/YYYY"
      dateFormat="MM/dd/yyyy"
      className={`w-full border rounded px-3 py-2 ${errores.visaExpiryDate ? "border-red-500" : ""}`}
      dropdownMode="select"
    />
  </div>
</div>


    {/* Authorized to Work */}
    <div className="flex items-center gap-2">
      <input
        id="workAuthorization"
        name="workAuthorization"
        type="checkbox"
        checked={formData.workAuthorization || false}
        onChange={e => setFormData(prev => ({ ...prev, workAuthorization: e.target.checked }))}
        className="h-4 w-4 accent-red-600"
      />
      <label htmlFor="workAuthorization" className="text-sm font-medium text-gray-700">
        Authorized to work in the country
      </label>
    </div>

    {/* Country of Origin */}
    <div>
      <label className="text-left block text-sm font-medium text-gray-700">Country of Origin</label>
      <input
        name="countryOfOrigin"
        placeholder="Country of Origin"
        value={formData.countryOfOrigin || ''}
        onChange={handleChange}
        className={`w-full border rounded px-3 py-2 ${errores.countryOfOrigin ? 'border-red-500' : ''}`}
      />
    </div>
  </div>
  </div>
  </>

      )}



      {/* Paso 4 - Military Experience */}
{step === 4 && (
  <>
    {/* Pregunta 1 */}
    <label className="block text-left font-semibold mb-1">
      1. Did you have military experience?
    </label>
    <div className={`flex flex-wrap items-center gap-6 mb-4 ${errores.dfac ? 'border border-red-500 p-2 rounded' : ''}`}>
      {['Yes', 'No'].map((option) => (
        <label key={option} className="flex items-center gap-2">
          <input
            type="radio"
            name="dfac"
            value={option}
            checked={formData.dfac === option}
            onChange={handleChange}
            className="accent-red-600"
          />
          <span className="text-sm text-gray-800">{option}</span>
        </label>
      ))}
    </div>

    {/* Pregunta 2 */}
    <label className="block text-left font-semibold mb-1">
      2. Branch of the U.S. Armed Forces
    </label>
    <div className={`flex flex-wrap items-center gap-6 mb-4 ${errores.branch ? 'border border-red-500 p-2 rounded' : ''}`}>
      {['Air Force', 'Army', 'Navy', 'U.S. Coast Guard', 'None'].map((option) => (
        <label key={option} className="flex items-center gap-2">
          <input
            type="radio"
            name="branch"
            value={option}
            checked={formData.branch === option}
            onChange={handleChange}
            className="accent-red-600"
          />
          <span className="text-sm text-gray-800">{option}</span>
        </label>
      ))}
    </div>

{/* Pregunta 3 - Airport Code */}
<label className="block text-left font-semibold mb-1">
  3. Departing airport (code)
</label>
<div className="flex justify-start">
  <input
    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
    inputMode="numeric"
    name="airport"
    placeholder="(code)"
    value={formData.airport}
    onChange={handleChange}
    className={`border rounded px-3 py-2 mb-4 w-32 ${errores.airport ? 'border-red-500' : ''}`}
  />
</div>


{/* Pregunta 4 - Fechas */}
<label className="block text-left font-semibold mb-1">4. Date Available</label>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
<div>
  <label className="block text-left font-semibold mb-1">- Start Date</label>
  <div className="flex justify-start">
    <ReactDatePicker
      selected={formData.startDate ? parse(formData.startDate, "MM/dd/yyyy", new Date()) : null}
      onChange={(date) => {
        const formatted = date ? format(date, "MM/dd/yyyy") : "";
        handleChange({ target: { name: "startDate", value: formatted } });
      }}
      placeholderText="MM/DD/YYYY"
      dateFormat="MM/dd/yyyy"
      className={`border rounded px-3 py-2 w-40 sm:w-48 ${errores.startDate ? "border-red-500" : ""}`}
    />
  </div>
</div>

{/* End Date */}
<div>
  <label className="block text-left font-semibold mb-1">- End Date</label>
  <div className="flex justify-start">
    <ReactDatePicker
      selected={formData.endDate ? parse(formData.endDate, "MM/dd/yyyy", new Date()) : null}
      onChange={(date) => {
        const formatted = date ? format(date, "MM/dd/yyyy") : "";
        handleChange({ target: { name: "endDate", value: formatted } });
      }}
      placeholderText="MM/DD/YYYY"
      dateFormat="MM/dd/yyyy"
      className={`border rounded px-3 py-2 w-40 sm:w-48 ${errores.endDate ? "border-red-500" : ""}`}
    />
  </div>
  </div>
</div>

  </>
)}


      {/* Paso 5 - References */}
{step === 5 && (
  <div className="flex gap-6">
    {/* Reference 1 */}
    {formData.references[0] && (
      <div className="flex-1 border border-gray-300 rounded-md p-4">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Reference 1</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Name</label>
            <input
              pattern="[A-Za-zÀ-ÿ\s]+"
              onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')}
              placeholder="Name"
              value={formData.references[0].name}
              onChange={(e) => handleRefChange(0, 'name', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Phone</label>
            <input
              placeholder="Phone"
              value={formData.references[0].phone}
              onChange={(e) => handleRefChange(0, 'phone', e.target.value)}
              className="w-full border rounded px-3 py-2"
              onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.references[0].email}
              onChange={(e) => handleRefChange(0, 'email', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>
    )}

    {/* Separador vertical */}
    <div className="w-px bg-gray-300"></div>

    {/* Reference 2 */}
    {formData.references[1] && (
      <div className="flex-1 border border-gray-300 rounded-md p-4">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Reference 2</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Name</label>
            <input
              pattern="[A-Za-zÀ-ÿ\s]+"
              onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')}
              placeholder="Name"
              value={formData.references[1].name}
              onChange={(e) => handleRefChange(1, 'name', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Phone</label>
            <input
              placeholder="Phone"
              value={formData.references[1].phone}
              onChange={(e) => handleRefChange(1, 'phone', e.target.value)}
              className="w-full border rounded px-3 py-2"
              onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.references[1].email}
              onChange={(e) => handleRefChange(1, 'email', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>
    )}
  </div>
)}



     {step === 6 && (
  <>
    {formData.workHistory.map((job, i) => (
      <div key={i} className="border border-gray-300 rounded-md p-4 mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">Work History {i + 1}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Employer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Employer Name</label>
            <input
              pattern="[A-Za-zÀ-ÿ\s]+"
              onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')}
              placeholder="Employer"
              value={job.employer}
              onChange={(e) => handleWorkChange(i, 'employer', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Phone</label>
            <input
              onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
              inputMode="numeric"
              placeholder="Phone"
              value={job.phone}
              onChange={(e) => handleWorkChange(i, 'phone', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Start Date</label>
              <div className="flex justify-start">


            <ReactDatePicker
              selected={job.start ? parse(job.start, 'MM/dd/yyyy', new Date()) : null}
              onChange={(date) => {
                const formattedDate = date ? format(date, 'MM/dd/yyyy') : '';
                handleWorkChange(i, 'start', formattedDate);
              }}
              dateFormat="MM/dd/yyyy"
              placeholderText="MM/DD/YYYY"
              className={`w-full border rounded px-3 py-2`}
            />
          </div>
              </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">End Date</label>
              <div className="flex justify-start">
            <ReactDatePicker
              selected={job.end ? parse(job.end, 'MM/dd/yyyy', new Date()) : null}
              onChange={(date) => {
                const formattedDate = date ? format(date, 'MM/dd/yyyy') : '';
                handleWorkChange(i, 'end', formattedDate);
              }}
              dateFormat="MM/dd/yyyy"
              placeholderText="MM/DD/YYYY"
              className={`w-full border rounded px-3 py-2`}
            />
          </div>


              </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Title</label>
            <input
              placeholder="Title"
              value={job.title}
              onChange={(e) => handleWorkChange(i, 'title', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Duties */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">Duties</label>
            <input
              placeholder="Duties"
              value={job.duties}
              onChange={(e) => handleWorkChange(i, 'duties', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Reason for Leaving (span 2 columns) */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Reason for Leaving</label>
            <input
              placeholder="Reason for leaving"
              value={job.reason}
              onChange={(e) => handleWorkChange(i, 'reason', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

        </div>
      </div>
    ))}
  </>
)}

      {/* Paso 7 - Additional Info */}
      {step === 7 && (
        <>
          <label className="block font-semibold mb-1">Were you referred to FPS by someone?</label>
          <select
            name="referred"
            value={formData.referred}
            onChange={handleChange}
 className={`border rounded px-3 py-2 w-full mb-3 ${errores.additionalInfo?.referred ? 'border-red-500' : ''}`}
          >
            <option value="">-- Select --</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <input
            name="referredBy"
            placeholder="If yes, who?"
            value={formData.referredBy}
            onChange={handleChange}
            className={`border rounded px-3 py-2 w-full mb-3 ${errores.additionalInfo?.referredBy ? 'border-red-500' : ''}`}
          />

<label className="block font-semibold mb-1">
  Please upload any certifications in the following areas: WRT certification, forklift operator, asbestos certification, scissors lift certification.
</label>
<input
  type="file"
  accept="application/pdf"
  multiple
  onChange={handleCertFileChange}
  className="block mb-4 w-full"
/>

{formData.certifications.length > 0 && (
  <div className="flex flex-wrap gap-2">
    {formData.certifications.map((file, index) => (
      <div
        key={index}
        className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm max-w-xs truncate"
      >
        <span className="truncate">{file.name}</span>
        <button
          type="button"
          onClick={() => handleRemoveCertFile(index)}
          className="ml-2 text-red-600 hover:text-red-800 font-bold"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}

        </>
      )}

        {/* Paso 8 - Confirmación */}
      {step === 8 && (
        <div className="space-y-6 text-gray-800">
          <section>
            <h3 className="font-bold text-lg mb-2 border-b pb-1 text-center">Job</h3>
              {job && typeof job === 'object' ? (
                <>
                  <p><strong>Name:</strong> {job.name}</p>
                  <p><strong>Type:</strong> {job.type}</p>
                  <p><strong>Location:</strong> {job.ubication}</p>
                  <p><strong>Description:</strong> {job.description}</p>
                </>
              ) : (
                <p>{job || 'No seleccionado'}</p>
              )}
            <h4 className="font-semibold mt-2 text-center">Uploaded PDFs:</h4>
            {files.length > 0 ? (
              <ul className="list-disc list-inside">
                {files.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            ) : (
              <p>No hay archivos subidos.</p>
            )}
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2 border-b pb-1 text-center">Personal Information</h3>
            <p className='text-left'><strong>First Name:</strong> {formData.firstName || '-'}</p>
            <p className='text-left'><strong>Last Name:</strong> {formData.lastName || '-'}</p>
            <p className='text-left'><strong>Social ID:</strong> {formData.social_id || '-'}</p>
            <p className='text-left'><strong>Date of Birth:</strong> {formData.dob || '-'}</p>
            <p className='text-left'><strong>Street:</strong> {formData.street || '-'}</p>
            <p className='text-left'><strong>City:</strong> {formData.city || '-'}</p>
            <p className='text-left'><strong>State:</strong> {formData.state || '-'}</p>
            <p className='text-left'><strong>ZIP:</strong> {formData.zip || '-'}</p>
            <p className='text-left'><strong>Email:</strong> {formData.email || '-'}</p>
            <p className='text-left'><strong>Phone:</strong> {formData.phone || '-'}</p>
            <p className='text-left'><strong>willingToTravel:</strong> {formData.willingToTravel || '-'}</p>
            <p className='text-left'><strong>Immigration Status:</strong> {formData.immigrationStatus || '-'}</p>
            <p className='text-left'><strong>Visa / Permit Expiry Date:</strong> {formData.visaExpiryDate || '-'}</p>
            <p className='text-left'><strong>Authorized to Work:</strong> {formData.workAuthorization ? 'Yes' : 'No'}</p>
            <p className='text-left'><strong>Country of Origin:</strong> {formData.countryOfOrigin || '-'}</p>

          </section>

          <section>
            <h3 className="font-bold text-lg mb-2 border-b pb-1 text-center">Military Experience</h3>
            <p className='text-left'><strong>Military Experience:</strong> {formData.dfac || '-'}</p>
            <p className='text-left'><strong>Branch:</strong> {formData.branch || '-'}</p>
            <p className='text-left'><strong>Departing Airport:</strong> {formData.airport || '-'}</p>
            <p className='text-left'><strong>Date Available:</strong></p>
            <p className='text-left'><strong>Date Start:</strong> {formData.startDate || '-'}</p>
            <p className='text-left'><strong>Date End:</strong> {formData.endDate || '-'}</p>
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2 border-b pb-1 text-center">References</h3>
            {formData.references.map((ref, i) => (
              <div key={i} className=" text-left mb-2">
                <p><strong>Name:</strong> {ref.name || '-'}</p>
                <p><strong>Phone:</strong> {ref.phone || '-'}</p>
                <p><strong>Email:</strong> {ref.email || '-'}</p>
                {i < formData.references.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2 border-b pb-1 text-center">Work History</h3>
            {formData.workHistory.map((jobHist, i) => (
              <div key={i} className="mb-4  text-left">
                <p><strong>Employer:</strong> {jobHist.employer || '-'}</p>
                <p><strong>Phone:</strong> {jobHist.phone || '-'}</p>
                <p><strong>Start Date:</strong> {jobHist.start || '-'}</p>
                <p><strong>End Date:</strong> {jobHist.end || '-'}</p>
                <p><strong>Title:</strong> {jobHist.title || '-'}</p>
                <p><strong>Duties:</strong> {jobHist.duties || '-'}</p>
                <p><strong>Reason for Leaving:</strong> {jobHist.reason || '-'}</p>
                {i < formData.workHistory.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2 border-b pb-1 text-center">Additional Information</h3>
            <p className='text-left'><strong>Referred:</strong> {formData.referred || '-'}</p>
            <p className='text-left'><strong>If yes, who?:</strong> {formData.referredBy || '-'}</p>
            <p className='text-left'><strong>Certifications:</strong></p>
            {formData.certifications && formData.certifications.length > 0 ? (
              <ul className="list-disc list-inside">
                {formData.certifications.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            ) : (
              <p className="ml-2">No certification files uploaded.</p>
            )}

          </section>
        </div>
      )}


    </form>
      <div className="flex justify-between pt-6">
        {step > 0 && (
          <button type="button" onClick={handleBack} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button type="button" onClick={handleNext} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
            Next
          </button>
        ) : (
          <button type="submit" onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Submit
          </button>
        )}
      </div>
      </>
  );
}
