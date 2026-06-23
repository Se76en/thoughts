import { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  const authenticated = !!(session && verifySession(session.value));
  return Response.json({ authenticated });
}
