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

export function MobileDropdown() {
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
          <DropdownMenuItem asChild>
            <Link href="/bemutatkozas" onClick={() => setOpen(false)}>
              Diákoknak
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/tanaroknak" onClick={() => setOpen(false)}>
              Tanároknak
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/jelentkezes" onClick={() => setOpen(false)}>
              Jelentkezés
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/kapcsolat" onClick={() => setOpen(false)}>
              Kapcsolat
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
