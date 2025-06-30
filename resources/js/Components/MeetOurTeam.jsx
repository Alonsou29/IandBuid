import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const teamMembers = [
  {
    name: 'Carlos Esteban',
    title: 'President',
    description: `With 14 years in the construction industry and 12 years as a welding supervisor, Carlos has cultivated a successful career leading large-scale commercial projects. Six years ago, he founded I&C Builders, starting out by subcontracting and gradually growing into an independent powerhouse in the industry. One of his most notable accomplishments was completing work on 150 churches in New Orleans in less than eight months, a testament to his project management skills and efficiency. In addition to his construction ventures, Carlos has owned a car dealership for the past nine years and recently expanded into healthcare with the launch of a new infusion clinic this year. His commitment to the community is evident, as he played a key role in helping with recovery efforts in Houma after Hurricane Ida. Bilingual and a seasoned leader, Carlos, excels in managing teams, client relations, and project coordination. Outside of work, he enjoys golfing and traveling, balancing his entrepreneurial success with his passion for exploration. His leadership continues to drive the growth and success of our company. `,
    phone: '985-855-8424',
    image: '/TEAM/t1.jpg',
  },
  {
    name: 'Carlos Toca',
    title: 'Senior Estimator',
    description: `With over 20 years of experience in the construction industry, Carlos brings a wealth of knowledge and expertise to our team. He holds a bachelor’s degree in business administration, complemented by studies in both Architecture and Civil Engineering, making him uniquely qualified to handle complex projects. Carlos specializes in membrane and metal roofing systems, with extensive experience in estimating and project management across the Southeast United States. Throughout his distinguished career, Carlos has worked on a wide range of projects, from large-scale commercial buildings, such as hotels and fast-food establishments, to residential housing. Notably, he has completed over 300 homes for the U.S. Navy and managed a team of 79 construction tradesmen at Naval Air Station (NSA) in Pensacola. In his downtime, Carlos enjoys watching football, playing golf, and honing his skills in landscaping. A proud father of four and grandfather of six, he values time with his family just as much as his time on the job. Carlos’s dedication, attention to detail, and leadership along with being bilingual makes him an invaluable asset to our team. `,
    email: 'carlos.toca@iandcbuilders.com',
    phone: '337-335-8353',
    image: '/TEAM/t3.jpg',
  },
    {
    name: 'Katie Peltier',
    title: 'Business Development',
    description: `With a background in both medical aesthetics and strategic marketing, Katie brings a unique perspective to business development at I & C Builders. Her career began in the beauty and wellness industry, where she led clinical operations, tripled annual revenue, and developed a strong foundation in client communication and brand growth. Katie now specializes in B2B construction sales and relationship development, managing multimillion-dollar pipelines and forging lasting partnerships with developers, property managers, and contractors. She is known for her confident approach, hands-on grit, and ability to translate customer needs into action—from pre-bid meetings to site visits and subcontractor coordination. In addition to her professional experience, Katie spent several years teaching aesthetics and business strategy, giving her a strong edge in communication, leadership, and team development. Her creativity and eye for detail, once used in aesthetics, now fuel strategic outreach campaigns and construction industry marketing. With a bold, dynamic spirit and a proven record of driving growth, Katie is an integral part of the I & C Builders team.`,
    email: 'katie@iandcbuilders.com',
    phone: '337-523-2906',
    image: '/TEAM/t5.jpg',
  },
      {
    name: 'Fernando Blanco',
    title: 'Production Manger',
    description: `With five years of experience in the construction field and six years in manufacturer sales, Fernando brings a well-rounded skill set to his role as Project Manager. His expertise spans project management, client and vendor communication, and budget oversight. He has successfully handled large commercial projects and is known for ensuring smooth operations from start to finish. In addition to his role here, Fernando specializes in concrete through his own company, bringing a hands-on approach and deep industry knowledge to every project. As a bilingual professional, he excels in managing diverse teams and client relationships. His strong background in both construction and sales makes him an essential asset to our team, ensuring projects are delivered on time and within budget.`,
    email: 'fernando@iandcbuilders.com',
    phone: '337-660-5740',
    image: '/TEAM/t6.jpg',
  },
      {
    name: 'Karol Bastidas',
    title: 'Trade Partner Coordinator',
    description: `With over a decade of experience managing large-scale construction operations and workforce logistics across the U.S., Karol brings deep industry knowledge and leadership to I & C Builders. She has successfully led federal and private sector projects totaling over $6 billion, overseeing hundreds of subcontractors and ensuring safe, efficient project delivery under strict compliance standards. As Trade Partner Coordinator, Karol serves as the primary point of contact for subcontractor relations and field workforce development. Her bilingual communication skills, paired with her background in mechanical engineering and certifications in safety and compliance, make her an invaluable bridge between our project management team and the skilled trades we rely on. Karol is committed to quality, safety, and workforce empowerment. Whether she’s recruiting top-tier talent or aligning teams for a successful build, she ensures I & C Builders delivers with excellence—every time.`,
    email: 'Karol@iandcbuilders.com',
    phone: '337-295-2408',
    image: '/TEAM/t7.jpg',
  },
      {
    name: 'Alvaro Aponte',
    title: 'Accounting Department',
    description: `Alvaro brings extensive experience in financial management, auditing, and strategic planning to the I & C Builders team. As a bilingual CPA with a strong background in both public and private sectors, he has successfully supported a wide range of industries including manufacturing, retail, and construction. Alvaro excels at analyzing complex financial data, preparing detailed reports, and improving operational efficiency through process optimization.

With a keen eye for accuracy and compliance, Alvaro oversees accounts receivable, prepares financial statements, and ensures timely vendor and client payments. His experience includes managing high-volume financial operations, training new staff, and implementing systems to streamline cash flow and budget forecasting. A collaborative and solutions-driven professional, Alvaro plays a vital role in supporting I & C Builders’ continued growth through sound financial practices and forward-thinking insights.`,
    email: 'Alvaro@iandcbuilders.com',
    phone: '337-345-1820',
    image: '/TEAM/t8.jpg',
  },
      {
    name: 'Mayzee LaFleur',
    title: 'Administrative Assistant',
    description: `WMayzee brings a strong background in customer service, team coordination, and high-pressure multitasking to the I and C Builders team. With experience working in fast-paced, high-traffic restaurant environments, she excels at juggling multiple responsibilities while keeping both clients and coworkers at ease. Her positive attitude and natural people skills make her a great fit for handling internal operations, front office communication, and keeping the team running smoothly behind the scenes.

Outside of work, Mayzee has also served as a dance instructor and assistant cheer coach, where she motivated students to reach their full potential through encouragement, structure, and creativity. Her blend of reliability and personality makes her the heartbeat of our front office.`,
    email: 'Mayzee@iandcbuilders.com',
    phone: '337-345-1820',
    image: '/TEAM/t9.jpg',
  },
];

