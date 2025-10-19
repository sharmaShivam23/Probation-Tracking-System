
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import LockedAttendance from "@/models/lockedAttendance";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "POST") {
    const { date } = req.body;

    if (!date) return res.status(400).json({ success: false, message: "Date is required" });

    try {
      const exists = await LockedAttendance.findOne({ date });
      if (exists) return res.status(400).json({ success: false, message: "Attendance already locked for this date" });

      const locked = await LockedAttendance.create({ date });
      return res.status(200).json({ success: true, message: "Attendance locked successfully", locked });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  } else if (req.method === "GET") {
    // check if a date is locked
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: "Date is required" });

    const exists = await LockedAttendance.findOne({ date });
    return res.status(200).json({ success: true, locked: !!exists });
  }
}
