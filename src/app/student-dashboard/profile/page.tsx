"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Pencil, Trash2, X, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);


  const domains = 
    ["Frontend Development",
        "Backend Development",
        "App Development",
        "UI/UX Designing",
        "Cloud Computing",
        "Machine Learning",
        "Video Editing",
        "Other",]
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/Dashboard_Students/profile", {
          withCredentials: true,
        });
        // console.log(res);
        
        setProfile(res?.data?.candidate);
        setFormData(res?.data?.candidate);
      } catch (err: any) {
        // console.log(err);
        
        toast.error(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);

    try {
      const res = await axios.put("/api/Dashboard_Students/profile", formData, {
        withCredentials: true,
      });

      setProfile(res?.data?.updatedCandidate);
      setFormData(res?.data?.updatedCandidate);
      toast.success("Profile updated successfully");
      setEditOpen(false);
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePassword) return toast.error("Please enter your password");

    setDeleting(true);
    try {
      const res = await axios.delete("/api/Dashboard_Students/profile", {
        data: { password: deletePassword },
        withCredentials: true,
      });
    // console.log(res);
    
      if (res?.data?.success) {
        toast.success("Profile deleted successfully");
        localStorage.removeItem("token")
        setDeleteOpen(false);
        setDeletePassword("");
        window.location.href = "/login";
      } else {
        toast.error(res?.data?.message || "Delete failed");
      }
    } catch (err: any) {
      // console.log(err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white text-lg">No profile data found.</p>
      </div>
    );

  return (
    <div className="min-h-screen overflow-x-hidden flex items-center justify-center sm:p-4">
    <Toaster/>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="sm:max-w-3xl w-[95vw] rounded-2xl p-6 sm:p-8 bg-white/10 backdrop-blur-xl  border border-red-900/40 shadow-xl text-white relative"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-24 h-24 rounded-full bg-gradient-to-b from-red-900 to-black flex items-center justify-center text-4xl font-bold shadow-lg"
          >
            {profile.name[0]}
          </motion.div>
          <h1 className="mt-4 text-3xl font-semibold">{profile.name}</h1>
          <span className="mt-1 text-xs px-3 py-1 rounded-full bg-red-900/40 border border-red-800">
            {profile.role}
          </span>
        </div>

        {/* Details */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-auto relative z-10"
        >
          <DetailItem label="Email" value={profile.email} />
          <DetailItem label="Student No" value={profile.rollNo} />
          <DetailItem label="Branch" value={profile.branch} />
          <DetailItem label="Github" value={profile.github} isLink />
          <DetailItem label="Domain" value={profile.domain || "N/A"} />
          <DetailItem
            label="Probation Status"
            value={profile.probationStatus}
            badgeColor={
              profile.probationStatus === "active"
                ? "bg-green-700/30 border-green-700"
                : profile.probationStatus === "completed"
                  ? "bg-blue-700/30 border-blue-700"
                  : "bg-red-700/30 border-red-700"
            }
          />
          <DetailItem
            label="Joined"
            value={new Date(profile.createdAt).toLocaleDateString()}
          />
          <DetailItem
            label="Last Updated"
            value={new Date(profile.updatedAt).toLocaleDateString()}
          />
        </motion.div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-red-900 hover:bg-red-900/30 rounded-xl transition-all cursor-pointer shadow-md hover:scale-105"
          >
            <Pencil className="w-4 h-4" /> Update
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-2  cursor-pointer px-4 py-2 bg-red-900 hover:bg-red-800 rounded-xl transition-all shadow-md hover:scale-105"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editOpen && (
            <Modal onClose={() => setEditOpen(false)} title="Edit Profile">
              <div className="space-y-4">
                <input
                  // className="w-full px-3 py-2 rounded-lg  border border-red-900 text-white focus:outline-none"
                   className="mt-1 w-full h-[45px] px-4 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                 className="mt-1 w-full h-[45px] px-4 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                
                  // className="w-full  px-3 py-2 text-xs rounded-lg bg-black/20 border border-red-900 text-white focus:outline-none"
                  placeholder="Github"
                  value={formData.github}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                />
                
                <select
            
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData({ ...formData, domain: e.target.value })
                  }
                  className="mt-1 w-full h-[45px] px-4 rounded-xl bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select Domain</option>
                  {domains.map((domain, idx) => (
                    <option key={idx} value={domain} className="text-black">
                      {domain}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="px-4 py-2 bg-red-900 rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updating && <Loader2 className="w-4 h-4  cursor-pointer animate-spin" />}
                  {updating ? "Saving..." : "Save"}
                </button>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteOpen && (
            <Modal onClose={() => setDeleteOpen(false)} title="Confirm Delete">
              <p className="text-gray-300 mb-3">
                Enter your password to confirm account deletion. This action is{" "}
                <span className="text-red-400 font-semibold">irreversible</span>.
              </p>
              <div className="flex items-center gap-2 bg-black border border-red-900 rounded-lg p-2">
                <Lock className="text-red-500" />
                <input
                  type="password"
                  placeholder="Password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-white"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="px-4 py-2  cursor-pointer bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-900 rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  isLink,
  badgeColor,
}: {
  label: string;
  value: string;
  isLink?: boolean;
  badgeColor?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      className="flex flex-col p-3 rounded-lg bg-black/40 hover:bg-black/60 transition-all"
    >
      <span className="text-gray-400 text-sm">{label}</span>
      {isLink ? (
        <a href={value} target="_blank" className="text-red-400 hover:underline">
          {value}
        </a>
      ) : badgeColor ? (
        <span
          className={`mt-1 px-2 py-1 rounded-lg border text-sm w-fit ${badgeColor}`}
        >
          {value}
        </span>
      ) : (
        <span className="font-medium break-words">{value}</span>
      )}
    </motion.div>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.85 }}
        transition={{ duration: 0.2 }}
        className="bg-black border border-red-900 p-6 rounded-2xl w-full max-w-lg shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-white" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
