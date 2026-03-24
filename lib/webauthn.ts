export async function isWebAuthnAvailable(): Promise<boolean> {
  if (typeof window === "undefined" || 
      !window.PublicKeyCredential || 
      !navigator.credentials) {
    return false;
  }
  
  try {
    // Verificar si hay autenticadores disponibles (móvil o plataforma)
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch {
    return false;
  }
}

export async function registerBiometric(username: string): Promise<boolean> {
  const available = await isWebAuthnAvailable();
  if (!available) return false;

  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { 
          name: "CRM Coy",
          id: window.location.hostname
        },
        user: {
          id: new TextEncoder().encode(username),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },  // ES256
          { alg: -257, type: "public-key" } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          requireResidentKey: false,
          userVerification: "preferred",
        },
        timeout: 60000,
        attestation: "none"
      },
    }) as PublicKeyCredential;

    if (!credential) return false;

    const response = credential.response as AuthenticatorAttestationResponse;
    const publicKey = response.getPublicKey();
    
    const credentialData = {
      id: credential.id,
      publicKey: publicKey ? btoa(String.fromCharCode(...new Uint8Array(publicKey))) : "",
      counter: 0,
    };

    const res = await fetch("/api/webauthn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "register", username, credential: credentialData }),
    });

    return (await res.json()).ok;
  } catch (error) {
    console.error("Error registrando biométrico:", error);
    return false;
  }
}

export async function authenticateBiometric(username: string): Promise<boolean> {
  const available = await isWebAuthnAvailable();
  if (!available) return false;

  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        timeout: 60000,
        userVerification: "preferred",
        allowCredentials: []
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
  } catch (error) {
    console.error("Error autenticando biométrico:", error);
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
