import React from "react";
import { Terminal } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "text-sm",
  md: "text-xl",
  lg: "text-2xl",
};

const iconSizeMap = {
  sm: "size-6",
  md: "size-8",
  lg: "size-12",
};

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showIcon = true,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showIcon && (
        <div
          className={`${iconSizeMap[size]} bg-primary rounded-lg flex items-center justify-center text-white`}
        >
          <Terminal className={size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-5 h-5" : "w-7 h-7"} />
        </div>
      )}
      <h1
        className={`${sizeMap[size]} font-bold tracking-tight uppercase text-foreground`}
      >
        COLLABCODE<span className="text-primary">.</span>
      </h1>
    </div>
  );
};
