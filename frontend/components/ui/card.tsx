import React from "react";
import classNames from "classnames";

export function Card({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classNames("rounded-2xl shadow-md border bg-white", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classNames("p-4", className)}>{children}</div>;
}
