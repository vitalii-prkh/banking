import {getLoggedInUser} from "@/lib/actions/user.actions";
import {getAccounts, getAccount} from "@/lib/actions/bank.actions";
import {getFullName} from "@/lib/utils";
import {Header} from "@/components/Header";
import {TotalBalanceBox} from "@/components/TotalBalanceBox";
import {RightSidebar} from "@/components/RightSidebar";
import {RecentTransactions} from "@/components/RecentTransactions";

type PageHomeProps = Readonly<{
  searchParams: Promise<{id?: string; page: string}>;
}>;

async function PageHome(props: PageHomeProps) {
  const searchParams = await props.searchParams;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({userId: loggedIn?.$id});

  if (!accounts) {
    return;
  }

  const appwriteItemId = searchParams.id || accounts.data[0]?.appwriteItemId;
  const account = await getAccount({appwriteItemId});

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <Header
            type="greeting"
            title="Welcome"
            user={getFullName(loggedIn?.firstName, loggedIn?.lastName, "Guest")}
            subtext="Access and manage your account and transactions efficienty."
          />
          <TotalBalanceBox
            accounts={accounts.data || []}
            totalBanks={accounts.totalBanks || 0}
            totalCurrentBalance={accounts.totalCurrentBalance || 0}
          />
        </header>
        <RecentTransactions
          accounts={accounts.data || []}
          transactions={account.transactions || []}
          appwriteItemId={appwriteItemId}
          page={Number(searchParams.page) || 1}
        />
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={account.transactions || []}
        accounts={(accounts.data || []).slice(0, 2)}
      />
    </section>
  );
}

export default PageHome;
