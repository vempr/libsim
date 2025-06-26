import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground aria-invalid:border-destructive dark:bg-input/20 flex field-sizing-content min-h-24 max-h-96 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] duration-75 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-secondary focus-visible:ring-secondary dark:focus-visible:border-ring/50 dark:focus-visible:ring-ring/50 focus-visible:ring-[2px] dark:focus-visible:ring-[1px]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
