"use client";

import { useState } from "react";
import Lottie from "lottie-react";
import contact from "../../Lottie/contact2.json"

export default function ContactForm() {

  const [form, setForm] = useState({ name: "", email: "", phoneNo: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});

  // Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validation (same as API)
  const validateForm = () => {
    if (!form.name || !form.email || !form.phoneNo || !form.msg) {
      return "All fields are required.";
    }
    if (!/^[A-Za-z ]+$/.test(form.name)) return "Invalid Name";
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email))
      return "Invalid Email (only Gmail allowed)";
    if (!/^[6-9]\d{9}$/.test(form.phoneNo))
      return "Invalid Phone Number (must be 10 digits, start with 6-9)";
    if (!/^[a-zA-Z0-9 .,!?'-]+$/.test(form.msg)) return "Message contains invalid characters";
    return null;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) return setStatus({ success: false, message: errorMsg });

    setLoading(true);
    setStatus({});
    try {
      const res = await fetch("/api/Help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setStatus({ success: data.success, message: data.message });
      if (data.success) setForm({ name: "", email: "", phoneNo: "", msg: "" });
    } catch {
      setStatus({ success: false, message: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex-col sm:flex-row  flex items-center justify-evenly p-2 sm:p-6">
    
    <div className="left sm:w-2/6 flex  justify-center items-center w-full">
      <Lottie style={{ width: "500px", height: "500px" }}  animationData={contact} loop={true} />
    </div>


      <div className="w-full sm:w-3/6  max-w-lg backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-white text-center">Need Help?</h1>
        <p className="text-gray-200 text-center mt-2 mb-6">
          Reach out to us anytime. We will get back to you as soon as possible.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-white text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 h-[45px] rounded-lg text-white bg-white/10 backdrop-blur-xl  outline-none"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-white text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 h-[45px] rounded-lg text-white bg-white/10 backdrop-blur-xl  outline-none"
              placeholder="Enter your Gmail"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-white h text-sm font-semibold mb-1">Phone</label>
            <input
              type="text"
              name="phoneNo"
              value={form.phoneNo}
              onChange={handleChange}
              className="w-full px-4 py-2 h-[45px] rounded-lg text-white bg-white/10 backdrop-blur-xl  outline-none"
              placeholder="10-digit phone number"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-white text-sm font-semibold mb-1">Message</label>
            <textarea
              name="msg"
              value={form.msg}
              onChange={handleChange}
              className="w-full px-4 py-2  rounded-lg text-white bg-white/10 backdrop-blur-xl  outline-none  resize-none"
              placeholder="Write your message..."
            />
          </div>

          {/* Status Message */}
          {status.message && (
            <p
              className={`text-center  text-sm font-semibold ${status.success ? "text-green-300" : "text-red-300"
                }`}
            >
              {status.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer h-[45px] py-3 text-white bg-gradient-to-r from-white/10 via-red-900 to-white/10  font-bold rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
