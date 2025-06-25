import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-border text-primary-foreground shadow-xs hover:cursor-pointer hover:bg-primary/90",
        primary: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 disabled:bg-primary/50",
        cancel: "bg-cancel text-cancel-foreground border-1 border-cancel hover:color-cancel-foreground/50 hover:border-cancel-foreground/50 disabled:color-cancel-foreground/50",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border-2 border-primary rounded-sm text-primary shadow-xs hover:cursor-pointer hover:border-primary/75 hover:text-primary/75 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 ",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline hover:cursor-pointer, hover:text-primary/80 focus-visible:ring-0 focus-visible:underline",
        link_inline: "gap-0 !p-0 text-primary underline-offset-4 hover:underline hover:cursor-pointer, hover:text-primary/80 focus-visible:ring-0 focus-visible:underline",
        link_default: "text-default underline-offset-4 hover:text-default/50 hover:cursor-pointer focus-visible:ring-0",
        icon: "bg-transparent text-primary hover:text-primary/50",
        icon_secondary: "bg-transparent text-secondary-foreground shadow-xs hover:bg-secondary/90 hover:text-secondary-foreground"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3 text-sm",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 text-md",
        icon: "size-9",
        auto: "h-auto px-4 py-2 has-[>svg]:px-3",
        inline: "h-auto px-0 py-0 gap-0 has-[>svg]:px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = {
  asChild?: boolean;
} & React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
