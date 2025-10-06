import Link from "next/link";
import Image from "next/image";
import {ROUTES} from "@/constants/routes";
import {getFullName, countTransactionCategories} from "@/lib/utils";
import {CardBank} from "@/components/CardBank";
import {Category} from "@/components/Category";

type RightSidebarProps = {
  user: User;
  transactions: Transaction[];
  accounts: Account[];
};

export function RightSidebar(props: RightSidebarProps) {
  const categories: CategoryCount[] = countTransactionCategories(
    props.transactions,
  );
  const fullName = getFullName(props.user?.firstName, props.user?.lastName);

  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">
              {props.user?.firstName?.[0]}
            </span>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{fullName}</h1>
            <p className="profile-email">{props.user?.email}</p>
          </div>
        </div>
      </section>
      <section className="banks">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My banks</h2>
          <Link
            href={ROUTES.HOME}
            className="flex gap-2"
          >
            <Image
              src="/icons/plus.svg"
              alt="Plus"
              width={20}
              height={20}
            />
            <h2 className="text-14 font-semibold text-gray-600">Add Bank</h2>
          </Link>
        </div>
        {props.accounts.length !== 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10">
              <CardBank
                key={props.accounts[0].id}
                account={props.accounts[0]}
                fullName={fullName}
                showBalance={false}
              />
            </div>
            {props.accounts[1] && (
              <div className="absolute top-8 right-0 z-0 w-[90%]">
                <CardBank
                  key={props.accounts[1].id}
                  account={props.accounts[1]}
                  fullName={fullName}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="header-2">Top categories</h2>

          <div className="flex flex-col gap-5">
            {categories.map((category, index) => (
              <Category
                key={category.name}
                category={category}
              />
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
}
