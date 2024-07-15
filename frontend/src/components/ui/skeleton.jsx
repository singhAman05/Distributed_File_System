import { cn } from "lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-text/30", className)}
      {...props}
    />
  );
}

export { Skeleton };
