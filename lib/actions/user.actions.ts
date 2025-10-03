"use server";

import {FormAuthValues} from "@/lib/utils";

export async function signUp(values: FormAuthValues) {
  try {
    return Promise.resolve(values);
  } catch (error) {
    console.log(error);
  }
}

export async function signIn(
  values: Pick<FormAuthValues, "email" | "password">,
) {
  try {
    return Promise.resolve({});
  } catch (error) {
    console.log(error);
  }
}
