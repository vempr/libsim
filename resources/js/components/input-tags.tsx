import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type InputTagsProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
	lowercase?: boolean;
	value: string; // Comma-separated string of tags
	onChange: React.ChangeEventHandler<HTMLInputElement>; // Standard form-compatible change handler
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
	({ className, value = "", lowercase, onChange, ...props }, ref) => {
		const [pendingDataPoint, setPendingDataPoint] = React.useState("");

		const tags = value
			.split(",")
			.map((tag) => lowercase ? tag.trim().toLowerCase() : tag.trim())
			.filter((tag) => tag !== "");

		React.useEffect(() => {
			if (pendingDataPoint.includes(",")) {
				const newTags = new Set([
					...tags,
					...pendingDataPoint
						.split(",")
						.map((chunk) => lowercase ? chunk.trim().toLowerCase() : chunk.trim())
						.filter(Boolean),
				]);
				const newValue = Array.from(newTags).join(",");
				onChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>);
				setPendingDataPoint("");
			}
		}, [pendingDataPoint]);

		const addPendingDataPoint = () => {
			if (pendingDataPoint.trim() !== "") {
				const newTags = lowercase ? new Set([...tags, pendingDataPoint.trim().toLowerCase()]) : new Set([...tags, pendingDataPoint.trim()]);
				const newValue = Array.from(newTags).join(",");
				onChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>);
				setPendingDataPoint("");
			}
		};

		return (
			<div
				className={cn(
					"border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm gap-2",
					"focus-visible:border-ring/50 focus-visible:ring-ring/50 focus-visible:ring-[2px]",
					"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
					className
				)}
			>
				{tags.map((item, index) => (
					<Badge key={index} variant="secondary" className="dark:bg-sidebar-accent">
						{item}
						<Button
							variant="ghost"
							size="icon"
							className="ml-2 h-3 w-3"
							onClick={() => {
								const updatedTags = tags.filter((t) => t !== item);
								const newValue = updatedTags.join(",");
								onChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>);
							}}
						>
							<XIcon className="w-3" />
						</Button>
					</Badge>
				))}
				<input
					className="flex-1 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
					value={pendingDataPoint}
					onChange={(e) => setPendingDataPoint(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
						} else {
							if (e.key === ",") {
								e.preventDefault();
								addPendingDataPoint();
							} else if (
								e.key === "Backspace" &&
								pendingDataPoint.length === 0 &&
								tags.length > 0
							) {
								e.preventDefault();
								const updatedTags = tags.slice(0, -1);
								const newValue = updatedTags.join(",");
								onChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>);
							}
						}
					}}
					{...props}
					ref={ref}
				/>
			</div>
		);
	}
);

InputTags.displayName = "InputTags";

export { InputTags };
