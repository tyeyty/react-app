// src/pages/ContactPage.tsx
import React, { useState } from "react";

const CONTACT_EMAIL = "tyeyty@gmail.com";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", title: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`[Contact] ${formData.title}`);
    const body = encodeURIComponent(
      `From: ${formData.name} (${formData.email})\n\n${formData.message}`
    );

    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Contact Me</h1>
      <p className="text-gray-500 mb-6 text-sm">
        아래 양식을 작성하면 메일 앱이 열립니다.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="border rounded px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ✉️ Send Message
        </button>
      </form>

      <div className="flex flex-col md:flex-row gap-4">
        <a
          href="https://polcehhancopksfstdiq.supabase.co/storage/v1/object/public/works-images/resume_110625.pdf"
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
            📄 Resume
          </button>
        </a>
        <a href="https://www.linkedin.com/in/tyeyty" target="_blank" rel="noopener noreferrer">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
            🔗 LinkedIn
          </button>
        </a>
        <a href="https://github.com/tyeyty" target="_blank" rel="noopener noreferrer">
          <button className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 flex items-center gap-2">
            🖥 GitHub
          </button>
        </a>
      </div>
    </div>
  );
};

export default ContactPage;