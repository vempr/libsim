import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Saved works',
		href: '/works',
	},
];

const querySchema = z.object({
	q: z.string().max(255, "Query can't be longer than 255 characters")
});
type Query = z.infer<typeof querySchema>;

export default function All() {
	const { works, query, flash } = usePage<InertiaProps>().props;
	const { register, handleSubmit, watch } = useForm<Query>({
		defaultValues: {
			q: query ?? '',
		},
	});

	const q = watch('q');
	const prevQRef = useRef<string | undefined>(q);
	useEffect(() => {
		if (prevQRef.current !== '' && q === '') {
			router.get(route('work.index'));
		}
		prevQRef.current = q;
	}, [q]);

	const onSubmit: SubmitHandler<Query> = (data) => {
		router.get(route('work.index'), data);
	}

	useEffect(() => {
		if (flash.success) toast(flash.success);
		if (flash.error) toast(flash.error);
	});

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Saved works" />

			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					placeholder="Search for title"
					{...register('q')}
				/>
				<Button type="submit">Search</Button>
			</form>

			<ul>
				{works.map(work => <li>{JSON.stringify(work)}</li>)}
			</ul>
		</AppLayout>
	);
}
