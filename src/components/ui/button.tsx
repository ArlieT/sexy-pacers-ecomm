"use client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof button> {}
const button = cva(["px-6 py-2 md:px-8 rounded-full"], {
  variants: {
    variant: {
      primary: [
        "bg-white/95 dark:bg-black",
        "text-slate-900 dark:text-white",
        "border-transparent",
        "hover:bg-white",
      ],

      outline: [
        "text-white border",
        "",
        "border-white/80",
        "hover:border-white",
      ],
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface ButtonVariants extends VariantProps<typeof button> {}

const Button = ({ children, className, variant, ...props }: ButtonProps) => {
  return (
    <button {...props} className={twMerge(button({ variant }), className)}>
      {children}
    </button>
  );
};

export default Button;
