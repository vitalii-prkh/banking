"use server";

import {Client, Account, Databases, Users, TablesDB} from "node-appwrite";
import {cookies} from "next/headers";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_KEY,
} from "@/constants/env";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

  const cookieStore = await cookies();
  const session = cookieStore.get("appwrite-session");

  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_KEY);

  return {
    get account() {
      return new Account(client);
    },
    /**
     * @deprecated
     */
    get database() {
      return new Databases(client);
    },
    get tables() {
      return new TablesDB(client);
    },
    get user() {
      return new Users(client);
    },
  };
}
