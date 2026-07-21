
import { updateUserService } from "@/services/user/user.services";
import { NextRequest, NextResponse } from "next/server";





export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ userId: string }>;
  }
) {
  try {
    const { userId } = await params;

    const body = await request.json();

    const data = await updateUserService(
      userId,
      body
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update profile.",
      },
      {
        status: 400,
      }
    );
  }
}