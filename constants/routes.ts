export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  MY_BANKS: "/my-banks",
  TRANSACTION_HISTORY: "/transaction-history",
  PAYMENT_TRANSFER: "/payment-transfer",
};

export const SIDEBAR_LINKS = [
  {
    imgURL: "/icons/home.svg",
    route: ROUTES.HOME,
    label: "Home",
  },
  {
    imgURL: "/icons/dollar-circle.svg",
    route: ROUTES.MY_BANKS,
    label: "My Banks",
  },
  {
    imgURL: "/icons/transaction.svg",
    route: ROUTES.TRANSACTION_HISTORY,
    label: "Transaction History",
  },
  {
    imgURL: "/icons/money-send.svg",
    route: ROUTES.PAYMENT_TRANSFER,
    label: "Transfer Funds",
  },
];
