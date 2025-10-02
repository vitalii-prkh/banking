import React from "react";

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

function RootLayout(props: RootLayoutProps) {
  return (
    <main>
      SIDEBAR
      {props.children}
    </main>
  );
}

export default RootLayout;
