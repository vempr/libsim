import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { languages, statusPublication, statusReading, workSchema } from '@/types/schemas/work';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputTags } from '@/components/input-tags';

const sp = z.enum(statusPublication);
const sr = z.enum(statusReading);
type Publication = z.infer<typeof sp>;
type Reading = z.infer<typeof sr>;

export default function New() {
	const { work } = usePage<InertiaProps>().props;
	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Saved works',
			href: '/works',
		},
		{
			title: work.title,
			href: `/works/${work.id}`,
		},
		{
			title: 'Edit entry',
			href: `/works/${work.id}/edit`,
		},
	];

	const form = useForm<z.infer<typeof workSchema>>({
		resolver: zodResolver(workSchema),
		defaultValues: {
			title: work.title,
			description: work.description || undefined,
			status_publication: work.status_publication as Publication || undefined,
			status_reading: work.status_reading as Reading,
			author: work.author || undefined,
			language_original: work.language_original || undefined,
			language_translated: work.language_translated || undefined,
			publication_year: work.publication_year || undefined,
			image: work.image || undefined,
			tags: work.tags || undefined,
		},
	});

	function onSubmit(values: z.infer<typeof workSchema>) {
		router.put(route('work.update', work.id), values);
	}

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`Edit: ${work.title}`} />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea {...field} {...form.register("description", {
										required: false,
									})} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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
									<Input {...field} {...form.register("author", {
										required: false,
									})} />
								</FormControl>
								<FormDescription>Use "&&" as separator for multiple names, optional, up to 255 characters.</FormDescription>
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
											const val = e.target.value;
											if (val.length === 0) {
												field.onChange(undefined);
											} else if (Number(val)) {
												field.onChange(Number(val));
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
						name="image"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Image (URL)</FormLabel>
								<FormControl>
									<Input {...field} {...form.register("image", {
										required: false,
									})} />
								</FormControl>
								<FormDescription>URL for the cover image of the work, optional, up to 255 characters</FormDescription>
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
										value={field.value}
										{...form.register("tags", {
											required: false,
										})}
									/>
								</FormControl>
								<FormDescription>Enter tags separated by commas/enter e.g. "romance,comedy, isekai", optional, up to 1000 characters</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</AppLayout>
	);
}