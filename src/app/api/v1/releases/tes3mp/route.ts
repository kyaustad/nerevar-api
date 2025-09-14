import { NextRequest, NextResponse } from "next/server";

const LATEST_TES3MP_WINDOWS_RELEASE =
  "https://github.com/TES3MP/TES3MP/releases/download/tes3mp-0.8.1/tes3mp.Win64.release.0.8.1.zip";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    url: LATEST_TES3MP_WINDOWS_RELEASE,
    version: "0.8.1",
  });
}
