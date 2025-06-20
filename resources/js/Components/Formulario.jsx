import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const steps = [
  'Job Information',
  'Resume',
  'Personal Information',
  'Military Experience',
  'References',
  'Work History',
  'Additional Information',
  'Submit',
];

export default function Formulario({ selectedJob }) {
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
  });

const handleNext = (e) => {
  e.preventDefault(); // prevenir que el formulario se envíe al hacer clic
  setStep(prev => prev + 1);
  console.log("handleNext called");
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

  const handleFileChange = (e) => {
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const selected = Array.from(e.target.files).filter(
    (file) => file.type === 'application/pdf'
  );

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

  const handleCertFileChange = (e) => {
  const selected = Array.from(e.target.files).filter(file => file.type === 'application/pdf');

  if (selected.length + formData.certifications.length > 10) {
    setErrorMsg('You can upload a maximum of 10 certification PDFs.');
    setTimeout(() => setErrorMsg(null), 2500);
    return;
  }

  setFormData(prev => ({
    ...prev,
    certifications: [...prev.certifications, ...selected]
  }));
};

const handleRemoveCertFile = (index) => {
  setFormData(prev => ({
    ...prev,
    certifications: prev.certifications.filter((_, i) => i !== index)
  }));
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    const dob = new Date(formData.dob);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear() - (today < new Date(dob.setFullYear(today.getFullYear())) ? 1 : 0);

    if (age < 18 || age > 70) {
      MySwal.fire('Invalid Age', 'Age must be between 18 and 70 years.', 'error');
      return;
    }

    if (/\d/.test(formData.firstName) || /\d/.test(formData.lastName)) {
      MySwal.fire('Invalid Name', 'First and Last Name should not contain numbers.', 'error');
      return;
    }

    if (/\d/.test(formData.city) || /\d/.test(formData.state)) {
      MySwal.fire('Invalid Address', 'City and State should not contain numbers.', 'error');
      return;
    }

    if (/[a-zA-Z]/.test(formData.phone)) {
      MySwal.fire('Invalid Phone', 'Phone number should not contain letters.', 'error');
      return;
    }

    formData.dfac = formData.dfac === 'Yes' ? 1:0;
    formData.willingToTravel = formData.willingToTravel === 'yes' ? 1:0;
    const response = await axios.post('/createEmployee', formData);
    console.log('Cliente registrado:', formData);
    MySwal.fire('Success', 'Form submitted successfully!', 'success');
  };

  return (
  <>
    {/* Paso actual como título */}
    <div className="text-start mb-6">
      <h2 className="text-3xl font-bold text-red-600">
        Step {step + 1}: {steps[step]}
      </h2>
    </div>

    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow rounded space-y-6">
      {/* Paso 1 - job */}
      {step === 0 && (
        <div className="space-y-6">
          {showJobSelect ? (
            <select
              className="w-full p-2 border rounded"
              value={job}
              onChange={(e) => setJob(e.target.value)}
            >
              <option value="">Select a job</option>
              {/* Aquí van tus opciones */}
            </select>
          ) : (
            selectedJob && (
              <div className="p-4 rounded shadow-sm border border-gray-300 space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">{selectedJob.name}</h3>
                <p><span className="font-medium text-gray-600">Type:</span> {selectedJob.type}</p>
                <p><span className="font-medium text-gray-600">Location:</span> {selectedJob.ubication}</p>
                <p><span className="font-medium text-gray-600">Description:</span> {selectedJob.description}</p>
              </div>
            )
          )}
        </div>
      )}



      {/* Paso 2 - Resume */}
      {step === 1 && (
        <div>
          <label className="block font-semibold mb-2">Upload PDFs (Max 1)</label>
          <input type="file" accept="application/pdf" multiple onChange={handleFileChange} className="block mb-4 w-full" />
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm max-w-xs truncate">
                  <span className="truncate">{file.name}</span>
                  <button type="button" onClick={() => handleRemoveFile(index)} className="ml-2 text-red-600 hover:text-red-800 font-bold">×</button>
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
      {step === 2 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-left block text-sm font-medium text-gray-700">First Name</label>
              <input name="firstName" pattern="[A-Za-zÀ-ÿ\s]+" onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')} placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="text-left block text-sm font-medium text-gray-700">Last Name</label>
              <input name="lastName" pattern="[A-Za-zÀ-ÿ\s]+" onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')} placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="text-left block text-sm font-medium text-gray-700">Social ID</label>
              <input onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} inputMode="numeric" name="social_id" placeholder="Social ID" value={formData.social_id} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="text-left block text-sm font-medium text-gray-700">Date of Birth</label>
              <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mt-6 mb-2 text-red-600">Address</h3>
            </div>

            <div>
              <label className="text-left block text-sm font-medium text-gray-700">Street</label>
              <input name="street" placeholder="Street" value={formData.street} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="text-left block text-sm font-medium text-gray-700">City</label>
              <input pattern="[A-Za-zÀ-ÿ\s]+" onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')} name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="text-left block text-sm font-medium text-gray-700">State</label>
              <input pattern="[A-Za-zÀ-ÿ\s]+" onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')} name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="text-left block text-sm font-medium text-gray-700">ZIP</label>
              <input name="zip" onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} inputMode="numeric" placeholder="ZIP" value={formData.zip} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mt-6 mb-2 text-red-600">Contact Information</h3>
            </div>

            <div>
              <label className="text-left block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="text-left block text-sm font-medium text-gray-700">Phone</label>
              <input name="phone" onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} inputMode="numeric" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mt-6 mb-2 text-red-600">Travel Availability</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Are you willing to travel?</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
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
        </>
      )}



      {/* Paso 4 - Military Experience */}
      {step === 3 && (
        <>
          <label className="block text-left font-semibold mb-1">1. Did you have military experience?</label>
          <div className="flex flex-wrap items-center gap-6 mb-4">
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

          <label className="block text-left font-semibold mb-1">2. Branch of the U.S. Armed Forces</label>
          <div className="flex flex-wrap items-center gap-6 mb-4">
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

          <label className="block text-left font-semibold mb-1">3. Departing airport (code)</label>
          <input
            onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
            inputMode="numeric"
            name="airport"
            placeholder="(code)"
            value={formData.airport}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full mb-4"
          />

          <label className="block text-left font-semibold mb-1">4. Date Available</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-left font-semibold mb-1">- Start Date</label>
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-left font-semibold mb-1">- End Date</label>
              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>
        </>
      )}

      {/* Paso 5 - References */}
      {step === 4 && (
        <>
          {formData.references.map((ref, i) => (
            <div key={i} className="border border-gray-300 rounded-md p-4 mb-6">
              <h4 className="text-lg font-semibold mb-2 text-gray-800">Reference {i + 1}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">Name</label>
                  <input
                  pattern="[A-Za-zÀ-ÿ\s]+" onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')}
                    placeholder="Name"
                    value={ref.name}
                    onChange={(e) => handleRefChange(i, 'name', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">Phone</label>
                  <input
                    placeholder="Phone"
                    value={ref.phone}
                    onChange={(e) => handleRefChange(i, 'phone', e.target.value)}
                    className="w-full border rounded px-3 py-2" onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}   inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">Email</label>
                  <input
                  type="email"
                    placeholder="Email"
                    value={ref.email}
                    onChange={(e) => handleRefChange(i, 'email', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      )}


      {/* Paso 6 - Work History */}
      {step === 5 && (
        <>
          {formData.workHistory.map((job, i) => (
            <div key={i} className="border border-gray-300 rounded-md p-4 mb-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Work History {i + 1}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">Employer Name</label>
                  <input
                  pattern="[A-Za-zÀ-ÿ\s]+" onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')}
                    placeholder="Employer"
                    value={job.employer}
                    onChange={(e) => handleWorkChange(i, 'employer', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">Phone</label>
                  <input
                  onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}   inputMode="numeric"
                    placeholder="Phone"
                    value={job.phone}
                    onChange={(e) => handleWorkChange(i, 'phone', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">Start Date</label>
                  <input
                    type="date"
                    value={job.start}
                    onChange={(e) => handleWorkChange(i, 'start', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">End Date</label>
                  <input
                    type="date"
                    value={job.end}
                    onChange={(e) => handleWorkChange(i, 'end', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">Title</label>
                  <input
                    placeholder="Title"
                    value={job.title}
                    onChange={(e) => handleWorkChange(i, 'title', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-left">Duties</label>
                  <input
                    placeholder="Duties"
                    value={job.duties}
                    onChange={(e) => handleWorkChange(i, 'duties', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 ">Reason for Leaving</label>
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
      {step === 6 && (
        <>
          <label className="block font-semibold mb-1">Were you referred to FPS by someone?</label>
          <select
            name="referred"
            value={formData.referred}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full mb-3"
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
            className="border rounded px-3 py-2 w-full mb-3"
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
      {step === 7 && (
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
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2 border-b pb-1 text-center">Military Experience</h3>
            <p className='text-left'><strong>DFAC Experience:</strong> {formData.dfac || '-'}</p>
            <p className='text-left'><strong>Branch:</strong> {formData.branch || '-'}</p>
            <p className='text-left'><strong>Departing Airport:</strong> {formData.airport || '-'}</p>
            <p className='text-left'><strong>Date Available:</strong> {formData.dateAvailable || '-'}</p>
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
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Submit
          </button>
        )}
      </div>
    </form>
      </>
  );
}
