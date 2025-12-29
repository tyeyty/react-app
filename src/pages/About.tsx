// src/pages/About.tsx
import React from "react";

const About: React.FC = () => {

  const responsibilities = [
    "Modernizing front-end architecture and UI",
    "Maintaining and upgrading relational databases",
    "Ensuring responsive, cross-device compatibility",
    "Refactoring and upgrading legacy PHP code while keeping the service live",
  ];

  const skills = {
  "Programming Languages": ["PHP", "JavaScript", "C# / .NET"],
  "Data & Query Languages": ["SQL"],
  "Frontend Frameworks & Libraries": ["React"],
  "Styling & UI": ["Tailwind CSS", "CSS"],
  "Markup": ["HTML"],  
  "Backend & Platforms": ["Supabase", "SQL (MySQL)"],
  "Tools & Collaboration": ["GitHub", "JIRA", "WordPress", "Figma"],
};

  return (
    <div className="lg:w-[1312px] flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      {/* 프로필 카드 */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full text-center">
        {/* 프로필 사진 */}
        <div className="flex justify-center">
          <img
            src="profile.jpg" // 👉 public 폴더에 profile.jpg 넣어주세요
            alt="Profile"
            className="w-40 h-40 rounded-lg border-4 border-indigo-500 object-cover"
          />
        </div>

        {/* 자기소개 */}
        <h1 className="text-2xl font-bold mt-6">Hi, I’m GH Jo 👋 <br></br>
        I'm a Full-stack software engineer.</h1>
        <p className="text-gray-600 mt-4 leading-relaxed text-left">
            <b>Full-stack software engineer</b> with 4+ years of hands-on experience building, 
            maintaining, and modernizing <b>production web platforms</b> using <b>PHP, SQL, and Tailwind CSS</b>, and 
            currently expanding into <b>React-based modern stacks with Supabase</b>.

            I specialize in <b>owning systems end-to-end</b> — from planning and system design to implementation, 
            testing, deployment, and ongoing maintenance. 
            I’m particularly experienced in working with <b>legacy codebases</b>, 
            incrementally modernizing them while keeping existing functionality stable and 
            users unaffected.<br /><br />

            Previously, I worked at a <b>global gaming company</b> in the overseas development department, 
            supporting multilingual releases across <b>Europe, China, Korea, and English-speaking regions</b>. 
            Over 8 years, I collaborated with cross-functional teams across time zones and 
            cultures, gaining strong experience in <b>international coordination and 
            production-level communication</b>.<br /><br />

            Currently, I lead the <b>full-stack redesign and maintenance of dalsaram.com</b>, 
            a long-running PHP-based service located in <b>DFW, Texas</b>. 
            I manage the project from <b>Figma-based planning</b> through implementation, including:<br />
            
            <ul className="list-disc pl-5 space-y-1">
              {responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul><br />

           I enjoy solving real-world problems through clean, maintainable software and thrive in environments where 
           engineers take <b>ownership, make technical decisions, and build systems that people rely on every day</b>.
            </p>


        {/* 기술 스택 */}
        <div className="mt-6 text-left">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">🔧 Skills</h2>
          <div className="flex flex-wrap gap-3">
            <div className="space-y-4">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <p className="mb-2 text-sm font-semibold text-gray-600">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>                                              
          </div>
        </div>

        {/* 개인적인 부분 */}
        <p className="text-gray-500 mt-8 text-sm text-left">
          ☕ Outside of coding, I run a boba tea shop and create Minecraft YouTube content!
        </p>
      </div>
    </div>
  );
};

export default About;
