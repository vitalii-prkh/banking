"use server";

import {cookies} from "next/headers";
import {ID, Query} from "node-appwrite";
import {APPWRITE_DATABASE, APPWRITE_COLLECTION_USERS} from "@/constants/env";
import {
  FormSignUpValues,
  FormSignInValues,
  parseStringify,
  // extractCustomerIdFromUrl,
} from "@/lib/utils";
import {createSessionClient, createAdminClient} from "@/lib/appwrite";
// import {createDwollaCustomer} from "@/lib/actions/dwolla.actions";

export async function signUp(values: FormSignUpValues) {
  const {password, ...userData} = values;
  const {email, firstName, lastName} = userData;

  let newUserAccount;

  try {
    const {account, tables} = await createAdminClient();

    newUserAccount = await account.create({
      userId: ID.unique(),
      email,
      password,
      name: `${firstName} ${lastName}`,
    });

    if (!newUserAccount) {
      throw new Error("Error creating user");
    }

    // const dwollaCustomerUrl = await createDwollaCustomer({
    //   ...userData,
    //   type: "personal",
    // });

    // if (!dwollaCustomerUrl) {
    //   throw new Error("Error creating Dwolla customer");
    // }

    // const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await tables.createRow({
      databaseId: APPWRITE_DATABASE,
      tableId: APPWRITE_COLLECTION_USERS,
      rowId: ID.unique(),
      data: {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId: "dwollaCustomerId",
        dwollaCustomerUrl: "dwollaCustomerUrl",
      },
    });

    const session = await account.createEmailPasswordSession({email, password});
    const cookieStore = await cookies();

    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
}

export async function signIn(
  values: Pick<FormSignInValues, "email" | "password">,
) {
  const {email, password} = values;

  try {
    const {account} = await createAdminClient();
    const session = await account.createEmailPasswordSession({email, password});
    const cookieStore = await cookies();

    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({userId: session.userId});

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
}

export async function getLoggedInUser() {
  try {
    const {account} = await createSessionClient();
    const result = await account.get();
    const user = await getUserInfo({userId: result.$id});

    return parseStringify(user);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getUserInfo = async ({userId}: {userId: string}) => {
  try {
    const {tables} = await createAdminClient();
    const {rows} = await tables.listRows({
      databaseId: APPWRITE_DATABASE,
      tableId: APPWRITE_COLLECTION_USERS,
      queries: [Query.equal("userId", userId)],
    });
    const [user] = rows;

    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

export const logOut = async () => {
  try {
    const {account} = await createSessionClient();
    const cookieStore = await cookies();

    cookieStore.delete("appwrite-session");

    await account.deleteSession({sessionId: "current"});
  } catch (error) {
    return null;
  }
};
