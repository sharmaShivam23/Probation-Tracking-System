// import { connectDB } from "@/lib/db";
// import UploadedTask from "@/models/UplodedTasks";
// import { NextResponse } from "next/server";
// export async function GET(){

//   try{
//       await connectDB()
//       const Submittedtasks = await UploadedTask.find()
//        return NextResponse.json({ success: true, Submittedtasks });
//   }
//   catch(error : any){
//     console.log(error);
//     // return NextResponse.json({ success: false, message : err.message});
//    return  NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }

// }


import { connectDB } from "@/lib/db";
import UploadedTask from "@/models/UplodedTasks";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const Submittedtasks = await UploadedTask.find().populate("uploadedBy").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, Submittedtasks });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
