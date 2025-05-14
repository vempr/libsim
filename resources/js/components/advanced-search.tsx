import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputTags } from '@/components/input-tags';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { languages, Publication, Reading, statusPublication, statusReading } from '@/types/schemas/work';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { router } from '@inertiajs/react';

const searchSchema = z.object({
	author: z.string().max(255, "Author's name can't be longer than 255 characters").optional(),
	tags: z.string().max(1000, 'Tags cannot exceed 1000 characters').optional(),
	language_original: z.string().optional(),
	language_translated: z.string().optional(),
	status_publication: z.string().optional(),
	status_reading: z.string().optional(),
	publication_year: z
		.number()
		.min(-5000, 'The publication year cannot be earlier than -5000')
		.max(5000, 'The publication year cannot be later than 5000')
		.optional(),
});

type Search = z.infer<typeof searchSchema>;

export function AdvancedSearchForm() {
	const form = useForm<Search>({
		resolver: zodResolver(searchSchema),
	});

	const onSubmit = (values: z.infer<typeof searchSchema>) => {
		router.get(route('work.search'), values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="status_publication"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Publication status</FormLabel>
							<Select onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select publication status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{statusPublication.map((s: Publication) => (
										<SelectItem key={s} value={s}>
											{s.charAt(0).toUpperCase() + s.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="status_reading"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Reading status</FormLabel>
							<Select onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select reading status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{statusReading.map((s: Reading) => (
										<SelectItem key={s} value={s}>
											{s.charAt(0).toUpperCase() + s.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>


				<FormField
					control={form.control}
					name="author"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Author</FormLabel>
							<FormControl>
								<InputTags
									value={field.value ?? ""}
									onChange={(e) => field.onChange(e.target.value)}
								/>
							</FormControl>
							<FormDescription>Use commas as separator for multiple names, optional, up to 255 characters.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="language_original"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Original Language</FormLabel>
							<Select onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select original language" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.entries(languages).map(([code, name]) => (
										<SelectItem key={code} value={code}>
											{name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>


				<FormField
					control={form.control}
					name="language_translated"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Translated Language</FormLabel>
							<Select onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select translated language" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.entries(languages).map(([code, name]) => (
										<SelectItem key={code} value={code}>
											{name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>


				<FormField
					control={form.control}
					name="publication_year"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Publication Year</FormLabel>
							<FormControl>
								<Input
									{...field}
									onChange={(e) => {
										const val = Number(e.target.value);
										if (isNaN(val)) {
											field.onChange(0);
										} else {
											field.onChange(val);
										}
									}}
								/>
							</FormControl>
							<FormDescription>Optional, between -5000 and 5000</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tags</FormLabel>
							<FormControl>
								<InputTags
									lowercase
									value={field.value ?? ""}
									onChange={(e) => field.onChange(e.target.value)}
								/>
							</FormControl>
							<FormDescription>Enter tags separated by commas e.g. "romance,comedy, isekai", optional, up to 1000 characters</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}