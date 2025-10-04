import React from "react";
import Image from "next/image";
import {redirect} from "next/navigation";
import {ROUTES} from "@/constants/routes";
import {getLoggedInUser} from "@/lib/actions/user.actions";
import {Sidebar} from "@/components/Sidebar";
import {MobileNav} from "@/components/MobileNav";

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

async function RootLayout(props: RootLayoutProps) {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    redirect(ROUTES.SIGN_IN);
  }

  return (
    <main className="font-inter flex h-screen w-full">
      <Sidebar user={loggedIn} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image
            src="/icons/logo.svg"
            alt="Horizon Logo"
            width={30}
            height={30}
          />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {props.children}
      </div>
    </main>
  );
}

export default RootLayout;