const MeetOurTeam = () => {

 const [expandedStates, setExpandedStates] = useState({});

  const toggleExpanded = (index) => {
    setExpandedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: true,
    adaptiveHeight: true, // ✅ esta línea es la clave
    nextArrow: <div className="text-red-600 text-3xl">&#10095;</div>,
    prevArrow: <div className="text-red-600 text-3xl">&#10094;</div>,
  };

  return (
    <section className="bg-black py-12 px-6 sm:px-12" id="team">
      <h2 className="text-center text-4xl font-bold mb-8 font-spartan text-white">
        Meet Our Team
      </h2>
      <Slider {...settings}>
        {teamMembers.map((member, index) => {
          const isExpanded = expandedStates[index];
          const previewText = member.description.slice(0, 800);

          return (
            <div key={index} className="w-full block">
              <div className="flex flex-col md:flex-row items-start justify-between gap-8 p-6 max-w-6xl mx-auto">
                {/* Imagen a la izquierda */}
                <div className="md:w-1/2">
                  <img src={member.image} alt={member.name} className="rounded-lg shadow-md w-full h-auto object-cover" />
                </div>

                {/* Texto a la derecha */}
                <div className="w-full md:w-1/2 text-white flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-5xl font-bold mb-2 text-center">{member.name}</h3>
                    <p className="text-2xl font-semibold mb-4 text-center text-red-400">{member.title}</p>
                    <p className="text-xl text-gray-300 mb-10">
                      <strong>Phone:</strong> {member.phone}
                    </p>
                    <p className="text-xl mb-4 text-gray-200 text-justify">
                      {isExpanded ? member.description : previewText + (member.description.length > 350 ? '...' : '')}
                    </p>
                    {member.description.length > 350 && (
                      <button
                        onClick={() => toggleExpanded(index)}
                        className="text-red-400 hover:underline text-lg"
                      >
                        {isExpanded ? 'See less ▲' : 'See more ▼'}
                      </button>
                    )}
                  </div>
                  {member.email && (
                    <p className="text-xl text-gray-300 mt-8">
                      <strong>Email:</strong> {member.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </section>
  );
};

export default MeetOurTeam;