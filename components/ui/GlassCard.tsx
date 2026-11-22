import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: "blue" | "cyan" | "purple" | "none";
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = "none",
  interactive = false,
  ...props
}) => {
  const glowStyles = {
    none: "",
    blue: "hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    cyan: "hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]",
    purple: "hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300",
        interactive && "cursor-pointer hover:-translate-y-1 hover:bg-white/[0.07]",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
