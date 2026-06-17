import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#FF6B6B] to-[#E85D5D] text-white shadow-md shadow-[#FF6B6B]/20 hover:from-[#E85D5D] hover:to-[#D14F4F] hover:shadow-lg hover:shadow-[#FF6B6B]/30 transition-all",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm shadow-black/5 hover:bg-destructive/90",
        outline:
          "border border-slate-200 bg-white shadow-sm shadow-black/5 hover:bg-slate-50 hover:text-slate-800",
        secondary:
          "bg-slate-100 text-slate-700 shadow-sm shadow-black/5 hover:bg-slate-200/80",
        ghost: "hover:bg-slate-50 hover:text-slate-800",
        link: "text-[#FF6B6B] underline-offset-4 hover:underline hover:text-[#E85D5D]",
      },
      size: {
        default: "h-11 px-6 rounded-xl font-bold transition-all",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base font-bold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
