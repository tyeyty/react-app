// src/pages/ContactPage.tsx
import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message submitted! (This is a placeholder)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Me</h1>

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
          Send Message
        </button>
      </form>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <a href="https://polcehhancopksfstdiq.supabase.co/storage/v1/object/public/works-images/resume_110625.pdf" download target="_blank">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
            📄 Resume
          </button>
        </a>
        <a
          href="https://www.linkedin.com/in/tyeyty"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
            🔗 LinkedIn
          </button>
        </a>
        <a
          href="https://github.com/tyeyty"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 flex items-center gap-2">
            🖥 GitHub
          </button>
        </a>
      </div>
    </div>
  );
};

export default ContactPage;
