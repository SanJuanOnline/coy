import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const KEY_PREFIX = "crm:webauthn:";

interface WebAuthnCredential {
  id: string;
  publicKey: string;
  counter: number;
}

async function getCredentials(username: string): Promise<WebAuthnCredential[]> {
  return (await kv.get<WebAuthnCredential[]>(`${KEY_PREFIX}${username}`)) ?? [];
}

async function saveCredentials(username: string, credentials: WebAuthnCredential[]): Promise<void> {
  await kv.set(`${KEY_PREFIX}${username}`, credentials);
}

export async function POST(req: NextRequest) {
  const { action, username, credential } = await req.json();

  if (action === "register") {
    const credentials = await getCredentials(username);
    credentials.push(credential);
    await saveCredentials(username, credentials);
    return NextResponse.json({ ok: true });
  }

  if (action === "verify") {
    const credentials = await getCredentials(username);
    const found = credentials.find((c) => c.id === credential.id);
    if (found) {
      return NextResponse.json({ ok: true, username });
    }
    return NextResponse.json({ ok: false, error: "Credencial no válida" }, { status: 401 });
  }

  if (action === "hasCredential") {
    const credentials = await getCredentials(username);
    return NextResponse.json({ ok: true, hasCredential: credentials.length > 0 });
  }

  return NextResponse.json({ ok: false, error: "Acción no válida" }, { status: 400 });
}
