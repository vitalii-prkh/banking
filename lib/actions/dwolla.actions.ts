"use server";

import {dwollaClient} from "@/lib/dwolla";

export async function createDwollaCustomer(
  newCustomer: NewDwollaCustomerParams,
) {
  try {
    return await dwollaClient
      .post("customers", newCustomer)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("Creating a Dwolla Customer Failed: ", err);
  }
}

export async function addFundingSource({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add a funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
}

export async function createOnDemandAuthorization() {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations",
    );
    const authLink = onDemandAuthorization.body._links;

    return authLink;
  } catch (err) {
    console.error("Creating an On Demand Authorization Failed: ", err);
  }
}

// Create a Dwolla Funding Source using a Plaid Processor Token
export async function createFundingSource(options: CreateFundingSourceOptions) {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("Creating a Funding Source Failed: ", err);
  }
}
