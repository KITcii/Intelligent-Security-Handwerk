import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const NoUserAccount = ({ className }: { className?: string }) => {
  return (
    <div className={cn("space-y-8", className)}>
      <Separator />
      <div className="text-center">
        <h2 className="mb-8">Sie haben noch keinen Benutzerkonto?</h2>
        <Button
          type="submit"
          variant="outline"
          className="button-outline text-base w-full"
          asChild
        >
          <Link href="/auth/register">Benutzerkonto erstellen</Link>
        </Button>
      </div>
    </div>
  );
};

export default NoUserAccount;
