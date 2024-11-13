"use client";

import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { AddUserForm } from "./AddUserForm";
import { useState } from "react";

export function AddSeatUserButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="ml-auto rounded-md bg-zinc-700 p-2">
          <Plus height={18} />
        </button>
      </DialogTrigger>

      <DialogContent className="border-none bg-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Invite Your Team</DialogTitle>
          <DialogDescription>
            Anyone you invite will take a seat at this company.
          </DialogDescription>
        </DialogHeader>

        <AddUserForm setter={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
