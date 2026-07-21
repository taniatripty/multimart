import { getSingleUserService, updateUserRoleService } from "@/services/user/user.services";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id} = await params;

    const data = await getSingleUserService(
      id
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch user.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const result = await updateUserRoleService({
      id,
      role: body.role,
    });

    return NextResponse.json(result, {
      status: result.status,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      {
        status: 500,
      }
    );
  }
}