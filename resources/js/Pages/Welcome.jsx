import React, { useState, useRef } from 'react';
import Navbar from '/resources/js/Components/Navbar';
import Card from '/resources/js/Components/Card';
import MeetOurTeam from '/resources/js/Components/MeetOurTeam';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const images = Array.from({ length: 14 }, (_, i) => `/PORTFOLIO/p${i + 1}.jpg`);

export default function Welcome() {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  const slider1 = useRef();
  const slider2 = useRef();

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
      
      <h1 className="font-spartan text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-snug sm:leading-tight md:leading-tight">
        YOUR POTENTIAL OUR STRENGTH
      </h1>

      <p className="font-spartan text-white text-sm sm:text-base md:text-lg lg:text-xl mb-6 leading-relaxed max-w-[700px] mx-auto">
        Looking for a place where your dedication drives big projects?
        <br className="hidden sm:block" />
        <br className="hidden sm:block" />
        Here, your work is key to reliable results.
      </p>

      <a
        href="/occupation"
        className="inline-block px-6 py-2 border-2 border-white text-white rounded-2xl bg-red-700 bg-opacity-25 hover:bg-red-600 hover:border-white transition w-max mx-auto text-sm sm:text-base"
      >
        JOIN OUR TEAM
      </a>

      <p className="font-spartan text-white text-sm sm:text-base md:text-lg mt-6 leading-relaxed max-w-[700px] mx-auto">
        Be part of operational transformation with talent that exceeds expectations.
      </p>
      
    </div>
  </div>
</section>

      {/* Sección WHO WE ARE */}
      <section id="whoweare" className="flex flex-col md:flex-row w-full min-h-[400px] px-4 sm:px-8 md:px-12 py-8 md:py-16 gap-8">
        {/* Texto */}
        <div className="md:w-2/3 flex flex-col justify-center space-y-10 text-center md:text-left">
          <div>
            <h2 className="font-spartan text-red-600 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Who Are We?
            </h2>
            <p className="font-spartan text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto md:mx-0">
              I&C Builders is a Locally owned company based in Lafayette LA. From your Office or Church to Large Government Projects, no job is too big or small. We are certified in shingles, metal, TPO, Torch-down and more!
            </p>
          </div>
          <div>
            <h2 className="font-spartan text-red-600 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Working Together
            </h2>
            <p className="font-spartan text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto md:mx-0">
              We offer an end-to-end client experience that includes seamless communication, budgeting, staffing, on-site organization, and solid, quality handiwork every time.
            </p>
          </div>
          <div>
            <h2 className="font-spartan text-red-600 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose Us?
            </h2>
            <p className="font-spartan text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto md:mx-0">
              We work with architects and designers to produce beautiful, functional structures. Call us today and bring our project management skills and extensive construction experience to your next project.
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-4 mt-4">
            <a
              href="#services"
              className="font-bold font-spartan inline-flex items-center text-black hover:text-black transition text-sm sm:text-base group"
            >
              DISCOVER MORE!
              <svg
                className="ml-2 w-4 h-4 transform group-hover:translate-y-1 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 7-7" />
              </svg>
            </a>

            <a
              href="/occupation"
              className="font-spartan inline-block px-6 py-2 border-2 border-black text-red-700 rounded-2xl bg-white bg-opacity-25 hover:bg-red-200 transition text-sm sm:text-base"
            >
              JOIN OUR TEAM
            </a>
          </div>
        </div>

        {/* Imagen */}
        <div className="md:w-1/3 hidden md:block rounded-lg overflow-hidden shadow-lg">
          <img
            src="/WHOWEARE/2.jpg"
            alt="Who We Are"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Sección SERVICES */}
      <section id="services" className="w-full px-6 py-12 bg-gray-100">
        <h2 className="text-black text-4xl font-bold text-center mb-12 font-spartan">
          SERVICES
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
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
                className="flex-grow h-[480px]"
              />
              <button
                type="button"
                className="mt-4 mx-12 border border-black text-black py-2 rounded-3xl hover:bg-black hover:text-white transition"
              >
                Find out more
              </button>
            </div>
          ))}
        </div>

        {/* Discover More - Centrado */}
        <div className="flex justify-center mt-12">
          <a
            href="#portfolio"
            className="font-bold font-spartan inline-flex items-center text-black hover:text-black transition text-sm sm:text-base group"
          >
            DISCOVER MORE
            <svg
              className="ml-2 w-4 h-4 transform group-hover:translate-y-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Sección PORTFOLIO */}
      <section id="portfolio" className="bg-white py-12 px-6 sm:px-10">
        <h2 className="text-black text-4xl font-bold text-center mb-8 font-spartan">
          PORTFOLIO
        </h2>

        <p className="text-center text-xl font-bold mb-10 max-w-4xl mx-auto px-4 sm:px-0">
          Experience the Craftsmanship: A Gallery of I and C Builders's Masterful Construction Projects
        </p>

        <div className="max-w-5xl mx-auto px-2 sm:px-0">
          {/* Carrusel principal */}
          <Slider
            asNavFor={nav2}
            ref={(slider) => setNav1(slider)}
            arrows={true}
            autoplay={true}
            autoplaySpeed={4000}
            slidesToShow={1}
            className="mb-4 rounded-lg shadow-lg"
          >
            {images.map((src, index) => (
              <div key={index} className="px-2">
                <img
                  src={src}
                  alt={`Project ${index + 1}`}
                  className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-contain rounded-lg shadow-md"
                />
              </div>
            ))}
          </Slider>

          {/* Miniaturas */}
          <Slider
            asNavFor={nav1}
            ref={(slider) => setNav2(slider)}
            slidesToShow={6}
            swipeToSlide={true}
            focusOnSelect={true}
            centerMode={true}
            arrows={false}
            className="mt-4"
          >
            {images.map((src, index) => (
              <div key={index} className="px-1">
                <img
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-20 w-full object-cover rounded border-2 border-transparent hover:border-red-500 transition duration-200"
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Sección JOIN */}
      <section id="join" className="bg-gray-100 py-12 px-6 sm:px-10">
        <h2 className="text-black text-4xl font-bold text-center mb-8 font-spartan">
          JOIN OUR TEAM AT I & C BUILDERS!
        </h2>

        <div className="max-w-3xl mx-auto text-gray-800 space-y-6 text-lg px-4 sm:px-0">
          <p>
            Are you looking for a career opportunity with a growing construction company?
            At <strong>I & C Builders</strong>, we’re seeking dedicated and skilled professionals to join our team in Lafayette, LA.
          </p>

          <div>
            <h3 className="text-2xl font-semibold mb-2 text-red-600">Why Work With Us?</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Career Growth:</strong> Opportunities for professional development and advancement.</li>
              <li><strong>Team Environment:</strong> A supportive and collaborative workplace.</li>
              <li><strong>Quality Projects:</strong> Work on exciting and high-profile construction projects.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2 text-red-600">Current Openings</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Sales</li>
              <li>Project Manager</li>
              <li>Labor Tech</li>
              <li>Office / Admin</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2 text-red-600">How To Apply?</h3>
            <p>Ready to take the next step?</p>
          </div>
        </div>

        <div className="flex justify-center mt-10 px-4 sm:px-0">
          <a
            href="/occupation"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-10 sm:px-32 rounded shadow transition duration-300"
          >
            Occupation Opportunities
          </a>
        </div>
      </section>

      {/* Sección MEET THE TEAM */}
      <section id="meettheteam" className="w-full bg-black py-12 px-4 sm:px-8 md:px-12">
        <MeetOurTeam />
      </section>

      {/* Sección CONTACT */}
      <section id="contact" className="w-full flex flex-col md:flex-row min-h-[600px]">
        {/* Lado Izquierdo */}
        <div className="w-full md:w-1/3 bg-black text-white flex flex-col justify-center items-center px-8 py-12 text-center space-y-6">
          <img src="/logo.png" alt="I & C Builders Logo" className="h-52 md:h-60 mb-4" />

          <div>
            <h3 className="text-3xl md:text-4xl font-bold font-spartan">I & C Builders</h3>
            <p className="mt-2 text-base md:text-lg">
              1200 Bertrand Dr, Lafayette, Louisiana 70506, United States
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base md:text-lg">Phone</h4>
            <p>(337) 345-1820</p>
          </div>

          <div>
            <h4 className="font-semibold text-base md:text-lg">Hours</h4>
            <p>Open today</p>
            <p>08:30 am – 05:00 pm</p>
          </div>
        </div>

        {/* Lado Derecho - Formulario */}
        <div className="w-full md:w-2/3 relative flex items-center justify-center overflow-hidden">
          {/* Fondo con imagen reflejada */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/contact.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'scaleX(-1)',
            }}
          >
            <div className="absolute inset-0 bg-red-600 bg-opacity-50" />
          </div>

          {/* Formulario más compacto y menos alto */}
          <div className="relative z-10 w-full max-w-2xl bg-gray-100 bg-opacity-20 backdrop-blur p-6 rounded-2xl shadow-lg mt-64">
            <h3 className="text-3xl font-bold text-white mb-4 font-spartan text-left">
              How we can help you?
            </h3>
            <form className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="flex-1 px-4 py-2 rounded-2xl bg-gray-100 bg-opacity-60 border border-gray-300 text-sm"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="flex-1 px-4 py-2 rounded-2xl bg-gray-100 bg-opacity-60 border border-gray-300 text-sm"
                />
              </div>

              <div className="flex gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="flex-1 px-4 py-2 rounded-2xl bg-gray-100 bg-opacity-60 border border-gray-300 text-sm"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  className="flex-1 px-4 py-2 rounded-2xl bg-gray-100 bg-opacity-60 border border-gray-300 text-sm"
                />
              </div>

              <textarea
                name="message"
                placeholder="What we can help with?"
                className="w-full px-4 py-2 rounded-2xl bg-gray-100 bg-opacity-60 border border-gray-300 text-sm min-h-[80px]"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-black text-white text-xs px-5 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

{/* Footer */}
<footer className="relative bg-white py-10 text-center text-black text-sm sm:text-base font-spartan font-extrabold">
  © 2024 I and C Builders - All rights reserved.

  <a
    href="/login"
    className="absolute bottom-4 right-6 text-red-600 hover:underline text-xs sm:text-sm font-normal"
  >
    Administrador
  </a>
</footer>


    </div>



  );
}
