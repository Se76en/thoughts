import { createHmac } from "crypto";

const SESSION_COOKIE = "admin_session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("SESSION_SECRET or ADMIN_PASSWORD must be set");
  return secret;
}

export function createSessionPayload(): string {
  const payload = Buffer.from(
    JSON.stringify({ a: true, t: Date.now() })
  ).toString("base64");
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySession(token: string): boolean {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;
    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (sig !== expected) return false;
    const data = JSON.parse(Buffer.from(payload, "base64").toString());
    if (Date.now() - data.t > 24 * 60 * 60 * 1000) return false;
    return data.a === true;
  } catch {
    return false;
  }
}

export function getSessionFromCookie(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]*)`));
  if (!match) return false;
  return verifySession(decodeURIComponent(match[1]));
}
