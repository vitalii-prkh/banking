"use client";

import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {ROUTES, SIDEBAR_LINKS} from "@/constants/routes";
import {cn} from "@/lib/utils";
import {Footer} from "@/components/Footer";
import {PlaidLink} from "@/components/PlaidLink";

type SidebarProps = {
  user: User;
};

export function Sidebar(props: SidebarProps) {
  const pathname = usePathname();

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link
          href={ROUTES.HOME}
          className="mb-12 flex cursor-pointer items-center gap-2"
        >
          <Image
            src="/icons/logo.svg"
            alt="Horizon Logo"
            width={34}
            height={34}
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        {SIDEBAR_LINKS.map((link) => {
          const {route} = link;
          const active = route === pathname || pathname.startsWith(`${route}/`);

          return (
            <Link
              key={link.label}
              href={route}
              className={cn("sidebar-link", {"bg-bank-gradient": active})}
            >
              <div className="relative size-6">
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  fill
                  className={cn({"brightness-[3] invert-0": active})}
                />
              </div>
              <p className={cn("sidebar-label", {"!text-white": active})}>
                {link.label}
              </p>
            </Link>
          );
        })}
        <PlaidLink user={props.user} />
      </nav>
      <Footer
        type="desktop"
        user={props.user}
      />
    </section>
  );
}
