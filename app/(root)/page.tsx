import {getLoggedInUser} from "@/lib/actions/user.actions";
import {getFullName} from "@/lib/utils";
import {Header} from "@/components/Header";
import {TotalBalanceBox} from "@/components/TotalBalanceBox";
import {RightSidebar} from "@/components/RightSidebar";

async function PageHome() {
  const loggedIn = await getLoggedInUser();

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
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={12123.44}
          />
        </header>
        RECENT TRANSACTIONS
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={[]}
        accounts={[
          {id: "1", name: "Credit", currentBalance: 20000.01, mask: "1111"},
          {id: "2", name: "Debit", currentBalance: 124000.45, mask: "2222"},
        ]}
      />
    </section>
  );
}

export default PageHome;
