"use server";

import {revalidatePath} from "next/cache";
import {cookies} from "next/headers";
import {ID, Query} from "node-appwrite";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import {
  APPWRITE_DATABASE,
  APPWRITE_COLLECTION_USERS,
  APPWRITE_COLLECTION_BANKS,
} from "@/constants/env";
import {
  FormSignUpValues,
  FormSignInValues,
  parseStringify,
  extractCustomerIdFromUrl,
  encryptId,
  normalizeUSState,
} from "@/lib/utils";
import {createSessionClient, createAdminClient} from "@/lib/appwrite";
import {plaidClient} from "@/lib/plaid";
import {
  createDwollaCustomer,
  addFundingSource,
} from "@/lib/actions/dwolla.actions";

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

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      // Ensure state is a 2-letter uppercase abbreviation as required by Dwolla
      state: normalizeUSState(userData.state),
      type: "personal",
    });

    if (!dwollaCustomerUrl) {
      throw new Error("Error creating Dwolla customer");
    }

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await tables.createRow({
      databaseId: APPWRITE_DATABASE,
      tableId: APPWRITE_COLLECTION_USERS,
      rowId: ID.unique(),
      data: {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
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

export async function getUserInfo({userId}: {userId: string}) {
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
}

export async function logOut() {
  try {
    const {account} = await createSessionClient();
    const cookieStore = await cookies();

    cookieStore.delete("appwrite-session");

    await account.deleteSession({sessionId: "current"});
  } catch (error) {
    return null;
  }
}

export async function createLinkToken(user: User) {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth", "transactions"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({linkToken: response.data.link_token});
  } catch (error) {
    console.log(error);
  }
}

export async function exchangePublicToken({
  publicToken,
  user,
}: exchangePublicTokenProps) {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) {
      throw Error;
    }

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({publicTokenExchange: "complete"});
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
}

export async function createBankAccount({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) {
  try {
    const {tables} = await createAdminClient();

    const bankAccount = await tables.createRow({
      databaseId: APPWRITE_DATABASE,
      tableId: APPWRITE_COLLECTION_BANKS,
      rowId: ID.unique(),
      data: {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      },
    });

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
}

export async function getBanks({userId}: getBanksProps) {
  try {
    const {tables} = await createAdminClient();

    const banks = await tables.listRows({
      databaseId: APPWRITE_DATABASE,
      tableId: APPWRITE_COLLECTION_BANKS,
      queries: [Query.equal("userId", userId)],
    });

    return parseStringify(banks.rows);
  } catch (error) {
    console.log(error);
  }
}

export async function getBank({documentId}: getBankProps) {
  try {
    const {tables} = await createAdminClient();
    const bank = await tables.listRows({
      databaseId: APPWRITE_DATABASE,
      tableId: APPWRITE_COLLECTION_BANKS,
      queries: [Query.equal("$id", documentId)],
    });

    return parseStringify(bank.rows[0]);
  } catch (error) {
    console.log(error);
  }
}

export async function getBankByAccountId({accountId}: getBankByAccountIdProps) {
  try {
    const {tables} = await createAdminClient();
    const bank = await tables.listRows({
      databaseId: APPWRITE_DATABASE,
      tableId: APPWRITE_COLLECTION_BANKS,
      queries: [Query.equal("accountId", [accountId])],
    });

    if (bank.total !== 1) {
      return null;
    }

    return parseStringify(bank.rows[0]);
  } catch (error) {
    console.log(error);
  }
}
