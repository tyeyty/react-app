// src/pages/About.tsx
import React from "react";

const About: React.FC = () => {
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
        I'm a Full-stack web developer.</h1>
        <p className="text-gray-600 mt-4 leading-relaxed text-left">
            I’m a <b>Full-stack web developer</b> with over 4 years of experience in <b>PHP</b>, <b>Tailwind</b> and <b>SQL</b>,
            and I’m now expanding into modern stacks like <b>React, Tailwind, and Supabase</b>.<br /><br />

            I have lived in <b>Japan for 14 years</b>, gaining a deep understanding of cross-cultural
            communication, and I’ve been living in <b>the United States for the past 4 years</b>,
            further broadening my international perspective.<br /><br />

            My last role was at a <b>global gaming company</b>, where I worked in the overseas
            development department managing multilingual support for European, Chinese, Korean,
            and English versions of our games. Over 8 years, I collaborated closely with team
            members from multiple countries, learning how to coordinate across time zones, languages,
            and cultural differences to deliver high-quality software.<br /><br />

            Currently, I’m leading the <b>full-stack redesign and maintenance of dalsaram.com</b>,
            a legacy PHP website over 4 years old based in DFW, TX. I’m handling the project 
            from the planning stage in <b>Figma</b> to implementation, <b>modernizing the front-end, 
            maintaining and upgrading the database, ensuring responsive design, and maintaining 
            functionality while upgrading legacy code</b>.

            I enjoy building user-friendly applications that solve real problems, exploring new
            technologies, and combining my global experience with technical expertise to create
            solutions that resonate with users around the world.
            </p>


        {/* 기술 스택 */}
        <div className="mt-6 text-left">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">🔧 Skills</h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              PHP
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              SQL
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              Javascript
            </span>            
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              React
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              Tailwind
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              Supabase
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              Figma
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              HTML/ CSS
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              Wordpress
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              Adobe Suites
            </span>                                                
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
