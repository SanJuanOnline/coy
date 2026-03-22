import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const KEY = "crm:users";

type Users = Record<string, string>; // { username: password }

async function readUsers(): Promise<Users> {
  return (await kv.get<Users>(KEY)) ?? {};
}

async function writeUsers(users: Users): Promise<void> {
  await kv.set(KEY, users);
}

export async function GET() {
  const users = await readUsers();
  return NextResponse.json({ hasUser: Object.keys(users).length > 0 });
}

export async function POST(req: NextRequest) {
  const { action, username, password } = await req.json();

  if (action === "create") {
    const users = await readUsers();
    if (users[username]) {
      return NextResponse.json({ ok: false, error: "Ese nombre de usuario ya existe" }, { status: 400 });
    }
    users[username] = password;
    await writeUsers(users);
    return NextResponse.json({ ok: true });
  }

  if (action === "verify") {
    const users = await readUsers();
    if (users[username] === password) {
      return NextResponse.json({ ok: true, username });
    }
    return NextResponse.json({ ok: false, error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }

  if (action === "delete") {
    const users = await readUsers();
    delete users[username];
    await writeUsers(users);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Acción no válida" }, { status: 400 });
}
