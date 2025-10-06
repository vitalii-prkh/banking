import React from "react";
import {Header} from "@/components/Header";
import {BankCard} from "@/components/BankCard";
import {getLoggedInUser} from "@/lib/actions/user.actions";
import {getAccounts} from "@/lib/actions/bank.actions";

async function PageMyBanks() {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({userId: loggedIn.$id});

  return (
    <section className="flex">
      <div className="my-banks">
        <Header
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activites."
        />

        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts &&
              accounts.data.map((a: Account) => (
                <BankCard
                  key={a.id}
                  account={a}
                  userName={loggedIn?.firstName}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PageMyBanks;
