type HeaderProps = {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user: string;
};

export function Header(props: HeaderProps) {
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {props.title}
        {props.type === "greeting" && (
          <span className="text-bank-gradient">&nbsp;{props.user}</span>
        )}
      </h1>
      <p className="header-box-subtext">{props.subtext}</p>
    </div>
  );
}
