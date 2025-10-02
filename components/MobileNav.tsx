"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ROUTES, SIDEBAR_LINKS} from "@/constants/routes";
import {cn} from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

type MobileNavProps = {
  user: User;
};

export function MobileNav(props: MobileNavProps) {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            alt="Menu"
            width={30}
            height={30}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="border-none bg-white"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Link
            href={ROUTES.HOME}
            className="flex cursor-pointer items-center gap-1 px-4"
          >
            <Image
              src="/icons/logo.svg"
              alt="Horizon Logo"
              width={34}
              height={34}
            />
            <h1 className="text-26 font-ibm-plex-serif text-black-1 font-bold">
              Horizon
            </h1>
          </Link>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {SIDEBAR_LINKS.map((link) => {
                  const {route} = link;
                  const active =
                    route === pathname || pathname.startsWith(`${route}/`);

                  return (
                    <SheetClose
                      asChild
                      key={link.label}
                    >
                      <Link
                        href={route}
                        className={cn("mobilenav-sheet_close w-full", {
                          "bg-bank-gradient": active,
                        })}
                      >
                        <Image
                          src={link.imgURL}
                          alt={link.label}
                          width={20}
                          height={20}
                          className={cn({"brightness-[3] invert-0": active})}
                        />
                        <p
                          className={cn("text-16 text-black-2 font-semibold", {
                            "!text-white": active,
                          })}
                        >
                          {link.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
                USER
              </nav>
            </SheetClose>
            FOOTER
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
