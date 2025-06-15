import React from 'react';

export default function Card({ image, title, description, className }) {
  return (
    <div className={`max-w-sm border border-gray-300 rounded-lg overflow-hidden shadow-lg flex flex-col ${className}`}>
      <div className="relative w-full h-60 border-b border-gray-300 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Degradado superpuesto al borde inferior de la imagen */}
        <div
          className="absolute bottom-0 left-0 w-full h-12"
          style={{
            background: 'linear-gradient(to top, #b91c1c, transparent)',
          }}
        />
      </div>

      {/* Fondo rojo sólido para texto - altura flexible */}
      <div className="bg-red-600 p-6 text-white rounded-b-lg flex flex-col justify-between flex-grow min-h-[180px]">
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-base whitespace-pre-line">{description}</p>
        </div>
      </div>
    </div>
  );
}
