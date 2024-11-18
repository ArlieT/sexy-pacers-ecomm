"use client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export interface ButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof input> {}

const input = cva(
  [
    "px-2 py-2 md:px-8 rounded-full placeholder:text-sm placeholder:text-gray-900/50",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-white/95 dark:bg-black",
          "text-slate-900 dark:text-white",
          "border-transparent",
          "hover:bg-white",
        ],

        outline: ["text-black border border-gray-900/50"],
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  },
);

export interface ButtonVariants extends VariantProps<typeof input> {}

const Input = ({ children, className, intent, ...props }: ButtonProps) => {
  return <input {...props} className={twMerge(input({ intent }), className)} />;
};

export default Input;
