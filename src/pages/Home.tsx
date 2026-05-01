import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface WorkItem {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  thumbnail: string | null;
  created_at: string;
}

const SKILLS = [
  { name: "HTML / CSS / JS", experience: 15 },
  { name: "PHP",             experience: 6  },
  { name: "SQL (MySQL)",     experience: 6  },
  { name: "React",           experience: 3  },
  { name: "Supabase",        experience: 3  },
  { name: "C#.NET",          experience: 3  },
  { name: "Figma",           experience: 3  },
  { name: "WordPress",       experience: 2  },
];

const STATS = [
  { num: "20+", label: "Years of Experience" },
  { num: "3",   label: "Countries Worked" },
  { num: "10+", label: "Products Shipped" },
];

const TECH_TAGS = [
  "Next.js", "React", "TypeScript", "Supabase",
  "PHP", "SQL", "C#.NET", "Figma",
];

export default function Home() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [worksLoading, setWorksLoading] = useState(true);

  const experience = [
  {
    date: '2024 - Present',
    role: 'Full-stack Developer & Technical Lead',
    desc: [
      'Spearheaded the full development lifecycle of the corporate website, handling both Frontend (UI/UX) and Backend development.',
      'Managed and optimized SQL databases to enhance application performance and data integrity.',
      'Coordinated development initiatives and project planning across teams.',
    ],
    name: 'Dalsaram.com',
    region: 'Dallas in TX, USA',
  },   
     {
    date: '2 years',
    role: 'Design/Production Lead',
    desc: [
      'Worked closely with engineering teams for live-service game operations.',
      'Managed multi-disciplinary sprints and coordinated releases for Super Star BTS, SMTown, and Pledis series.',
      'Improved asset and build delivery workflows between Design and Development, reducing turnaround times.',
      'Collaborated with developers to optimize update pipelines and feature implementation processes.',
    ],
    name: 'PONOS',
    region: 'Kyoto, JAPAN',
  }, 
  {
    date: '6 years',
    role: 'Game UI / Frontend Engineer (Frontend  / Global Live Ops)',
    desc: [
      'Maintained monthly and quarterly global updates, integrating new content and preparing builds for major titles.',
      'Developed and maintained the official global website (PHP/ Wordpress / HTML / CSS), improving structure and adding new features.',
      'Implemented and updated in-app web pages (FAQ, Q&A, Event), ensuring correct layout, localization, and UI consistency.',
      'Created and optimized UI assets for global releases, managing layout adjustments and multilingual variations.',
      'Performed playtest-driven debugging, reproducing issues and collaborating with developers to validate fixes.',
      'Managed event-related assets, UI elements, and webview resources to support continuous global Live Ops.',
    ],
    name: 'PONOS',
    region: 'Kyoto, JAPAN',
  },
  {
    date: '3 years',
    role: 'Frontend Engineer & Full-Stack Engineer',
    desc: [
      'Game titles: Monster Hunter PC version, Bio Hazard Mobile official web and mobile interfaces',
      'Implemented responsive and cross-browser user interfaces using HTML/CSS/JavaScript.',
      'Led the full development cycle of the official corporate website, including front-end implementation and PHP integration.',
      'Conducted maintenance and feature development for live PHP-based services, focusing on stability and new content integration. ',
    ],
    name: 'CAPCOM',
    region: 'Tokyo, JAPAN',
  },
  {
    date: '3 years',
    role: 'Enterprise Systems Developer',
    desc: [
      'Utilized C#.net and Java to develop critical internal enterprise systems.',
      'Designed and implemented the user interface (UI) for the internal system using HTML/CSS.',
      'Developed custom data processing scripts using VBA for efficient internal operations.',
    ],
    name: 'Nomura Invest (Client)',
    region: 'Tokyo, Japan',
  },
];

