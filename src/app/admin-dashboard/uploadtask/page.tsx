// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function TaskForm() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     link: "",
//     deadline: "",
//      category : ""
//   });
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [token, setToken] = useState<string | null>(null);

//   // ✅ Get token only on client
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) setToken(storedToken);
//   }, []);

//   // const handleChange = (
//   //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   // ) => {
//   //   setFormData({ ...formData, [e.target.name]: e.target.value });
//   // };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFile(e.target.files[0]);
//     }
//   };
// const handleChange = (
//   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
// ) => {
//   setFormData({ ...formData, [e.target.name]: e.target.value });
// };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();


//     if (!token) {
//       alert("You must be logged in.");
//       return;
//     }
//     setLoading(true);

//     try {
//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append("description", formData.description);
//       data.append("link", formData.link);
//       data.append("deadline", formData.deadline);
//       data.append("category", formData.category);
//       if (file) data.append("file", file);

//       const res = await axios.post("/api/Dashboard_Admin/uploadTask", data, {
//         headers: {
//           Authorization: `Bearer ${token}`, // ✅ token only
//         },
//       });

//       alert("Task uploaded successfully!");
//       console.log(res.data);

//       // reset form
//       setFormData({
//         title: "",
//         description: "",
//         link: "",
//         deadline: "",
//          category : ""
//       });
//       setFile(null);
//     } catch (err) {
//       console.error(err);
//       alert("Error uploading task.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-md mx-auto p-6 bg-white shadow rounded-md space-y-4"
//     >
//       <h2 className="text-xl font-bold">Upload Task</h2>

//       <input
//         type="text"
//         name="title"
//         placeholder="Title"
//         value={formData.title}
//         onChange={handleChange}
//         required
//         className="w-full border p-2 rounded"
//       />

//       <textarea
//         name="description"
//         placeholder="Description"
//         value={formData.description}
//         onChange={handleChange}
//         required
//         className="w-full border p-2 rounded"
//       />

//       <input
//         type="url"
//         name="link"
//         placeholder="Link"
//         value={formData.link}
//         onChange={handleChange}
//         required
//         className="w-full border p-2 rounded"
//       />

//        {/* <div className="my-4"> */}

//       <select
//         id="category"
//         name="category"
//         value={formData.category}
//         onChange={handleChange}
//         required
//         className="w-full border p-2 rounded"
//       >
//         <option value="">-- Select a Category --</option>
//         <option value="Frontend Task">Frontend Task</option>
//         <option value="Backend Task">Backend Task</option>
//         <option value="Cloud Computing Task">Cloud Computing Task</option>
//         <option value="App Development Task">App Development Task</option>
//         <option value="Video Editing Task">Video Editing Task</option>
// {/* 
//          "Frontend Task",
//       "Backend Task",
//       "Cloud Computing Task",
//       "App Development Task",
//       "Video Editing Task" */}
//       </select>
//     {/* </div> */}

//       <input
//         type="date"
//         name="deadline"
//         value={formData.deadline}
//         onChange={handleChange}
//         required
//         className="w-full border p-2 rounded"
//       />

//       <input
//         type="file"
//         name="file"
//         onChange={handleFileChange}
//         className="w-full border p-2 rounded"
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         {loading ? "Uploading..." : "Submit Task"}
//       </button>
//     </form>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function TaskForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    deadline: "",
    category: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("You must be logged in.");
      return;
    }
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("link", formData.link);
      data.append("deadline", formData.deadline);
      data.append("category", formData.category);
      if (file) data.append("file", file);

      const res = await axios.post("/api/Dashboard_Admin/uploadTask", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(" Task uploaded successfully!");
      console.log(res.data);

      setFormData({
        title: "",
        description: "",
        link: "",
        deadline: "",
        category: "",
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Error uploading task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-10 mb-10 p-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl space-y-5 text-white transition-transform hover:scale-[1.02]"
    >
      <h2 className="text-2xl text-center bg-gradient-to-r text-white font-bold bg-clip-text ">
         Upload Task
      </h2>

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Description */}
      <textarea
        name="description"
        placeholder="Task Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      {/* Link */}
      <input
        type="url"
        name="link"
        placeholder="Reference Link"
        value={formData.link}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      {/* Category */}
      <select
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        <option value="" className="text-black">
          -- Select a Category --
        </option>
        <option value="Frontend Task" className="text-black">
          Frontend Task
        </option>
        <option value="Backend Task" className="text-black">
          Backend Task
        </option>
        <option value="Cloud Computing Task" className="text-black">
          Cloud Computing Task
        </option>
        <option value="App Development Task" className="text-black">
          App Development Task
        </option>
        <option value="Video Editing Task" className="text-black">
          Video Editing Task
        </option>
      </select>

      {/* Deadline */}
      <input
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      {/* File Upload */}
      <input
        type="file"
        name="file"
        onChange={handleFileChange}
        className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 file:bg-red-900 file:text-white file:rounded-lg file:px-4 file:py-2 file:borde0"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-b500 text-white font-semibold shadow-lg transform transition hover:scale-105"
      >
        {loading ? "Uploading..." : "Submit Task"}
      </button>
    </form>
  );
}
