"use server";

import {ID, Query} from "node-appwrite";
import {
  APPWRITE_DATABASE,
  APPWRITE_COLLECTION_TRANSACTIONS,
} from "@/constants/env";
import {createAdminClient} from "../appwrite";
import {parseStringify} from "../utils";

export async function createTransaction(transaction: CreateTransactionProps) {
  try {
    const {tables} = await createAdminClient();

    const newTransaction = await tables.createRow({
      databaseId: APPWRITE_DATABASE,
      tableId: APPWRITE_COLLECTION_TRANSACTIONS,
      rowId: ID.unique(),
      data: {
        channel: "online",
        category: "Transfer",
        ...transaction,
      },
    });

    return parseStringify(newTransaction);
  } catch (error) {
    console.log(error);
  }
}

export async function getTransactionsByBankId({
  bankId,
}: getTransactionsByBankIdProps) {
  try {
    const {tables} = await createAdminClient();

    const senderTransactions = await tables.listRows({
      databaseId: APPWRITE_DATABASE,
      tableId: APPWRITE_COLLECTION_TRANSACTIONS,
      queries: [Query.equal("senderBankId", bankId)],
    });

    const receiverTransactions = await tables.listRows({
      databaseId: APPWRITE_DATABASE,
      tableId: APPWRITE_COLLECTION_TRANSACTIONS,
      queries: [Query.equal("receiverBankId", bankId)],
    });

    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      documents: [...senderTransactions.rows, ...receiverTransactions.rows],
    };

    return parseStringify(transactions);
  } catch (error) {
    console.log(error);
  }
}
