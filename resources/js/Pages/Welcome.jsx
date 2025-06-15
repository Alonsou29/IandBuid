import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Formulario from '../components/Formulario';

export default function Welcome() {
  return (
    <div className="relative">
      <Navbar />

      {/* Sección HOME */}
      <section id="home" className="relative w-full pt-[100px] sm:pt-16">
        <img
          src="/HOME/Fondo.jpg"
          alt="Fondo"
          className="w-full h-auto object-contain"
        />

        <div className="absolute top-0 right-0 h-full flex items-center justify-end mr-0">
          <div className="h-full w-full sm:w-[90%] md:w-[60%] mr-0 sm:mr-4 md:mr-8 backdrop-blur-md bg-black/20 px-4 py-6 sm:p-6 md:p-10 text-center flex flex-col justify-center rounded-none sm:rounded-l-xl">
            <h1 className="font-spartan text-white text-3xl sm:text-4xl sm:mt-10 md:text-5xl font-bold mb-6 leading-tight">
              YOUR POTENTIAL OUR STRENGTH
            </h1>
            <p className="font-spartan text-white text-xs sm:text-sm md:text-base mb-6 leading-relaxed">
              Looking for a place where your dedication drives big projects?
              <br />
              <br />
              Here, your work is key to reliable results.
            </p>
            <a
              className="inline-block px-4 py-1 border-2 border-white text-white rounded-2xl bg-red-700 bg-opacity-25 hover:bg-red-600 hover:border-white transition w-max mx-auto"
            >
              JOIN OUR TEAM
            </a>
            <p className="font-spartan text-white text-xs sm:text-sm md:text-base mt-6">
              Be part of operational transformation with talent that exceeds expectations.
            </p>
          </div>
        </div>
      </section>


        <section id="whoweare" className="flex flex-col md:flex-row w-full min-h-[400px]">

            <div className="md:w-1/2 p-6 flex flex-col justify-center space-y-8 
                            text-center md:text-justify">
                <div>
                <h2 className="font-spartan text-red-600 text-4xl md:text-4xl lg:text-5xl font-bold mb-4">
                    Who Are We?
                </h2>
                <p className="font-spartan text-lg md:text-lg lg:text-xl mb-4">
                    I&C Builders is a Locally owned company based in Lafayette LA. From your Office or Church to Large Government Projects, no job is too big or small. We are certified in shingles, metal, TPO, Torch-down and more!
                </p>
                </div>
                <div>
                <h2 className="font-spartan text-red-600 text-4xl md:text-4xl lg:text-5xl font-bold mb-4">
                    Working Together
                </h2>
                <p className="font-spartan text-lg md:text-lg lg:text-xl mb-4">
                    We offer an end-to-end client experience that includes seamless communication, budgeting, staffing, on-site organization, and solid, quality handiwork every time.
                </p>
                </div>
                <div>
                <h2 className="font-spartan text-red-600 text-4xl md:text-4xl lg:text-5xl font-bold mb-4">
                    Why Choose Us?
                </h2>
                <p className="font-spartan text-lg md:text-lg lg:text-xl mb-4">
                    We work with architects and designers to produce beautiful, functional structures. Call us today and bring our project management skills and extensive construction experience to your next project.
                </p>
                </div>
            </div>

            <div className="md:w-1/2 hidden md:block">
                <img
                src="/WHOWEARE/2.jpg"
                alt="Who We Are"
                className="w-full h-full object-cover"
                />
            </div>
        </section>

        <section id="services" className="w-full px-6 py-12 bg-white">
        <h2 className="text-black text-4xl font-bold text-center mb-12 font-spartan">
            SERVICES
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {[{
            title: "Commercial & Residential ROOFING",
            description: `Everyone wants a dry building! Let us repair or replace your roof. We are certified in Shingles, Metal, Flat roof, TPO, and more.`,
            image: "/SERVICES/s1.png"
            }, {
            title: "Commercial & Residential FRAMING",
            description: `We don't just build; we create lifetimes of memories.\n\nBuilding your dreams, one nail at a time.`,
            image: "/SERVICES/s2.png"
            }, {
            title: "Commercial & Residential REMODELS",
            description: `Whether it's a small roof or whole new office, your dreams are a phone call away.`,
            image: "/SERVICES/s3.png"
            }, {
            title: "Commercial & Residential ADDITIONS",
            description: `Whether it is a few feet to open a room or doubling the size of your space I&C Builders will take care of all your needs.`,
            image: "/SERVICES/s4.png"
            }].map(({title, description, image}, idx) => (
            <div key={idx} className="flex flex-col">
                <Card 
                title={title} 
                description={description} 
                image={image} 
                className="flex-grow h-[480px]"  // altura fija y ocupa el espacio disponible
                />
                <button
                type="button"
                className="mt-4 mx-12 border  border-black text-black py-2 rounded-3xl hover:bg-black hover:text-white transition"
                >
                Find out more
                </button>
            </div>
            ))}
        </div>
        </section>


        <section id="join" className="bg-gray-100">
        <h2 className="text-black text-4xl font-bold text-center mb-12 font-spartan pt-8">
            JOIN OUR TEAM!
        </h2>

            <Formulario></Formulario>
        </section>


    </div>
  );
}
