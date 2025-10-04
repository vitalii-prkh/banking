import React from "react";
import Image from "next/image";

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

function AuthLayout(props: RootLayoutProps) {
  return (
    <main className="font-inter flex min-h-screen w-full justify-between">
      {props.children}
      <div className="auth-asset">
        <div>
          <Image
            src="/icons/auth-image.svg"
            alt="Auth image"
            width={500}
            height={500}
            className="rounded-l-xl object-contain"
          />
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
