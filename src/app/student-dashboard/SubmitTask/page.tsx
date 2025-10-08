"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";
import Joi from "joi";
import { useSearchParams } from "next/navigation";
import { getUserId } from "@/middleware/DecodeToken";

export default function UploadTaskForm() {
  const searchParams = useSearchParams();
  const taskTitle = searchParams.get("taskTitle");
  const taskId = searchParams.get("taskId");
  const taskCategory = searchParams.get("category");

  const showGithubField = ["Frontend Task", "Backend Task", "Machine Learning Task" , "App Development Task"].includes(
  (taskCategory || "")
);


  const [formData, setFormData] = useState({
    taskId: taskId || "",
    title: taskTitle || "",
    taskCategory :  taskCategory || "",
    description: "",
    github: "",
    deploy: "",
    recaptchaValue: "",
  });

   useEffect(() => {
    if (!taskId || !taskTitle || !taskCategory) {
      toast.error("Missing task details. Please navigate from the dashboard.");
      
      
      // Optional: Redirect the user back to the dashboard or an error page
      // router.push("/dashboard");
    }
  }, [taskId, taskTitle]);


  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const reset = useRef<ReCAPTCHA | null>(null);

  useEffect(() => {
  
    setFormData((prev) => ({
      ...prev,
      taskId: taskId || "",
      title: taskTitle || "",
    }));
  }, [taskId, taskTitle]);

  // const schema = Joi.object({
  //     taskId: Joi.string().required(), 
  //      taskCategory: Joi.string().required(), 
  //   title: Joi.string().required(), 
  //   description: Joi.string()
  //     .pattern(/^[A-Za-z0-9,\-._ ]+$/)
  //     .min(30)
  //     .max(150)
  //     .required()
  //     .messages({
  //       "string.empty": "Description is required",
  //       "string.pattern.base": "Description can only contain letters, numbers, spaces, commas, hyphens (-), dots (.) and underscores",
  //       "string.min": "Description must be at least 30 characters",
  //       "string.max": "Description cannot exceed 150 characters",
  //     }),
  //   github: Joi.string()
  //     .uri()
  //     .pattern(/^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?\/?$/)
  //     // .required()
  //     .messages({
  //       "string.empty": "GitHub link is required",
  //       "string.uri": "GitHub link must be a valid URL",
  //       "string.pattern.base": "GitHub link must be a valid GitHub URL",
  //     }),
  //   deploy: Joi.string()
  //     .uri()
  //     .required()
  //     .messages({
  //       "string.empty": "Deployment link is required",
  //       "string.uri": "Deployment link must be a valid URL",
  //     }),
  //   recaptchaValue: Joi.string().required().messages({
  //     "string.empty": "Please verify that you are not a robot",
  //   }),
  // });






  const schema = Joi.object({
  taskId: Joi.string().required(),
  taskCategory: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string()
    .pattern(/^[A-Za-z0-9,\-._ ]+$/)
    .min(30)
    .max(150)
    .required()
    .messages({
      "string.empty": "Description is required",
      "string.pattern.base":
        "Description can only contain letters, numbers, spaces, commas, hyphens (-), dots (.) and underscores",
      "string.min": "Description must be at least 30 characters",
      "string.max": "Description cannot exceed 150 characters",
    }),

  github: showGithubField
    ? Joi.string()
        .uri()
        .pattern(/^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?\/?$/)
        .required()
        .messages({
          "string.empty": "GitHub link is required",
          "string.uri": "GitHub link must be a valid URL",
          "string.pattern.base": "GitHub link must be a valid GitHub URL",
        })
    : Joi.string().allow("").optional(),

  deploy: Joi.string()
    .uri()
    .required()
    .messages({
      "string.empty": "Deployment link is required",
      "string.uri": "Deployment link must be a valid URL",
    }),

  recaptchaValue: Joi.string().required().messages({
    "string.empty": "Please verify that you are not a robot",
  }),
});


  const validateField = (name: string, value: string) => {
    const fieldSchema = schema.extract(name);
    const { error } = fieldSchema.validate(value);
    setErrors((prev) => ({ ...prev, [name]: error ? error.message : "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleRecaptchaChange = (value: string | null) => {
    setFormData((prev) => ({ ...prev, recaptchaValue: value ?? "" }));
    validateField("recaptchaValue", value ?? "");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUserId(getUserId(token));
    } else {
      setUserId(null);
    }
    const handleTokenChange = () => {
      const newToken = localStorage.getItem("token");
      setUserId(newToken ? getUserId(newToken) : null);
    };
    window.addEventListener("storage", handleTokenChange);
    return () => window.removeEventListener("storage", handleTokenChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log(formData);
    

    const { error } = schema.validate(formData, { abortEarly: false });
  
    
    if (error) {
      const fieldErrors: { [key: string]: string } = {};
      error.details.forEach((detail) => {
        fieldErrors[detail.path[0] as string] = detail.message;
      });
      setErrors(fieldErrors);
      // toast.error(error);
      toast.error("Please fix errors before submitting");
      setLoading(false);
      return;
    }

    if (!userId) {
      toast.error("User not logged in!");
      setLoading(false);
      return;
    }


    

    try {
     const r = await axios.post("/api/Dashboard_Students/submittask", {
        ...formData,
        uploadedBy: userId,
      });

      // console.log(r);
      

      toast.success("Task uploaded successfully!");
      setFormData((prev) => ({
        ...prev,
        description: "",
        github: "",
        deploy: "",
        recaptchaValue: "",
      }));
      setErrors({});
      reset.current?.reset();
    } catch (err: any) {
      // console.log(err);
      
      toast.error(err?.response?.data?.message || "Failed to upload task. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full p-3 mb-2 h-[45px] rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 transition";

  return (
    <div className="flex justify-center items-start min-h-screen p-3 sm:p-6 ">
      <Toaster position="top-right" reverseOrder={false} />
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-3xl p-4 sm:p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2
          style={{
            fontFamily: "'Orbitron', sans-serif",
            WebkitBackgroundClip: "text",
            textShadow: "0 0 15px rgba(255,50,50,1),0 0 30px rgba(255,50,50,0.7)",
          }}
          className="text-3xl font-extrabold text-center text-white mb-2"
        >
          Submit Your Task
        </h2>

        <p className="mb-4 text-gray-300 text-center">
          Task Title: <span className="font-semibold">{taskTitle}</span>
        </p>

        {/* Description */}
        <motion.div className="w-full" whileFocus={{ scale: 1.02 }}>
          <textarea
            name="description"
            placeholder="Task Description (describe some main functionality in about 30-150 words)"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full p-3 mb-2 h-[90px] rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 transition ${
              errors.description ? "border-red-500 ring-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mb-2">{errors.description}</p>
          )}
        </motion.div>

        {/* GitHub */}
        {/* <motion.div whileFocus={{ scale: 1.02 }}>
          <input
            type="url"
            name="github"
            placeholder="GitHub Repository Link"
            value={formData.github}
            onChange={handleChange}
            className={`${inputClass} ${errors.github ? "border-red-500 ring-red-500" : ""}`}
          />
          {errors.github && <p className="text-red-500 text-sm mb-2">{errors.github}</p>}
        </motion.div> */}
        {showGithubField && (
  <motion.div whileFocus={{ scale: 1.02 }}>
    <input
      type="url"
      name="github"
      placeholder="GitHub Repository Link"
      value={formData.github}
      onChange={handleChange}
      required={showGithubField}
      className={`${inputClass} ${errors.github ? "border-red-500 ring-red-500" : ""}`}
    />
    {errors.github && <p className="text-red-500 text-sm mb-2">{errors.github}</p>}
  </motion.div>
)}


        {/* Deployment */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <input
            type="url"
            name="deploy"
            placeholder={`${showGithubField ? "Live Demo" : ""} Link`}
            // placeholder="Deployment Link"
            value={formData.deploy}
            onChange={handleChange}
            className={`${inputClass} ${errors.deploy ? "border-red-500 ring-red-500" : ""}`}
          />
          {errors.deploy && <p className="text-red-500 text-sm mb-2">{errors.deploy}</p>}
        </motion.div>

        {/* reCAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey="6Le3-QArAAAAADn9ym4vDs6qMQN3DpD0yZe183m-"
            onChange={handleRecaptchaChange}
            theme="dark"
            ref={reset}
          />
        </div>
        {errors.recaptchaValue && (
          <p className="text-red-500 mb-4 text-center text-sm mt-1">{errors.recaptchaValue}</p>
        )}

        <motion.button
          type="submit"
          className="w-full cursor-pointer mt-2 bg-gradient-to-r from-red-900 to-red-950 text-white py-3 rounded-xl font-semibold shadow-lg  hover:from-red-800 hover:to-red-900 transition-all flex justify-center items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : null}
          {loading ? "Uploading..." : "Submit Task"}
        </motion.button>
      </motion.form>
    </div>
  );
}
