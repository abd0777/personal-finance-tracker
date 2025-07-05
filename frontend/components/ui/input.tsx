import React from "react";
import classNames from "classnames";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={classNames(
          "border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
