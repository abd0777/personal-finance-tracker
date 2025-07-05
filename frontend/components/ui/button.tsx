import React from "react";
import classNames from "classnames";

type Variant = "default" | "destructive";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const styles = {
      default: "bg-blue-600 hover:bg-blue-700 text-white",
      destructive: "bg-red-600 hover:bg-red-700 text-white",
    };

    return (
      <button
        ref={ref}
        className={classNames(
          "px-4 py-2 rounded-md text-sm font-medium focus:outline-none",
          styles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
