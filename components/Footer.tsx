import React from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {ROUTES} from "@/constants/routes";
import {logOut} from "@/lib/actions/user.actions";

type FooterProps = {
  user: User;
  type?: "desktop" | "mobile";
};

export function Footer({user, type = "desktop"}: FooterProps) {
  const router = useRouter();
  const handleLogOut = async () => {
    await logOut();
    router.push(ROUTES.SIGN_IN);
  };

  return (
    <footer className="footer">
      <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
        <p className="text-xl font-bold text-gray-700">{user?.firstName[0]}</p>
      </div>

      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h1 className="text-14 truncate font-semibold text-gray-700">
          {user?.firstName}
        </h1>
        <p className="text-14 truncate font-normal text-gray-600">
          {user?.email}
        </p>
      </div>

      <div
        className="footer_image"
        onClick={handleLogOut}
      >
        <Image
          src="icons/logout.svg"
          fill
          alt="jsm"
        />
      </div>
    </footer>
  );
}
