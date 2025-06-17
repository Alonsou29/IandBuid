import React, { useState, useRef, useEffect } from 'react';
import Navbar from '/resources/js/Components/Navbar';
import Card from '/resources/js/Components/Card';
import MeetOurTeam from '/resources/js/Components/MeetOurTeam';
import Formulario from '/resources/js/Components/Formulario';
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

 {/* Sección PORTFOLIO */}
      <section id="portfolio" className="bg-gray-100 py-12 px-6 sm:px-10">
        <h2 className="text-black text-4xl font-bold text-center mb-8 font-spartan">
          PORTFOLIO
        </h2>

        <p className="text-center text-xl font-bold mb-10">
          Experience the Craftsmanship: A Gallery of I and C Builders's Masterful Construction Projects
        </p>

        <div className="max-w-5xl mx-auto">
          {/* Carrusel principal */}
          <Slider
            asNavFor={nav2}
            ref={(slider) => setNav1(slider)}
            arrows={true}
            autoplay={true}
            autoplaySpeed={4000}
            slidesToShow={1}
            className="mb-4"
          >
            {images.map((src, index) => (
              <div key={index} className="px-2">
                <img
                  src={src}
                  alt={`Project ${index + 1}`}
                  className="w-full h-[600px] object-contain rounded-lg shadow-md"
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


        <section id="join" className="bg-gray-100 py-12 px-6 sm:px-10">
          <h2 className="text-black text-4xl font-bold text-center mb-8 font-spartan">
            JOIN OUR TEAM AT I & C BUILDERS!
          </h2>

          <div className="max-w-3xl mx-auto text-gray-800 space-y-6 text-lg">
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

          <div className="flex justify-center mt-10">
            <a
              href="/occupation"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-32 rounded shadow transition duration-300"
            >
              Occupation Opportunities
            </a>
          </div>
        </section>



        <section id="meettheteam" className="w-full  bg-black">

            <MeetOurTeam></MeetOurTeam>
        </section>


        <section id="contact" className="w-full  bg-black">

        </section>


    </div>
  );
}
