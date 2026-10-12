import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "portfolio_admin_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function signature(value: string) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("Admin access is not configured.");
  return createHmac("sha256", secret)
    .update(`portfolio-session:${value}`)
    .digest("hex");
}

export function constantTimeEqual(a: string, b: string) {
  const first = createHmac("sha256", "portfolio-password-comparison")
    .update(a)
    .digest();
  const second = createHmac("sha256", "portfolio-password-comparison")
    .update(b)
    .digest();
  return timingSafeEqual(first, second);
}

export async function isAdmin() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const [expires, nonce, mac, extra] = token.split(".");
  if (
    extra ||
    !expires ||
    !nonce ||
    !mac ||
    !/^\d+$/.test(expires) ||
    Number(expires) <= Date.now()
  )
    return false;
  return constantTimeEqual(mac, signature(`${expires}.${nonce}`));
}

export async function createAdminSession() {
  const payload = `${Date.now() + SESSION_SECONDS * 1000}.${randomBytes(24).toString("hex")}`;
  (await cookies()).set(ADMIN_COOKIE, `${payload}.${signature(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}
