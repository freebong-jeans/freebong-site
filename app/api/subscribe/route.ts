import { NextResponse } from "next/server";

// Simple in-memory rate limiter: max 5 requests per IP per 60s
const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Muitas tentativas. Tente novamente em breve." }, { status: 429 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@") || email.length > 254) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }

    // TODO: conectar Mailchimp/Klaviyo aqui
    console.log("[fbg:subscribe]", email, new Date().toISOString());

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
