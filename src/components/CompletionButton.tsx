import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { COMPLETION_BUTTON_VARIANTS } from "../utils/completionButtonVariants";

interface CompletionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children?: ReactNode;
}

export const CompletionButton = ({
  variant = "secondary",
  children,
  className,
  ...props
}: CompletionButtonProps) => (
  <button type="button" {...props} className={clsx(COMPLETION_BUTTON_VARIANTS[variant], className)}>
    {children}
  </button>
);
