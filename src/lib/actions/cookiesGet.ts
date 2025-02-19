"use server";

import { cookies } from "next/headers";

export const fecthCookies = async () => {
  const cookieStore = cookies();
  const cookie = cookieStore.getAll();
  const idTokenKey = cookie.map((c) => {
    return new RegExp(
      `CognitoIdentityServiceProvider\\.${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID}\\..+\\.idToken`
    );
  });
  const idToken =
    cookie.find((c) => idTokenKey.some((regex) => regex.test(c.name)))?.value ||
    null;
  return idToken;
};
