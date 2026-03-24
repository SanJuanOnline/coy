export function isWebAuthnAvailable(): boolean {
  return typeof window !== "undefined" && 
         window.PublicKeyCredential !== undefined &&
         navigator.credentials !== undefined;
}

export async function registerBiometric(username: string): Promise<boolean> {
  if (!isWebAuthnAvailable()) return false;

  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "CRM Coy" },
        user: {
          id: new TextEncoder().encode(username),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
      },
    }) as PublicKeyCredential;

    if (!credential) return false;

    const response = credential.response as AuthenticatorAttestationResponse;
    const credentialData = {
      id: credential.id,
      publicKey: btoa(String.fromCharCode(...new Uint8Array(response.getPublicKey()!))),
      counter: 0,
    };

    const res = await fetch("/api/webauthn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "register", username, credential: credentialData }),
    });

    return (await res.json()).ok;
  } catch {
    return false;
  }
}

export async function authenticateBiometric(username: string): Promise<boolean> {
  if (!isWebAuthnAvailable()) return false;

  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "required",
      },
    }) as PublicKeyCredential;

    if (!credential) return false;

    const res = await fetch("/api/webauthn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "verify", 
        username, 
        credential: { id: credential.id } 
      }),
    });

    return (await res.json()).ok;
  } catch {
    return false;
  }
}

export async function hasRegisteredBiometric(username: string): Promise<boolean> {
  if (!username) return false;
  
  try {
    const res = await fetch("/api/webauthn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "hasCredential", username }),
    });
    const data = await res.json();
    return data.hasCredential;
  } catch {
    return false;
  }
}
