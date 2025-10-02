import {Header} from "@/components/Header";
import {TotalBalanceBox} from "@/components/TotalBalanceBox";

function PageHome() {
  const loggedIn = {
    firstName: "Vitaii",
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
      </div>
    </section>
  );
}

export default PageHome;
