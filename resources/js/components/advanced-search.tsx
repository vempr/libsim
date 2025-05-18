import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputTags } from '@/components/input-tags';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { languages, Publication, Reading, statusPublication, statusReading, statusReadingSchema, statusPublicationSchema } from '@/types/schemas/work';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const searchSchema = z.object({
	q: z.string().max(255, "Query can't be longer than 255 characters").optional(),
	author: z.string().max(255, "Author's name can't be longer than 255 characters").nullable().optional(),
	tags: z.string().max(1000, 'Tags cannot exceed 1000 characters').nullable().optional(),
	language_original: z.string().nullable().optional(),
	language_translated: z.string().nullable().optional(),
	status_publication: statusPublicationSchema.nullable().optional(),
	status_reading: statusReadingSchema.nullable().optional(),
	publication_year: z
		.coerce
		.number()
		.min(-5000, 'The publication year cannot be earlier than -5000')
		.max(5000, 'The publication year cannot be later than 5000')
		.optional(),
});

type Search = z.infer<typeof searchSchema>;

export function AdvancedSearchForm({ state }: {
	state: {
		q: string | null;
		author: string | null;
		tags: string | null;
		language_original: string | null;
		language_translated: string | null;
		status_publication: Publication | null;
		status_reading: Reading | null;
		publication_year: number | null;
	};
}) {

	// const [advanced, setAdvanced] = useState(false);

	const form = useForm<Search>({
		resolver: zodResolver(searchSchema),
		defaultValues: {
			q: state.q || "",
			author: state.author,
			tags: state.tags,
			language_original: state.language_original || undefined,
			language_translated: state.language_translated || undefined,
			status_publication: state.status_publication,
			status_reading: state.status_reading,
			publication_year: state.publication_year || undefined,
		},
	});

	const handleSearch = (values?: z.infer<typeof searchSchema>) => {
		router.get(route('work.index'), values);
	}

	const onSubmit = (values: z.infer<typeof searchSchema>) => {
		handleSearch(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

				<FormField
					control={form.control}
					name="q"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Search by title</FormLabel>
							<FormControl>
								<Input
									{...field}
									onChange={(e) => {
										const val = e.target.value
										if (val.length === 0) {
											field.onChange("")
											handleSearch();
										} else field.onChange(val);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)
					}
				/>

				<FormField
					control={form.control}
					name="status_publication"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Publication status</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={state.status_publication as Publication ?? undefined}>
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
							<Select onValueChange={field.onChange} defaultValue={state.status_reading as Reading ?? undefined}>
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
							<Select onValueChange={field.onChange} defaultValue={state.language_original ?? undefined}>
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
							<Select onValueChange={field.onChange} defaultValue={state.language_translated ?? undefined}>
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
									type="number"
									className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

				{/* <Button type="button" variant="secondary" onClick={() => {
						setAdvanced(!advanced);
						window.scrollTo(0, 0);
					}}
					>
						{advanced ? "Simple search" : "Advanced search"}
					</Button> */}

				<Button type="submit">Submit</Button>

				<Button type="button" variant="secondary" onClick={() => handleSearch()}>Reset query options</Button>
			</form>
		</Form>
	);
}