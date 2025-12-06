"use client"

import * as React from "react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import type { NavItem } from "@/lib/cms"

interface MobileDropdownProps {
  navItems: NavItem[]
}

export function MobileDropdown({ navItems }: MobileDropdownProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="md:hidden relative">
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-white p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className="bg-[#0a2540] text-white w-48 rounded-md shadow-lg mt-2"
        >
          {navItems.map(item => (
            <DropdownMenuItem key={item.id} asChild>
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
