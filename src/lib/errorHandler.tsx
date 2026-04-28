"use client";

import React from "react";
import { toast } from "sonner";

export function showErrorToast(error: unknown, friendlyMessage: string) {
  const message = error instanceof Error ? error.message : String(error);
  
  toast.error(
    <div className="flex flex-col gap-2">
      <span>{friendlyMessage}</span>
      <span className="text-xs text-red-400 font-mono">{message}</span>
    </div>
  );
}