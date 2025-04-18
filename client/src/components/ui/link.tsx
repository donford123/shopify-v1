import * as React from "react";
import { Link as WouterLink } from "wouter";
import { cn } from "@/lib/utils";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  external?: boolean;
  children?: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, className, children, external = false, ...props }, ref) => {
    // If it's an external URL or starts with #, or other special links
    if (external || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a
          href={href}
          className={cn("underline-offset-4 hover:underline", className)}
          ref={ref}
          rel={external ? "noopener noreferrer" : undefined}
          target={external ? "_blank" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    }

    // Else, it's an internal link
    return (
      <WouterLink href={href}>
        <a className={cn("underline-offset-4 hover:underline", className)} ref={ref} {...props}>
          {children}
        </a>
      </WouterLink>
    );
  }
);

Link.displayName = "Link";