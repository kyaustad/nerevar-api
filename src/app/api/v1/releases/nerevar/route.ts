import { NextRequest, NextResponse } from "next/server";

const LATEST_NEREVAR_WINDOWS_RELEASE =
  "https://github.com/kyaustad/Nerevar/releases/download/0.2.0/Nerevar.exe";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    url: LATEST_NEREVAR_WINDOWS_RELEASE,
    version: "0.2.0",
  });
}
