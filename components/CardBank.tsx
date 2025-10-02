import Link from "next/link";
import Image from "next/image";
import {ROUTES} from "@/constants/routes";
import {formatAmount} from "@/lib/utils";

type CardBankProps = {
  account: Account;
  fullName: string;
  showBalance: boolean;
};

export function CardBank(props: CardBankProps) {
  return (
    <div className="flex flex-col">
      <Link
        href={ROUTES.HOME}
        className="bank-card"
      >
        <div className="bank-card_content">
          <div>
            <h1 className="text-16 font-semibold text-white">
              {props.account.name || props.fullName}
            </h1>
            <p className="text-ibmplex-serif font-black text-white">
              {formatAmount(props.account.currentBalance)}
            </p>
          </div>
          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white">
                {props.fullName}
              </h1>
              <h2 className="text-12 font-semibold text-white">●● / ●●</h2>
            </div>
            <p className="text-12 font-semibold tracking-[1.1px] text-white">
              ●●●●&nbsp;●●●●&nbsp;●●●●&nbsp;
              <span className="text-14">{props.account?.mask}</span>
            </p>
          </article>
        </div>
        <div className="bank-card_icon">
          <Image
            src="/icons/Paypass.svg"
            alt="pay"
            width={20}
            height={24}
          />
          <Image
            src="/icons/mastercard.svg"
            alt="mastercard"
            width={45}
            height={32}
            className="ml-5"
          />
        </div>
        <Image
          src="/icons/lines.svg"
          alt="lines"
          width={316}
          height={119}
          className="absolute top-0 left-0"
        />
      </Link>
    </div>
  );
}
