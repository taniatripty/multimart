import { connectDB } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const db = await connectDB();

    // Ping MongoDB
    await db.command({ ping: 1 });

    console.log("✅ Database Connected:", db.databaseName);

    return NextResponse.json({
      success: true,
      database: db.databaseName,
      message: "MongoDB Connected Successfully",
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Connection Failed",
      },
      { status: 500 }
    );
  }
}