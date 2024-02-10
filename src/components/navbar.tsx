"use client";

import { usePathname, useRouter } from "next/navigation";
import { DropdownMenu } from "./dropdown-menu";
import { Button } from "./ui/button";
import { ChevronsUpDown, Gamepad, Gamepad2 } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const games = [
    {
      name: "Tic Tac Toe",
      href: "/tic-tac-toe",
    },
    {
      name: "Country Capital",
      href: "/country-capital",
    },
    {
      name: "Hangman",
      href: "/hangman",
    },
    {
      name: "Todo List",
      href: "/todos",
    },
  ];

  const menuTrigger = (
    <Button variant="outline" className="ring-1 capitalize ring-primary">
      {games.find((game) => game.href === pathname)?.name}
      <ChevronsUpDown className="h-4 w-4 ml-3" />
    </Button>
  );
  return (
    <div className="h-[70px] bg-background flex items-center justify-between px-6 border">
      <h3 className="font-bold text-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 text-transparent bg-clip-text">
        Mini Games Online
      </h3>
      <DropdownMenu
        trigger={menuTrigger}
        items={games.map((game) => ({
          label: game.name,
          icon: Gamepad2,
          onClick: () => router.push(game.href),
        }))}
      />
    </div>
  );
};
