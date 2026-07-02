import { cn } from "../utils/cn";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  routeKey?: string;
}

export function PageTransition({ children, className, routeKey }: PageTransitionProps) {
  return (
    <div
      key={routeKey}
      className={cn("animate-fade-in-up", className)}
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
}
