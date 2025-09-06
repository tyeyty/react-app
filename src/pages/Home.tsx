import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [toDo, setToDo] = useState<string>("");
  const [toDos, setToDos] = useState<string[]>([]);

  const onChange = (event) => setToDo(event.target.value);

  const onSubmit = (event) => {
    event.preventDefault();
    if (toDo === "") return;
    setToDos((currentArray) => [toDo, ...currentArray]);
    setToDo("");
  };

  const skills = [
  { name: 'React & PHP', level: 100, experience: 4 },
  { name: 'HTML & CSS & Javascript', level: 100, experience: 10 },
  { name: 'Game Contents & Web Design', level: 100, experience: 10 },
  { name: 'UI Design', level: 100, experience: 3 },
  { name: 'WordPress', level: 100, experience: 3 },
  { name: 'C#.net', level: 100, experience: 3 },
  { name: 'Java', level: 100, experience: 2 },
  { name: 'Unity', level: 50, experience: 1 },
];

  const experience = [
  {
    date: 'Aug 2024 - NOW',
    role: 'Main Programmer (Web Developer)/ Web Designer',
    desc: [
      'PHP Site Developer, DB maintenance, Web site Design, UI/UX',
      'Developed PHP sites, SQL Maintain PHP sites, SQL',
      'Member\'s schedule, agenda management, participated meetings',
    ],
    name: 'Dalsaram.com',
    region: 'Dallas in TX, USA',
  },   
     {
    date: 'Jan 2020 - Feb 2022',
    role: 'Design Team Leader',
    desc: [
      'Game titles: Super Star BTS, SMtown, Pledis Series',
      'Member\'s schedule, agenda management, participated meetings',
    ],
    name: 'PONOS',
    region: 'JAPAN',
  }, 
  {
    date: 'Oct 2014 - Aug 2022',
    role: 'Senior Web & UI Designer',
    desc: [
      'Game titles: Battle Cat, Super Star BTS, SMtown, Pledis Series',
      'Developed user interface designs for web and mobile applications',
      'Developed official website',
      'Created image sources for update',
      'Translate Japanese game content into Korean',
      'Participated in the QA test for the Korean version once a month',
    ],
    name: 'PONOS',
    region: 'JAPAN',
  },
  {
    date: 'Sep 2010 - Sep 2013',
    role: 'Senior Web & UI Designer',
    desc: [
      'Game titles: Monster Hunter PC version, Bio Hazard Mobile',
      'Developed user interface designs for web and mobile applications',
      'Developed and created official website and content',
      'Created image sources for update',
    ],
    name: 'CAPCOM',
    region: 'Tokyo, JAPAN',
  },
  {
    date: 'Sep 2009 - Sep 2010',
    role: 'Junior Web & UI Designer',
    desc: [
      'Game Titles: Seal, Rohan, Tenchi-Dearan, 81 Keys, etc.',
      'Developed user interface designs for web',
      'Developed and created official website and content',
      'Created image sources for update',
    ],
    name: 'Wemade',
    region: 'Tokyo, JAPAN',
  },
  {
    date: 'Aug 2007 - Sep 2009',
    role: 'Junior Programmer',
    desc: [
      'Front-end engineer for stock company',
      'C#.net, Java, HTML, CSS, VBA',
      'Developed an in-house system',
    ],
    name: 'KYOBO Information Japan',
    region: 'Tokyo, Japan',
  },
];

