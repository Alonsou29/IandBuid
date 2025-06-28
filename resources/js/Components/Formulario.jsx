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
  'Personal Information (Driver License)',
  'Resume Upload',
  'Personal Information',
  'Military Experience',
  'References',
  'Work History',
  'Submit',
  'Contract',
];

export default function Formulario({ selectedJob, prefilledData = null }) {
  const [toastMessage, setToastMessage] = useState(null);
  const [errores, setErrores] = useState({});
  const [certFiles, setCertFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [step, setStep] = useState(0);
  const [job, setJob] = useState(selectedJob || "");
  const showJobSelect = !selectedJob;
  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState(() => {
    if (prefilledData) {
      return {
        ...prefilledData,
        occupation_id: selectedJob?.id || prefilledData.occupation_id || '',
      };
    } else {
      return {
        firstName: '',
        lastName: '',
        social_id: '',
        dob: null,
        street: '',
        city: '',
        state: '',
        zip: '',
        email: '',
        phone: '',
        willingToTravel: '',
        immigrationStatus: '',
        otherImmigrationStatus: '',
        dfac: '',
        branch: '',
        airport: '',
        startDate: null,
        endDate: null,
        references: [
          { name: '', phone: '', email: '' },
          { name: '', phone: '', email: '' },
        ],
        workHistory: [
          { employer: '', phone: '', start: null, end: null, title: '', duties: '', reason: '' },
          { employer: '', phone: '', start: null, end: null, title: '', duties: '', reason: '' },
        ],
        certifications: [],
        contractFile: null,
        resume: null,
        driverLicenseImage: null,
        occupation_id: selectedJob?.id || '',
      };
    }
  });

const formatDate = (value) => {
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '-';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  } catch {
    return '-';
  }
};

    // --- FUNCIONES PARA MANEJO DE MENSAJES ---
  // Mostrar mensaje tipo toast por 2.5 segundos
const showErrorToast = (msg) => {
  setToastMessage(msg);
  setTimeout(() => setToastMessage(null), 2500);
};


// --- FUNCIONES DE NAVEGACIÓN ---

// Función separada para buscar empleado por social_id
const fetchEmployeeBySocialId = async (socialId) => {
  try {
    const response = await axios.get(`/EmployeeWithSocialId/${socialId}`);

    if (response.status === 202) {
      const { employee, address } = response.data;

      return {
        employee,
        address: Array.isArray(address) && address.length > 0 ? address[0] : null,
      };
    }

    return null;
  } catch (error) {
    console.error('Error al buscar el empleado:', error);
    return null;
  }
};

// Avanzar al siguiente paso con validación
const handleNext = async (e) => {
  e.preventDefault();

  // Validar campos del paso actual
  if (!validateCurrentStep()) {
    return; // No avanzar si hay errores
  }

  // Si estamos en el paso 1 y hay un social_id, intentar buscar al empleado
  if (formData.social_id !== '' && step === 1) {
    const data = await fetchEmployeeBySocialId(formData.social_id);

    if (data && data.employee) {
      const { employee, address } = data;

      // Convertir fechas string a objetos Date (o null si no hay fecha)
      const dob = employee.birthday ? new Date(employee.birthday) : null;
      const startDate = employee.startDate ? new Date(employee.startDate) : null;
      const endDate = employee.endDate ? new Date(employee.endDate) : null;

      // Si tienes workHistory, convertir también las fechas
      const mappedWorkHistory = (employee.workHistory || []).map(job => ({
        ...job,
        start: job.start ? new Date(job.start) : null,
        end: job.end ? new Date(job.end) : null,
      }));

      setFormData((prevData) => ({
        ...prevData,
        social_id: employee.social_id,
        firstName: employee.name,
        lastName: employee.lastname,
        dob,
        email: employee.email,
        phone: employee.phone_number,
        airport: employee.airport,
        willingToTravel: employee.avaible_travel === 1 ? 'Yes' : 'No',
        startDate,
        endDate,
        state: address?.state || '',
        city: address?.city || '',
        street: address?.street || '',
        zip: address?.zip || '',
        workHistory: mappedWorkHistory.length > 0 ? mappedWorkHistory : prevData.workHistory
      }));

      // Saltamos 6 pasos si empleado ya existe
      setStep((prev) => prev + 6);
      return;
    }
  }

  // Si no se encontró el empleado o no estamos en el paso 1, avanzamos normalmente
  setStep((prev) => prev + 1);
};




function isValidDate(dateInput) {
  // Si ya es un objeto Date
  if (dateInput instanceof Date && !isNaN(dateInput)) {
    return true;
  }

  // Si es string, verificar formato MM/DD/YYYY
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
  if (!regex.test(dateInput)) return false;

  const [month, day, year] = dateInput.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year &&
         date.getMonth() === month - 1 &&
         date.getDate() === day;
}


function calculateAge(dateInput) {
  let dob;

  if (typeof dateInput === 'string') {
    const [month, day, year] = dateInput.split('/').map(Number);
    dob = new Date(year, month - 1, day);
  } else if (dateInput instanceof Date && !isNaN(dateInput)) {
    dob = dateInput;
  } else {
    return null; // entrada inválida
  }

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



if (step === 2) {
  const newErrors = {};
  const maxFileSize = 3 * 1024 * 1024;

  // Resume
  if (formData.resume) {
    if (formData.resume.size > maxFileSize) {
      const msg = 'Resume must be 3MB or less.';
      newErrors.resume = msg;
      showErrorToast(msg);
    }
  }

  // Certifications
  if (formData.certifications) {
    if (formData.certifications.length > 7) {
      const msg = 'You can upload up to 7 certification files.';
      newErrors.certifications = msg;
      showErrorToast(msg);
    }

    const oversized = formData.certifications.filter(file => file.size > maxFileSize);
    if (oversized.length > 0) {
      const msg = 'Each certification must be 3MB or less.';
      newErrors.certifications = msg;
      showErrorToast(msg);
    }
  }

  setErrores(newErrors);
  return Object.keys(newErrors).length === 0;
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

const isValidDate = (date) =>
  date instanceof Date && !isNaN(date.getTime());


 const { startDate, endDate } = formData;

if (startDate && !isValidDate(startDate)) {
  newErrors.startDate = true;
  showErrorToast("Start date is invalid.");
}

if (endDate && !isValidDate(endDate)) {
  newErrors.endDate = true;
  showErrorToast("End date is invalid.");
}


  // Validación de rango de fechas (solo si ambas son válidas)
if (
  startDate &&
  endDate &&
  isValidDate(startDate) &&
  isValidDate(endDate)
) {
  const start = startDate;
  const end = endDate;

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
      job.employer?.trim() !== '' &&
      job.phone?.trim() !== '' &&
      job.start instanceof Date &&
      !isNaN(job.start) &&
      job.end instanceof Date &&
      !isNaN(job.end) &&
      job.title?.trim() !== '' &&
      job.duties?.trim() !== '' &&
      job.reason?.trim() !== '';


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
const handleFileChange = (e, fieldName) => {
  const selected = Array.from(e.target.files);
  const maxFileSize = 3 * 1024 * 1024; // 3MB

  if (!selected.length) return;

  // Resume, Contract o Driver License Image (solo 1 archivo)
  if (['resume', 'contract', 'driverLicenseImage'].includes(fieldName)) {
    const file = selected[0];

    if (file.size > maxFileSize) {
      const fieldLabel = fieldName === 'resume' ? 'Resume' : fieldName === 'contract' ? 'Contract' : 'Driver License image';
      showErrorToast(`${fieldLabel} must be 3MB or less.`);
      return;
    }

    if (fieldName === 'resume') {
      if (files.length >= 1) {
        showErrorToast('You can upload only 1 resume file.');
        return;
      }
      setFiles([file]);
      setFormData(prev => ({ ...prev, resume: file }));
    } else if (fieldName === 'driverLicenseImage') {
      setFormData(prev => ({ ...prev, driverLicenseImage: file }));
    } else if (fieldName === 'contract') {
      setFormData(prev => ({ ...prev, contract: file }));
    }
  }

  // Certifications
  if (fieldName === 'certifications') {
    const oversized = selected.filter(f => f.size > maxFileSize);
    if (oversized.length > 0) {
      showErrorToast('Each certification must be 3MB or less.');
      return;
    }

    const combined = [...(formData.certifications || []), ...selected];
    if (combined.length > 7) {
      showErrorToast('You can upload up to 7 certification files.');
      return;
    }

    setFormData(prev => ({ ...prev, certifications: combined }));
  }
};



// Manejar la eliminación del archivo contract
const handleRemoveContractFile = () => {
  setFormData(prev => ({ ...prev, contractFile: null }));
};

// Eliminar certificado
const handleRemoveCertFile = (index) => {
  setFormData(prev => ({
    ...prev,
    certifications: prev.certifications.filter((_, i) => i !== index)
  }));
};

// Eliminar resume
const handleRemoveFile = (index) => {
  const updated = files.filter((_, i) => i !== index);
  setFiles(updated);
  if (updated.length === 0) {
    setFormData(prev => ({ ...prev, resume: null }));
  }
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



  // --- FUNCIONES AUXILIARES ---
  // Verifica si un objeto está vacío o todos sus valores son cadenas vacías

  const isEmptyObject = (obj) => {
  return Object.values(obj).every(value => String(value).trim() === '');
};

const showSimilarJobsModal = async (jobs, formData) => {
  await MySwal.fire({
    title: 'Other Jobs You May Like',
    html: (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 bg-white rounded shadow">
            <h3 className="text-red-600 font-bold">{job.name}</h3>
            <p className="text-sm"><strong>Type:</strong> {job.type}</p>
            <p className="text-sm mb-2"><strong>Location:</strong> {job.ubication}</p>
            <button
              onClick={() => {
                MySwal.close();
                MySwal.fire({
                  title: `Apply for ${job.name}`,
                  html: <Formulario selectedJob={job} prefilledData={formData} />,
                  showConfirmButton: false,
                  showCloseButton: true,
                  width: "80%",
                  customClass: {
                      popup: "overflow-auto max-h-[100vh] p-4 fixed-height-modal",
                    },
                });
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2"
            >
              Apply with Same Info
            </button>
          </div>
        ))}
      </div>
    ),
    showConfirmButton: false,
    showCloseButton: true,
    width: '80%',
    background: '#f9f9f9',
  });
};


const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ 2. Validación: tamaño máximo del resume
  if (formData.resume) {
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (formData.resume.size > maxSize) {
      showErrorToast("Resume file must be smaller than 5MB.");
      return;
    }
  }

  // ✅ 3. Validaciones para certifications
  if (formData.certifications && formData.certifications.length > 0) {
    const maxCertFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (formData.certifications.length > maxCertFiles) {
      showErrorToast("You can upload a maximum of 5 certification files.");
      return;
    }

    const oversized = formData.certifications.find(file => file.size > maxSize);
    if (oversized) {
      showErrorToast(`Each certification file must be under 5MB. "${oversized.name}" is too large.`);
      return;
    }
  }

  // ✅ 4. Convertir fechas y normalizar datos
const formatDateToMySQL = (date) => {
  if (!date) return null;

  // Si ya es string con formato correcto
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // Si es string tipo MM/DD/YYYY
  if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    const [month, day, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }

  // Si es un objeto Date
  if (date instanceof Date && !isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return null; // Si no pasa ninguna validación
};



  const normalizedData = {
    ...formData,
    dfac: formData.dfac === 'Yes' ? 1 : 0,
    willingToTravel: formData.willingToTravel === 'yes' ? 1 : 0,
    referred: formData.referred === 'Yes' ? 1 : 0,
    dob: formatDateToMySQL(formData.dob),
    startDate: formatDateToMySQL(formData.startDate),
    endDate: formatDateToMySQL(formData.endDate),
    occupation_id: parseInt(formData.occupation_id),
  };

  // ✅ 5. Armar formPayload
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

  // Solo agregamos si el valor no es null, undefined o cadena vacía
  if (value !== null && value !== undefined && value !== '') {
    formPayload.append(key, value);
  }
});


  if (formData.resume) {
    formPayload.append('resume', formData.resume);
  }

  if (formData.certifications && formData.certifications.length > 0) {
    formData.certifications.forEach((file) => {
      formPayload.append('certifications[]', file);
    });
  }

  if (formData.contractFile) {
    formPayload.append('contractFile', formData.contractFile);
  }

  if (formData.driverLicenseImage){
    formPayload.append('driverLicenseImage', formData.driverLicenseImage);
  }

  // ✅ Debug opcional
  for (const pair of formPayload.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  // ✅ Envío del formulario
try {
  const response = await axios.post('/createEmployee', formPayload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // Mostrar SweetAlert de éxito
  await MySwal.fire({
    icon: 'success',
    title: 'Form submitted successfully!',
    text: 'We will contact you soon. \n\nWould you like to apply for other occupations?',
    confirmButtonText: 'Yes',
    showDenyButton: true,
    denyButtonText: 'No'
  }).then(async (value)=>{
    if(value.isConfirmed){
        // Buscar trabajos similares y mostrar modal
        const types = (job?.type || '').split(',').map(t => t.trim()).filter(Boolean);
        if (types.length > 0) {
            try {
            const similarRes = await axios.post('/occupations/similar', { types });
            const similarJobs = similarRes.data;

            if (similarJobs.length > 0) {
                await showSimilarJobsModal(similarJobs, formData);
            }
            } catch (error) {
            console.error('Error fetching similar jobs:', error);
            // Opcional: manejar error con setErrorMsg o showErrorToast
            }
        }
    }
  });


} catch (error) {
  if (error.response) {
    console.error('Error response data:', error.response.data);
    if (error.response.data.validator) {
      const validatorErrors = error.response.data.validator.errors || error.response.data;
      setErrorMsg(JSON.stringify(validatorErrors, null, 2));
    } else {
      setErrorMsg('Error in the form validation.');
    }
  } else {
    console.error('Error general:', error);
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
          Driver License
        </label>
        <input
          onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
          inputMode="numeric"
          name="social_id"
          placeholder="Driver License"
          value={formData.social_id}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 ${
            errores.social_id ? 'border-red-500' : ''
          }`}
        />
        {errores.social_id && (
          <p className="text-red-500 text-sm mt-1">{errores.social_id[0]}</p>
        )}

        {/* Campo para subir imagen del Driver License */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => document.getElementById('driverLicenseInput').click()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Upload Driver License Image
          </button>

          <span className="text-gray-600 text-sm">
            {formData.driverLicenseImage
              ? formData.driverLicenseImage.name
              : 'No file selected'}
          </span>

          <input
            id="driverLicenseInput"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'driverLicenseImage')}
            className="hidden"
          />

          {/* Vista previa y botón para eliminar el archivo */}
          {formData.driverLicenseImage && (
            <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm max-w-xs truncate mt-2">
              <span className="truncate">{formData.driverLicenseImage.name}</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, driverLicenseImage: null }))}
                className="ml-2 text-red-600 hover:text-red-800 font-bold"
                aria-label="Remove driver license image"
              >
                ×
              </button>
            </div>
          )}
        </div>
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
          <div className="flex flex-col items-center gap-2 mt-10 max-w-md w-full">
          <button
            type="button"
            onClick={() => document.getElementById('resumeInput').click()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Choose Resume File
          </button>

          <span className="text-gray-600 text-sm">
            {formData.resume ? formData.resume.name : 'No resume file selected'}
          </span>

          <input
            id="resumeInput"
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange(e, 'resume')}
            className="hidden"
          />
        </div>

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
                selected={
                  formData.dob
                    ? formData.dob instanceof Date
                      ? formData.dob
                      : parse(formData.dob, "MM/dd/yyyy", new Date())
                    : null
                }
                onChange={(date) => {
                  handleChange({ target: { name: "dob", value: date } }); // ← guarda como objeto Date directamente
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
  <h2 className="text-2xl font-bold mb-4 text-center">Residence Status</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Current Immigration Status */}
    <div>
      <label className="text-left block text-sm font-medium text-gray-700">
        Residence Status
      </label>
      <select
        name="immigrationStatus"
        value={formData.immigrationStatus || ''}
        onChange={handleChange}
        className={`w-full border rounded px-3 py-2 ${errores.immigrationStatus ? 'border-red-500' : ''}`}
      >
        <option value="">Select status</option>
        <option value="Citizen">Citizen</option>
        <option value="Permanent Resident">Permanent Resident</option>
        <option value="Other">Other</option>
      </select>
    </div>

    {/* Additional field if status is "Other" */}
    {formData.immigrationStatus === 'Other' && (
      <div>
        <label className="text-left block text-sm font-medium text-gray-700">
          Please specify
        </label>
        <input
          type="text"
          name="otherImmigrationStatus"
          value={formData.otherImmigrationStatus || ''}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
    )}
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
  selected={formData.startDate || null}  // aquí un objeto Date o null
  onChange={(date) => {
    handleChange({ target: { name: "startDate", value: date } });  // guardar Date directamente
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
  selected={formData.endDate || null}
  onChange={(date) => {
    handleChange({ target: { name: "endDate", value: date } });
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
              selected={job.start || null}
              onChange={(date) => {
                handleWorkChange(i, 'start', date);
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
                  selected={job.end || null}
                  onChange={(date) => {
                    handleWorkChange(i, 'end', date);
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





        {/* Paso 8 - Confirmación */}
      {step === 7 && (
        <div className="space-y-6 text-gray-800">
          <section>
            <p className="font-bold text-lg mb-2 border-b pb-1 text-center"><strong>Job:</strong> {job.name}</p>
              {job && typeof job === 'object' ? (
                <>
                  <p><strong>Type:</strong> {job.type}</p>
                  <p><strong>Location:</strong> {job.ubication}</p>
                  <p><strong>Description:</strong> {job.description}</p>
                </>
              ) : (
                <p>{job || 'No seleccionado'}</p>
              )}
            <h4 className="font-semibold mt-2 text-center">Curriculum PDF Uploaded:</h4>
            {files.length > 0 ? (
              <ul className="list-disc list-inside">
                {files.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            ) : (
              <p>No files have been uploaded.</p>
            )}
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2 border-b pb-1 text-center">Personal Information</h3>
            <p className='text-left'><strong>First Name:</strong> {formData.firstName || '-'}</p>
            <p className='text-left'><strong>Last Name:</strong> {formData.lastName || '-'}</p>
            <p className='text-left'><strong>Driver License:</strong> {formData.social_id || '-'}</p>
            <p className='text-left'><strong>Date of Birth:</strong> {formatDate(formData.dob)}</p>
            <p className='text-left'><strong>Street:</strong> {formData.street || '-'}</p>
            <p className='text-left'><strong>City:</strong> {formData.city || '-'}</p>
            <p className='text-left'><strong>State:</strong> {formData.state || '-'}</p>
            <p className='text-left'><strong>ZIP:</strong> {formData.zip || '-'}</p>
            <p className='text-left'><strong>Email:</strong> {formData.email || '-'}</p>
            <p className='text-left'><strong>Phone:</strong> {formData.phone || '-'}</p>
            <p className='text-left'><strong>willingToTravel:</strong> {formData.willingToTravel || '-'}</p>
            <p className='text-left'><strong>Residence Status</strong> {formData.immigrationStatus || '-'}</p>


          </section>

          <section>
            <h3 className="font-bold text-lg mb-2 border-b pb-1 text-center">Military Experience</h3>
            <p className='text-left'><strong>Military Experience:</strong> {formData.dfac || '-'}</p>
            <p className='text-left'><strong>Branch:</strong> {formData.branch || '-'}</p>
            <p className='text-left'><strong>Departing Airport:</strong> {formData.airport || '-'}</p>
            <p className='text-left'><strong>Date Available:</strong></p>
            <p className='text-left'><strong>Date Start:</strong> {formatDate(formData.startDate)}</p>
            <p className='text-left'><strong>Date End:</strong> {formatDate(formData.endDate)}</p>
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
                <p><strong>Start Date:</strong> {formatDate(jobHist.start)}</p>
                <p><strong>End Date:</strong> {formatDate(jobHist.end)}</p>
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


          </section>
        </div>
      )}

        {/* Paso 8 - contrato */}
        {step === 8 && (
          <div className="flex flex-col gap-8">
            {/* CONTRACT SECTION */}
            <div className="text-center">
              <h2 className="font-bold text-lg mb-2">📄 Employee Worksheet Upload</h2>
              <p className="mb-4">
                <strong>PLEASE DOWNLOAD</strong><br />
                For a more effective assignment process for your job application, kindly download this document, complete the contract information, and then re-upload it to this section.
              </p>

              {/* Download + Re-upload */}
              <div className="flex justify-center gap-4 mb-6">
                <a
                  href="/files/Employee_Worksheet.docx"
                  download
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition shadow"
                >
                  Download Contract
                </a>

                <label className="bg-gray-100 text-gray-800 px-5 py-2 rounded-md cursor-pointer border border-gray-300 hover:bg-gray-200 transition shadow">
                  Re-upload Contract
                  <input
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => handleFileChange(e, 'contract')}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Show uploaded contract file */}
              {formData.contractFile && (
                <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm max-w-xs truncate">
                  <span className="truncate">{formData.contractFile.name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveContractFile}
                    className="ml-2 text-red-600 hover:text-red-800 font-bold"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* CERTIFICATIONS SECTION */}
            <div>
              <h2 className="font-bold text-lg mb-2">📎 Certifications (Optional)</h2>
              <p className="mb-2">
                You may upload any certificates that strengthen your work experience in this section. This is optional, and not having one will not affect the personnel selection process.
              </p>

              <label className="block mb-4 w-full text-center">
                <span className="text-sm block mb-2 font-medium">
                  Upload Certifications (PDF only)
                </span>

                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('certificationsInput').click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Choose Files
                  </button>

                  <span className="text-gray-600 text-sm">
                    {formData.certifications && formData.certifications.length > 0
                      ? `${formData.certifications.length} file(s) selected`
                      : 'No files selected'}
                  </span>
                </div>

                <input
                  id="certificationsInput"
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => handleFileChange(e, 'certifications')}
                  className="hidden"
                />
              </label>


              {/* Show uploaded certification files */}
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
            </div>
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
