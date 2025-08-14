"use client";

import { navBarLinks } from "@/constants/navigation";
import RecommendationsNavIndicator from "../recommendations/RecommendationsNavIndicator";
import React from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const NavBarItems = ({
  setMenuOpen,
}: {
  setMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  return (
    <div>
      {navBarLinks.map((item, index) => {
        return (
          <React.Fragment key={`nav_item_${index}`}>
            <div
              className={cn(
                "group",
                pathname?.startsWith(item.route, 0)
                  ? "*:text-tc-contrast *:bg-highlight-50"
                  : "*:text-tc-muted"
              )}
            >
              <Link
                href={item.route}
                onClick={() => setMenuOpen && setMenuOpen(false)}
                className="flex items-center rounded-md p-1 mt-1 px-4 duration-100 cursor-pointer hover:bg-highlight-50 hover:text-tc-contrast"
              >
                <i className="material-symbols-outlined md-l">{item.icon}</i>
                <span className="ml-4">{item.label}</span>

                {item.recommendations && <RecommendationsNavIndicator />}
              </Link>
            </div>
            {item.spacer && <Separator className="my-4 bg-contrast-light" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default NavBarItems;