const education = [
  {
    year: "",
    degree: "Bachelor's Degree in Computer Engineering / Department of Information and Communications",
    school: "Open Cyber University",
    location: "South Korea",
  },
  {
    year: "",
    degree: "Associate's Degree in Visual Design",
    school: "Induk University",
    location: "South Korea",
  },      
  {
    year: "",
    degree: "ESL Course",
    school: "UT Arlinton University",
    location: "Texas, USA",
  },  

];

  // 1. 데이터 페칭
  const fetchWorks = async () => {
    setWorksLoading(true);
    const { data, error } = await supabase
      .from("works")
      .select("id, title, content, image_url, thumbnail, created_at")
      .order("created_at", { ascending: false })
      .limit(12); // Grid 2, 3배수에 맞게 12개 정도로 조절
    if (!error && data) setWorks(data as WorkItem[]);
    setWorksLoading(false);
  };
  
  useEffect(() => {
    fetchWorks();
  }, []);

  // 2. HTML 태그 제거 및 요약 함수
  const stripHtml = (html: string) =>
    html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 60);

  return (
    <div className="flex flex-col items-center justify-center bg-white lg:w-[1100px]">
      <span className="inline-block text-xs font-semibold tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-5 sm:mb-6 uppercase">
        Open to New Opportunities
      </span>      

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome!<br></br>GH's Portfolio</h1>
        <p className="text-2xl text-gray-700 mb-6">
          Senior Full-Stack Engineer<br></br><span className="text-blue-500">with a Design Soul</span>
          <br></br>
          20+ years shipping products — from enterprise backends to pixel-perfect UIs.<br></br>
        </p>
        <p className="text-sm text-gray-400 mb-8">
          CAPCOM · PONOS · Nomura Invest · Dalsaram
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
          {TECH_TAGS.map((t) => (
            <span
              key={t}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200"
            >
              {t}
            </span>
          ))}
        </div>        

        <div className="flex justify-center gap-3 mb-4 sm:mb-4 flex-wrap">
          <a
            href="#works"
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition"
          >
            View My Works
          </a>
          <a
            href="/blog"
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Dev Blog
          </a>
        </div> 
        <div className="flex justify-center gap-8 sm:gap-12 pt-4 sm:pt-10 border-t border-gray-100 flex-wrap">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s.num}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>                       
      </div>

      {/* ===== 🛠 수정된 핵심: Work Section (반응형 Grid) ===== */}
      <section id="works" className="w-full max-w-5xl p-4 pt-6 border-t border-gray-100 mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-600 uppercase mb-1">Portfolio</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Featured Works</h2>
          </div>
          <Link to="/board/works" className="text-sm font-medium text-blue-500 hover:underline">
            View all →
          </Link>
        </div>

        {worksLoading ? (
          /* 로딩 스켈레톤: 모바일 2단, PC 3단 */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="w-full aspect-square bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : works.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-20">등록된 작업물이 없습니다.</p>
        ) : (
          /* 🚀 실제 카드 리스트: grid-cols-2 (모바일), lg:grid-cols-3 (PC) */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {works.map((item) => (
              <Link
                key={item.id}
                to={`/board/works/${item.id}`}
                className="group flex flex-col rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
              >
                <div className="w-full aspect-square overflow-hidden bg-gray-50">
                  {item.thumbnail || item.image_url ? (
                    <img
                      src={item.thumbnail ?? item.image_url!}
                      alt={item.title}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-300 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1.5 truncate group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="hidden sm:line-clamp-2 text-xs text-gray-500 leading-relaxed mb-4">
                    {stripHtml(item.content)}
                  </p>
                  <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[12px] sm:text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString("ko-KR")}
                    </span>
                    <span className="text-[10px] font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      VIEW →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>          

    {/* ===== Experience Section ===== */}
      <section className="w-full max-w-7xl p-4 pt-6 bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-4 flex items-center justify-center gap-2">         
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="text-blue-500 w-8 h-8"
        >
          <path fill="currentColor" d="M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2M6 7H4V5h2m0 6H4V9h2m0 6H4v-2h2m0 6H4v-2h2m6-10V3H2v18h20V7z"></path>
        </svg>

        <span className="text-3xl md:text-4xl">Experience/Companies</span>

        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="text-blue-500 w-8 h-8"
        >
          <path fill="currentColor" d="M4 21q-.825 0-1.412-.587T2 19V8q0-.825.588-1.412T4 6h4V4q0-.825.588-1.412T10 2h4q.825 0 1.413.588T16 4v2h4q.825 0 1.413.588T22 8v11q0 .825-.587 1.413T20 21zm6-15h4V4h-4z"></path>
        </svg>
      </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experience.map((item, index) => (
            <div key={index} className="bg-white p-6 border border-gray-300 rounded-lg shadow hover:shadow-lg transition">
              <p className="text-sm text-gray-400 mb-2">{item.date}</p>
              <h3 className="text-xl font-semibold mb-2">{item.role}</h3>
              <p className="text-gray-500 mb-2">  
                {item.desc.map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <p className="text-gray-700 font-medium">{item.name}</p>
              <p className="text-gray-400 text-sm">{item.region}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Education Section ===== */}
      <section className="w-full max-w-7xl p-4 pt-6 bg-white">
        <h2 className="text-4xl font-bold text-center mb-4 flex items-center justify-center space-x-3">
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

    </div>
  );
}
