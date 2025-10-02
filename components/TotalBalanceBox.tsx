import {AnimatedCounter} from "@/components/AnimatedCounter";
import {DoughnutChart} from "@/components/DoughnutChart";

type TotalBalanceBoxProps = {
  accounts: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
};

export function TotalBalanceBox(props: TotalBalanceBoxProps) {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <DoughnutChart accounts={props.accounts} />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="header-box-title">Bank Accounts: {props.totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Total Current Balance</p>
          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={props.totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  );
}