const education = [
  {
    year: 2022,
    degree: "ESL Course",
    school: "UT Arlinton University",
    location: "Texas, USA",
  },  
  {
    year: 2010,
    degree: "Bachelor's Degree in Engineering / Department of Information and Communications",
    school: "Open Cyber University",
    location: "South Korea",
  },
  {
    year: 2006,
    degree: "Associate's Degree in Visual Design",
    school: "Induk University",
    location: "South Korea",
  },  
];


  useEffect(() => {
    // 필요하다면 초기 로직 작성 가능 (예: supabase에서 초기 데이터 fetch)
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome!<br></br>GH's Portfolio Site</h1>
        <p className="text-2xl text-gray-700 mb-6">
          Hi! I’m Full Stack Developer & Web/UI designer.<br></br>
          This is a Trip route/message/board/shop project built with React and Supabase.
        </p>
      </div>

    {/* ===== Skills Section ===== */}
      <section className="w-full max-w-7xl px-4">
        <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg"             
          width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-blue-500 w-10 h-10">   
          <circle cx={12} cy={6} r={1} fill="currentColor"></circle><path fill="currentColor" d="M6 17h12v2H6zm4-5.17l2.792 2.794l3.932-3.935L18 12V8h-4l1.31 1.275l-2.519 2.519L10 9l-4 4l1.414 1.414z"></path><path fill="currentColor" d="M19 3h-3.298a5 5 0 0 0-.32-.425l-.01-.012a4.43 4.43 0 0 0-2.89-1.518a2.6 2.6 0 0 0-.964 0a4.43 4.43 0 0 0-2.89 1.518l-.01.012a5 5 0 0 0-.32.424V3H5a3.003 3.003 0 0 0-3 3v14a3.003 3.003 0 0 0 3 3h14a3.003 3.003 0 0 0 3-3V6a3.003 3.003 0 0 0-3-3m1 17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4.55a2.5 2.5 0 0 1 4.9 0H19a1 1 0 0 1 1 1Z"></path></svg>         
           <span>Skills</span>
            <svg xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-blue-500 w-10 h-10">            
            <g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M12 2c.896 0 1.764.118 2.59.339l-2.126 2.125A3 3 0 0 0 12.04 5H12a7 7 0 1 0 7 7v-.04q.29-.18.535-.425l2.126-2.125c.221.826.339 1.694.339 2.59c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m-.414 5.017c0 .851-.042 1.714.004 2.564l-.54.54a2 2 0 1 0 2.829 2.829l.54-.54c.85.046 1.712.004 2.564.004a5 5 0 1 1-5.397-5.397m6.918-4.89a1 1 0 0 1 .617.923v1.83h1.829a1 1 0 0 1 .707 1.707L18.12 10.12a1 1 0 0 1-.707.293H15l-1.828 1.829a1 1 0 0 1-1.415-1.415L13.586 9V6.586a1 1 0 0 1 .293-.708l3.535-3.535a1 1 0 0 1 1.09-.217"></path></g></svg>           
           </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
              <p className="text-gray-500 mb-4">Experience: {skill.experience} years</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    skill.level <= 30
                      ? "bg-red-500"
                      : skill.level <= 70
                      ? "bg-yellow-400"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

    {/* ===== Experience Section ===== */}
      <section className="w-full max-w-7xl px-4 py-16 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg"             
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-blue-500 w-10 h-10">
          <path fill="currentColor" d="M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2M6 7H4V5h2m0 6H4V9h2m0 6H4v-2h2m0 6H4v-2h2m6-10V3H2v18h20V7z"></path></svg>          
          <span>Experience & Companies</span>
          <svg xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-blue-500 w-10 h-10">          
          <path fill="currentColor" d="M4 21q-.825 0-1.412-.587T2 19V8q0-.825.588-1.412T4 6h4V4q0-.825.588-1.412T10 2h4q.825 0 1.413.588T16 4v2h4q.825 0 1.413.588T22 8v11q0 .825-.587 1.413T20 21zm6-15h4V4h-4z"></path></svg>          
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experience.map((item, index) => (
            <div key={index} className="bg-white p-6 border border-gray-300 rounded-lg shadow hover:shadow-lg transition">
              <p className="text-sm text-gray-400 mb-2">{item.date}</p>
              <h3 className="text-xl font-semibold mb-2">{item.role}</h3>
              <p className="text-gray-500 mb-2">{item.desc}</p>
              <p className="text-gray-700 font-medium">{item.name}</p>
              <p className="text-gray-400 text-sm">{item.region}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Education Section ===== */}
      <section className="w-full max-w-7xl px-4 py-16 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center space-x-3">
         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 48 48"
            className="text-blue-500 w-12 h-12"
          >
            <g fill="none" stroke="currentColor" strokeWidth="4">
              <path
                strokeLinejoin="round"
                d="M4 33a2 2 0 0 1 2-2h6v-7l12-8l12 8v7h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4z"
              />
              <path strokeLinecap="round" d="M24 6v10" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M36 12V6s-1.5 3-6 0s-6 0-6 0v6s1.5-3 6 0s6 0 6 0m-8 32V31h-8v13m-2 0h12"
              />
            </g>
          </svg>          
          <span>Education</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-blue-500 w-10 h-10">
            <path
              fill="currentColor"
              d="M23.835 8.5L12 .807L.165 8.5L12 16.192l8-5.2V16h2V9.693z"
            />
            <path
              fill="currentColor"
              d="M5 17.5v-3.665l7 4.55l7-4.55V17.5c0 1.47-1.014 2.615-2.253 3.338C15.483 21.576 13.802 22 12 22s-3.482-.424-4.747-1.162C6.014 20.115 5 18.97 5 17.5"
            />
          </svg>
        </h2>

        <div className="flex flex-col space-y-8">
          {education.map((item, index) => (
            <div key={index} className="bg-gray-50 p-6 border border-gray-300 rounded-lg shadow hover:shadow-lg transition">
              <p className="text-sm text-gray-400 mb-1">{item.year}</p>
              <h3 className="text-xl font-semibold mb-2">{item.degree}</h3>
              <p className="text-gray-700 font-medium">{item.school}</p>
              <p className="text-gray-400 text-sm">{item.location}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ===== To Dos Section ===== */}
      <div className="w-full max-w-md pt-2">
        <h2 className="text-2xl font-semibold mb-4">My To Dos ({toDos.length})</h2>
        <form onSubmit={onSubmit} className="flex mb-4">
          <input
            className="flex-1 border rounded-l px-3 py-2"
            onChange={onChange}
            value={toDo}
            type="text"
            placeholder="Write your to do..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
          >
            Add
          </button>
        </form>

        <ul>
          {toDos.map((item, index) => (
            <li key={index} className="border-b py-2">{item}</li>
          ))}
        </ul>
      </div>



    </div>
  );
}
