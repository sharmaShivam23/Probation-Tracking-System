"use client";

import { useEffect, useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { EyeClosed, EyeIcon } from "lucide-react";
import { ImCross } from "react-icons/im";
import OtpInput from "react-otp-input";
import ReCAPTCHA from "react-google-recaptcha";
import Lottie from "lottie-react";
import myAnimation2 from "../../Lottie/myAnimation3.json"
// import myAnimation from "../../myAnimation.json";

const branches = [
  "CSE",
  "CSE(AIML)",
  "CSE(DS)",
  "CSE(Hindi)",
  "CS",
  "IT",
  "CSIT",
  "ECE",
  "Mechanical",
  "Civil",
];

const domains = [
  "Frontend Development",
  "Backend Development",
  "App Development",
  "UI/UX Designing",
  "Cloud Computing",
  "Video Editing",
  "Other",
];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"Student" | "Admin" | "">("Student");
  const [loading, setLoading] = useState(false);
  const [showpassword, setShowPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const reset = useRef<ReCAPTCHA | null>(null);

  function startResendTimer() {
    setResendDisabled(true);
    setTimeLeft(60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleResendotp() {
    sendOtp();
    startResendTimer();
  }

  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    rollNo: "",
    branch: "",
    github: "",
    phoneNumber : "",
    domain: "",
    password: "",
    code: "",
    otp: "",
  });

  const sendOtp = async () => {
    if (!validate()) return;
    const toastID = toast.loading("Sending OTP...");
    setOtpLoading(true);

    try {
      const response = await axios.post(
        "/api/auth/send-otp",
        {
          email: formData.email,
          rollNo: formData.rollNo,
        },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success("OTP sent successfully!", { id: toastID });
        setOtpSent(true);
        setShowEmail(true);
      } else {
        toast.error(response.data.message || "Failed to send OTP", {
          id: toastID,
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP", {
        id: toastID,
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleActualRegistration = async () => {
    const toastID = toast.loading("Registering...");
    setLoading(true);

    try {
      const endpoint =
        role === "Student" ? "/api/auth/register" : "/api/auth/registerAdmin";

      const res = await axios.post(endpoint, formData);

      if (res?.data?.success) {
        toast.success("Registration successful!", { id: toastID });
        router.push("/login");
        setFormData({
          role: "",
          name: "",
          email: "",
          rollNo: "",
          branch: "",
          github: "",
          domain: "",
          password: "",
          phoneNumber : "",
          code: "",
          otp: "",
        });
        if (reset.current) {
          reset.current.reset();
        }
        setRole("");
        setOtpSent(false);
      } else {
        toast.error(res.data.message || "Registration failed", { id: toastID });
      }
    } catch (error: unknown) {
      // console.log(error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Something went wrong"
          : "Something went wrong";
      toast.error(errorMessage, { id: toastID });
    } finally {
      setLoading(false);
    }
  };


  const handleRecaptchaChange = (value: string | null) => {
    // console.log("ReCAPTCHA value:", value);
    setFormData((prev) => ({ ...prev, recaptchaValue: value }));
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRole = (selectedRole: "Student" | "Admin") => {
    setRole(selectedRole);
    setFormData({ ...formData, role: selectedRole });
    setErrors({ ...errors, role: "" });
  };

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  //   setErrors({ ...errors, [e.target.name]: "" });
  // };

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({ ...prev, [name]: value }));

  // Real-time validation for just the changed field
  const newErrors = { ...errors };

  switch (name) {
    case "name":
      if (!value) newErrors.name = "Name is required";
      else if (!/^[a-zA-Z\s]+$/.test(value))
        newErrors.name = "Name must contain only alphabets";
      else delete newErrors.name;
      break;

    case "email":
      if (!value) newErrors.email = "Email is required";
      else if (!value.endsWith("@akgec.ac.in"))
        newErrors.email = "Email must end with @akgec.ac.in";
      else if (role === "Admin" && !value.match(/^[a-z]{3,15}23\d{5,6}@akgec\.ac\.in$/))
        newErrors.email = "Admin email must contain 23 batch year";
      else if (role === "Student" && !value.match(/^[a-z]{3,15}24\d{5,6}@akgec\.ac\.in$/))
        newErrors.email = "Student email must contain 24 batch year";
      else if (formData.rollNo && !value.includes(formData.rollNo))
        newErrors.email = "Email student number mismatch";
      else delete newErrors.email;
      break;

    case "rollNo":
      if (!value) newErrors.rollNo = "Roll number is required";
      else if (
        (role === "Admin" && !value.match(/^23\d{5,6}$/)) ||
        (role === "Student" && !value.match(/^24\d{5,6}$/))
      )
        newErrors.rollNo =
          role === "Admin"
            ? "Admin roll number must start with 23"
            : "Student roll number must start with 24";
      else if (formData.email && !formData.email.includes(value))
        newErrors.email = "Email student number mismatch";
      else delete newErrors.rollNo;
      break;

   case "phoneNumber":
  if (!value) {
    newErrors.phoneNumber = "Phone number is required";
  } else if (!/^[6-9]\d{9}$/.test(value)) {
    newErrors.phoneNumber = "Enter a valid 10-digit Indian phone number";
  } else {
    delete newErrors.phoneNumber;
  }
  break;


    case "password":
      const passReg =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+?])[A-Za-z\d!@#$%^&*()_+?]{7,}$/;
      if (!value)
        newErrors.password = "Password is required";
      else if (!passReg.test(value))
        newErrors.password =
          "Password must contain at least 7 characters with uppercase, lowercase, number, and special character";
      else delete newErrors.password;
      break;

    case "code":
      if (role === "Admin") {
        if (!value) newErrors.code = "Security code is required for admin";
        else if (value !== process.env.NEXT_PUBLIC_CODE)
          newErrors.code = "Invalid Security Code";
        else delete newErrors.code;
      }
      break;

    default:
      if (name in newErrors) delete newErrors[name];
  }

  setErrors(newErrors);
};


  

  function validate() {
    const newErrors: Record<string, string> = {};
    let valid = true;

    if (!formData.role) {
      newErrors.role = "Role is required";
      valid = false;
    } else if (!["Student", "Admin"].includes(formData.role)) {
      newErrors.role = "Invalid role";
      valid = false;
    }

    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name must contain only alphabets";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!formData.email.endsWith("@akgec.ac.in")) {
      newErrors.email = "Email must end with @akgec.ac.in";
      valid = false;
    } else {
      // role-based validation
      if (
        formData.role === "Admin" &&
        !formData.email.match(/^[a-z]{3,15}23\d{5,6}@akgec\.ac\.in$/)
      ) {
        newErrors.email = "Admin email must contain 23 batch year";
        valid = false;
      } else if (
        formData.role === "Student" &&
        !formData.email.match(/^[a-z]{3,15}24\d{5,6}@akgec\.ac\.in$/)
      ) {
        newErrors.email = "Student email must contain 24 batch year";
        valid = false;
      }
    }

    if (!formData.rollNo) {
      newErrors.rollNo = "Roll number is required";
      valid = false;
    } else if (
      (role === "Admin" && !formData.rollNo.match(/^23\d{5,6}$/)) ||
      (role === "Student" && !formData.rollNo.match(/^24\d{5,6}/))
    ) {
      newErrors.rollNo =
        role === "Admin"
          ? "Admin roll number must start with 23"
          : "Student roll number must start with 24";
      valid = false;
    }

    if (!formData.email.includes(formData.rollNo)) {
      newErrors.email = "Email student number mismatch";
      valid = false;
    }

    if (!formData.branch) {
      newErrors.branch = "Branch is required";
      valid = false;
    }
    if (role === "Student") {
      if (!formData.domain) {
        newErrors.domain = "Domain is required";
        valid = false;
      }
      if (!formData.github) {
        newErrors.github = "GitHub profile is required";
        valid = false;
      } else if (
        !/^https:\/\/github\.com\/[A-Za-z0-9-]{1,20}$/.test(formData.github)
      ) {
        newErrors.github = "Invalid GitHub URL";
        valid = false;
      }
    }

   if (!formData.phoneNumber) {
  newErrors.phoneNumber = "Phone number is required";
  valid = false;
} else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
  newErrors.phoneNumber = "Enter a valid 10-digit Indian phone number";
  valid = false;
}


    const passReg =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+?])[A-Za-z\d!@#$%^&*()_+?]{7,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!passReg.test(formData.password)) {
      newErrors.password =
        "Password must contain at least 7 characters with uppercase, lowercase, number, and special character";
      valid = false;
    }

    if (role === "Admin" && !formData.code) {
      newErrors.code = "Security code is required for admin";
      valid = false;
    }
    if (role === "Admin" && formData.code != process.env.NEXT_PUBLIC_CODE) {
      newErrors.code = "Invalid Security Code";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    // Send OTP first
    await sendOtp();
  };

  return (
    <>
      <div className="flex flex-col overflow-y-hidden relative lg:flex-row min-h-screen bg-gradient-to-b from-gray-900 via-black to-red-900 text-white">
        <Toaster />

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full p-8 sm:w-1/2 mt-6   justify-center"
        >
          {/* <h3 className="text-center text-xl sm:text-3xl font-bold">
            Join the millions learning <br /> to code with StudyNotion for free
          </h3> */}
         {/* <Image
            src="/register.gif"
            width={400}
            height={300}
            className="h m-auto mt-6 w-full bg-cover max-w-md shadow-xl"
            alt="register"
          />*/
         }
         {/* <img src="/r.webm" alt="" /> */}
          <Lottie animationData={myAnimation2} loop={true} />
    
        </motion.div>

      
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="flex-1 flex items-center mb-10 justify-center p-2 sm:p-6"
        >
          <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl shadow-xl rounded-2xl p-4 sm:p-8 border border-white/20">
            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                WebkitBackgroundClip: "text",
                textShadow:
                  "0 0 15px rgba(127, 29, 29, 1), 0 0 10px rgba(127, 29, 29, 1)",
              }}
              className="text-3xl font-extrabold text-center mb-6 drop-shadow-lg"
            >
              Create your account
            </h1>

           
            <div className="flex justify-center mb-2 items-center">
              <div className="flex gap-6 bg-white/10 px-8 py-2 rounded-2xl">
                {["Student"].map((r) => (
                // {["Student", "Admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRole(r as "Student" | "Admin")}
                    className={`px-4 cursor-pointer py-1 rounded-xl transition ${
                      role === r
                        ? "bg-[#460F0E] text-white scale-105"
                        : "bg-white/30 text-gray-800 hover:bg-white/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            {errors.role && (
              <p className="text-red-300 text-sm text-center">{errors.role}</p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-300 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">
                  College Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="yourname@akgec.ac.in"
                />
                {errors.email && (
                  <p className="text-red-300 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Roll & Branch */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="sm:w-1/2">
                  <label className="block text-sm font-medium">
                    Student Number
                  </label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="24IT101"
                  />
                  {errors.rollNo && (
                    <p className="text-red-300 text-sm">{errors.rollNo}</p>
                  )}
                </div>

                <div className="sm:w-1/2">
                  <label className="block text-sm font-medium">Branch</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="mt-1 w-full h-[45px] px-4 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch, idx) => (
                      <option key={idx} value={branch} className="text-black">
                        {branch}
                      </option>
                    ))}
                  </select>
                  {errors.branch && (
                    <p className="text-red-300 text-sm">{errors.branch}</p>
                  )}
                </div>
              </div>

              {/* Domain + GitHub */}
              {role === "Student" && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="sm:w-1/2">
                    <label className="block text-sm font-medium">Domain</label>
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      className="mt-1 w-full h-[45px] px-4 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select Domain</option>
                      {domains.map((domain, idx) => (
                        <option key={idx} value={domain} className="text-black">
                          {domain}
                        </option>
                      ))}
                    </select>
                    {errors.domain && (
                      <p className="text-red-300 text-sm">{errors.domain}</p>
                    )}
                  </div>

                  <div className="sm:w-1/2">
                    <label className="block text-sm font-medium">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="https://github.com/username"
                    />
                    {errors.github && (
                      <p className="text-red-300 text-sm">{errors.github}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Password */}
              {/* <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="••••••"
                />
                {errors.password && (
                  <p className="text-red-300 text-sm">{errors.password}</p>
                )}
              </div> */}


              <div className="relative mt-">
                 <label className="block text-sm font-medium">
                    Phone Number
                  </label>
                <input
                  type="number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2  h-[45px] pr-10 rounded-xl  bg-white/30 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="xxxxxxxxxx"
                />
</div>
        

              {errors.phoneNumber && (
                <p className="text-red-300 text-sm">{errors.phoneNumber}</p>
              )}

              <div className="relative mt-">
                 <label className="block text-sm font-medium">
                    Password
                  </label>
                <input
                  type={showpassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2  h-[45px] pr-10 rounded-xl  bg-white/30 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="••••••"
                />

          
                <div
                  onClick={() => setShowPassword(!showpassword)}
                  className="absolute inset-y-4 top-8 right-3 flex justify-center items-center cursor-pointer text-white/80"
                >
                  {showpassword ? <EyeIcon /> : <EyeClosed />}
                </div>
              </div>

              
               {errors.password && (
                <p className="text-red-300 text-sm">{errors.password}</p>
              )}

             

              {/* Security Code */}
              {role === "Admin" && (
                <div>
                  <label className="block text-sm font-medium">
                    Security Code
                  </label>
                  <input
                    type="password"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 h-[45px] rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="••••••"
                  />
                  {errors.code && (
                    <p className="text-red-300 text-sm">{errors.code}</p>
                  )}
                </div>
              )}

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                type="submit"
                onClick={sendOtp}
                disabled={loading || otpLoading}
                className="w-full py-3  rounded-xl cursor-pointer mt-3 h-[45px] font-semibold border-[1px] border-white/10 bg-gradient-to-l from-white/10 via-red-950 to-white/10 text-white hover:opacity-90 transition disabled:opacity-50 shadow-lg"
              >
                {loading
                  ? "Registering..."
                  : otpLoading
                  ? "Sending OTP..."
                  : "Send OTP & Register"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {showEmail && (
        <div className="absolute bg-black/20 bg-opacity-70 backdrop-blur-sm h-[100%] inset-0 z-50 mt-[500px] sm:mt-0 flex items-center justify-center">
          <div className="relative flex flex-col gap-2 items-center w-full sm:w-[90%] md:w-[60%] lg:w-[40%] bg-gradient-to-b from-black to-red-900 border border-gray-600 p-6 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] mx-4">
            <button
              className="absolute cursor-pointer top-3 right-3 text-white hover:text-red-500 text-xl"
              onClick={() => setShowEmail(false)}
              aria-label="Close"
            >
              <ImCross />
            </button>

            <div className="text-2xl sm:text-3xl font-bold text-white text-center">
              Verify OTP
            </div>

            <div className="p sm:text-sm  text-xs text-[#CBD5E1] text-center px-2">
              We have sent a One-Time Password (OTP) to your registered email
              address. Please check your inbox and enter the OTP in the field
              below to proceed. You have 5 minutes to enter a otp.
              <p className="text-white font-bold text-xs">
                <span className="text-red-500 mr-2">Alert</span>You are able to
                send 3 otp in 24 hour
              </p>
            </div>

            <div className="otp flex  justify-center items-center gap-2 mt-4">
              <OtpInput
                value={formData.otp}
                onChange={(otp) => setFormData((prev) => ({ ...prev, otp }))}
                numInputs={5}
                renderInput={(props) => (
                  <input
                    {...props}
                    placeholder="-"
                    className="shadow-[0px_1px_2px_rgba(255,255,255,0.6)] h-[80px] bg-white/20 text-white font-bold rounded-lg m-2"
                  />
                )}
                // className="w-56 sm:w-96 bg-white m-4"
                inputStyle={{
                  width: "clamp(2.4rem, 10vw, 3.2rem)",
                  height: "clamp(2.8rem, 12vw, 3.2rem)",
                  fontSize: "1.25rem",
                }}
                shouldAutoFocus
              />
            </div>
           
            <div className="w-full flex justify-between items-center">
              <button
                disabled={resendDisabled}
                onClick={handleResendotp}
                className={`text-lg font-semibold transition ${
                  resendDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-white cursor-pointer"
                }`}
              >
                {resendDisabled ? `Resend in (${timeLeft}s)` : "Resend OTP"}
              </button>
            </div>

             <div className="block gap-2 mt-4  cursor-pointer w-full">
              <div className="flex justify-center  items-center  z-50">
                <ReCAPTCHA
                  sitekey="6Le3-QArAAAAADn9ym4vDs6qMQN3DpD0yZe183m-"
                  onChange={handleRecaptchaChange}
                   theme="dark"
                  className="cursor-pointer g-recaptcha"
                  ref={reset}
                />
              </div>
            </div>

            <div className="flex justify-center mb-5 sm:mb-0  w-full sm:mt-4  items-center">
              <motion.button
                onClick={handleActualRegistration}
                disabled={
                  otpLoading || !formData.otp || formData.otp.length !== 5
                }
                whileHover={{
                  scale: 1,
                  boxShadow: "0px 0px 10px #7f1d1d",
                }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-l from-white/10 via-red-900 to-white/20 lg:h-[50px] w-full transition-all text-white px-6 py-3 rounded-md text-xl font-semibold border border-white/30  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpLoading ? (
                  <div className="flex cursor-pointer text-white justify-center items-center text-md space-x-2">
                    <div className="w-4 h-4 bg-white rounded-full animate-bounce4"></div>
                    <div className="w-4 h-4 bg-white rounded-full animate-bounce5 animation-delay-200"></div>
                    <div className="w-4 h-4 bg-white rounded-full animate-bounce6 animation-delay-400"></div>
                  </div>
                ) : (
                  <div className="p cursor-pointer text-white">Verify OTP</div>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
