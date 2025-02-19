import { signInWithRedirect } from "aws-amplify/auth";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 }
    );
  }

  const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI;
  const tokenUrl = `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Client ID or Redirect URI is missing" },
      { status: 400 }
    );
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code: code,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to fetch token", details: errorText },
        { status: response.status }
      );
    }

    const tokens = await response.json();

    await signInWithRedirect({ provider: "Google" });

    return NextResponse.json(
      { message: "Redirecting to the app" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
