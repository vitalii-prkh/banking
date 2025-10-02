import {Header} from "@/components/Header";
import {TotalBalanceBox} from "@/components/TotalBalanceBox";
import {RightSidebar} from "@/components/RightSidebar";

function PageHome() {
  const loggedIn = {
    firstName: "Vitalii",
    lastName: "Demo",
    email: "vitalii.demo@example.com",
  };

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <Header
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
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
