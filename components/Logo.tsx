import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import companyLogo from "../public/aisemble_transparent.png";
import Image from "next/image";

interface LogoProps {
  fontSize?: string;

  collapsed?: boolean;
  className?: string;
}

function Logo({
  fontSize = "text-2xl",

  collapsed = false,
  className,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "text-2xl font-extrabold flex items-center gap-2",
        fontSize,
        collapsed ? "justify-center" : "justify-start",
        className
      )}
    >
      <Image src={companyLogo} alt="AIsemble Logo" width={50} height={50} />

      {!collapsed && (
        <div className="truncate">
          <span className="text-[#e63946]">AI</span>
          <span className="bg-gradient-to-r from-[#457b9d] to-[#1d3557] bg-clip-text text-transparent">
            semble
          </span>
        </div>
      )}
    </Link>
  );
}

export default Logo;