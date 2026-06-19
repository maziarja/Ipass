import z from "zod";
import { createResponseSchema, userDataSchema } from "./schemas/responseSchema";

export const register = async (email: string, password: string) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  const parsed = createResponseSchema(userDataSchema).safeParse(data);

  if (!parsed.success) {
    console.error(z.prettifyError(parsed.error));
    throw new Error("Unexpected response from server");
  }
  return parsed.data;
};

export const setupMaster = async (masterSalt: string, masterVerify: string) => {
  const res = await fetch("/api/auth/setup-master", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ masterSalt, masterVerify }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  const parsed = createResponseSchema(z.null()).safeParse(data);

  if (!parsed.success) {
    console.error(z.prettifyError(parsed.error));
    throw new Error("Unexpected response from server");
  }

  return parsed.data;
};

export const getMasterCredentials = async (): Promise<{
  masterSalt: string;
  masterVerify: string;
}> => {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user data");
  const data = await res.json();
  return { masterSalt: data.data.masterSalt, masterVerify: data.data.masterVerify };
};

export const login = async (email: string, password: string) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  const parsed = createResponseSchema(userDataSchema).safeParse(data);

  if (!parsed.success) {
    console.error(z.prettifyError(parsed.error));
    throw new Error("Unexpected response from server");
  }
  return parsed.data;
};

export const logout = async (): Promise<void> => {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
};
