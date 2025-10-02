import React from "react";

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

function AuthLayout(props: RootLayoutProps) {
  return <main>{props.children}</main>;
}

export default AuthLayout;
