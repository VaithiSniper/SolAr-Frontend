import { useWallet } from "@solana/wallet-adapter-react";
import classNames from "classnames";
import React, { MouseEventHandler, ReactNode } from "react";

export type ButtonState = "initial" | "loading" | "success" | "error";

type Props = {
  state: ButtonState;
  onClick: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  className?: string;
};
export function Button({ type, state, onClick, children, className }: Props) {

  const buttonClasses = classNames("btn", className);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(event);
  };

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      type={type}
      disabled={state === "loading"}
    >
      {children}
    </button>
  );
}
