import { EmptyBottomMargin } from '@/components/empty';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import WorkCard from '@/components/work';
import { useAppearance } from '@/hooks/use-appearance';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { getRelativeTime } from '@/lib/date';
import { InertiaProps, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Pie, PieChart } from 'recharts';

const readingChartConfig = {
  readingStatuses: {
    label: 'Reading Statuses',
  },
  reading: {
    label: 'Reading',
    color: 'var(--chart-1)',
  },
  completed: {
    label: 'Completed',
    color: 'var(--chart-2)',
  },
  onHold: {
    label: 'On hold',
    color: 'var(--chart-3)',
  },
  dropped: {
    label: 'Dropped',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

const publicationChartConfig = {
  readingStatuses: {
    label: 'Publication Statuses',
  },
  unknown: {
    label: 'Unknown',
    color: 'var(--chart-1)',
  },
  ongoing: {
    label: 'Ongoing',
    color: 'var(--chart-2)',
  },
  completed: {
    label: 'Completed',
    color: 'var(--chart-3)',
  },
  hiatus: {
    label: 'Hiatus',
    color: 'var(--chart-4)',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig;

const originalLanguagesChartConfig = {
  readingStatuses: {
    label: 'Original Languages',
  },
  ja: {
    label: 'Japanese',
    color: 'var(--chart-ja)',
  },
  en: {
    label: 'English',
    color: 'var(--chart-en)',
  },
  es: {
    label: 'Spanish; Castilian',
    color: 'var(--chart-es)',
  },
  fr: {
    label: 'French',
    color: 'var(--chart-fr)',
  },
  pt: {
    label: 'Portuguese',
    color: 'var(--chart-pt)',
  },
  de: {
    label: 'German',
    color: 'var(--chart-de)',
  },
  it: {
    label: 'Italian',
    color: 'var(--chart-it)',
  },
  zh: {
    label: 'Chinese',
    color: 'var(--chart-zh)',
  },
  ko: {
    label: 'Korean',
    color: 'var(--chart-ko)',
  },
  ru: {
    label: 'Russian',
    color: 'var(--chart-ru)',
  },
  th: {
    label: 'Thai',
    color: 'var(--chart-th)',
  },
  id: {
    label: 'Indonesian',
    color: 'var(--chart-id)',
  },
  vi: {
    label: 'Vietnamese',
    color: 'var(--chart-vi)',
  },
  pl: {
    label: 'Polish',
    color: 'var(--chart-pl)',
  },
  tr: {
    label: 'Turkish',
    color: 'var(--chart-tr)',
  },
} satisfies ChartConfig;

const translatedLanguagesChartConfig = {
  readingStatuses: {
    label: 'Translated Languages',
  },
  ja: {
    label: 'Japanese',
    color: 'var(--chart-ja)',
  },
  en: {
    label: 'English',
    color: 'var(--chart-en)',
  },
  es: {
    label: 'Spanish; Castilian',
    color: 'var(--chart-es)',
  },
  fr: {
    label: 'French',
    color: 'var(--chart-fr)',
  },
  pt: {
    label: 'Portuguese',
    color: 'var(--chart-pt)',
  },
  de: {
    label: 'German',
    color: 'var(--chart-de)',
  },
  it: {
    label: 'Italian',
    color: 'var(--chart-it)',
  },
  zh: {
    label: 'Chinese',
    color: 'var(--chart-zh)',
  },
  ko: {
    label: 'Korean',
    color: 'var(--chart-ko)',
  },
  ru: {
    label: 'Russian',
    color: 'var(--chart-ru)',
  },
  th: {
    label: 'Thai',
    color: 'var(--chart-th)',
  },
  id: {
    label: 'Indonesian',
    color: 'var(--chart-id)',
  },
  vi: {
    label: 'Vietnamese',
    color: 'var(--chart-vi)',
  },
  pl: {
    label: 'Polish',
    color: 'var(--chart-pl)',
  },
  tr: {
    label: 'Turkish',
    color: 'var(--chart-tr)',
  },
} satisfies ChartConfig;

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  const { auth, dashboardData } = usePage<InertiaProps & SharedData>().props;
  const { appearance } = useAppearance();
  const isMobile = useIsMobile();

  if (!dashboardData) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />
        <h2 className="font-secondary mb-2 opacity-80 lg:w-max">
          Howdy{' '}
          <Link
            href={route('u.index')}
            className="text-secondary hover:underline"
          >
            {'<'}
            {auth.user.name}
            {'>'}
          </Link>
          ! You have been using libsim for {getRelativeTime(auth.user.created_at, true)}. Create some{' '}
          <Link
            href={route('work.create')}
            className="text-secondary hover:underline"
          >
            {'<work entries>'}
          </Link>{' '}
          to view your dashboard data!
        </h2>
      </AppLayout>
    );
  }

  const sortedTags = dashboardData ? Object.entries(dashboardData.tags).sort((a, b) => b[1] - a[1]) : null;

  const readingChartData = [
    { status: 'reading', count: dashboardData.readingStatuses.reading ?? 0, fill: 'var(--chart-1)' },
    { status: 'completed', count: dashboardData.readingStatuses.completed ?? 0, fill: 'var(--chart-2)' },
    { status: 'on hold', count: dashboardData.readingStatuses.on_hold ?? 0, fill: 'var(--chart-3)' },
    { status: 'dropped', count: dashboardData.readingStatuses.dropped ?? 0, fill: 'var(--chart-4)' },
  ];
  const publicationChartData = [
    { status: 'unknown', count: dashboardData.publicationStatuses.unknown ?? 0, fill: 'var(--chart-1)' },
    { status: 'ongoing', count: dashboardData.publicationStatuses.ongoing ?? 0, fill: 'var(--chart-2)' },
    { status: 'completed', count: dashboardData.publicationStatuses.completed ?? 0, fill: 'var(--chart-3)' },
    { status: 'hiatus', count: dashboardData.publicationStatuses.hiatus ?? 0, fill: 'var(--chart-4)' },
    { status: 'cancelled', count: dashboardData.publicationStatuses.cancelled ?? 0, fill: 'var(--chart-5)' },
  ];
  const originalLanguagesChartData = [
    { code: 'ja', count: dashboardData.originalLanguages.ja ?? 0, fill: 'var(--chart-ja)' },
    { code: 'en', count: dashboardData.originalLanguages.en ?? 0, fill: 'var(--chart-en)' },
    { code: 'es', count: dashboardData.originalLanguages.es ?? 0, fill: 'var(--chart-es)' },
    { code: 'fr', count: dashboardData.originalLanguages.fr ?? 0, fill: 'var(--chart-fr)' },
    { code: 'pt', count: dashboardData.originalLanguages.pt ?? 0, fill: 'var(--chart-pt)' },
    { code: 'de', count: dashboardData.originalLanguages.de ?? 0, fill: 'var(--chart-de)' },
    { code: 'it', count: dashboardData.originalLanguages.it ?? 0, fill: 'var(--chart-it)' },
    { code: 'zh', count: dashboardData.originalLanguages.zh ?? 0, fill: 'var(--chart-zh)' },
    { code: 'ko', count: dashboardData.originalLanguages.ko ?? 0, fill: 'var(--chart-ko)' },
    { code: 'ru', count: dashboardData.originalLanguages.ru ?? 0, fill: 'var(--chart-ru)' },
    { code: 'th', count: dashboardData.originalLanguages.th ?? 0, fill: 'var(--chart-th)' },
    { code: 'id', count: dashboardData.originalLanguages.id ?? 0, fill: 'var(--chart-id)' },
    { code: 'vi', count: dashboardData.originalLanguages.vi ?? 0, fill: 'var(--chart-vi)' },
    { code: 'pl', count: dashboardData.originalLanguages.pl ?? 0, fill: 'var(--chart-pl)' },
    { code: 'tr', count: dashboardData.originalLanguages.tr ?? 0, fill: 'var(--chart-tr)' },
  ];
  const translatedLanguagesChartData = [
    { code: 'ja', count: dashboardData.translatedLanguages.ja ?? 0, fill: 'var(--chart-ja)' },
    { code: 'en', count: dashboardData.translatedLanguages.en ?? 0, fill: 'var(--chart-en)' },
    { code: 'es', count: dashboardData.translatedLanguages.es ?? 0, fill: 'var(--chart-es)' },
    { code: 'fr', count: dashboardData.translatedLanguages.fr ?? 0, fill: 'var(--chart-fr)' },
    { code: 'pt', count: dashboardData.translatedLanguages.pt ?? 0, fill: 'var(--chart-pt)' },
    { code: 'de', count: dashboardData.translatedLanguages.de ?? 0, fill: 'var(--chart-de)' },
    { code: 'it', count: dashboardData.translatedLanguages.it ?? 0, fill: 'var(--chart-it)' },
    { code: 'zh', count: dashboardData.translatedLanguages.zh ?? 0, fill: 'var(--chart-zh)' },
    { code: 'ko', count: dashboardData.translatedLanguages.ko ?? 0, fill: 'var(--chart-ko)' },
    { code: 'ru', count: dashboardData.translatedLanguages.ru ?? 0, fill: 'var(--chart-ru)' },
    { code: 'th', count: dashboardData.translatedLanguages.th ?? 0, fill: 'var(--chart-th)' },
    { code: 'id', count: dashboardData.translatedLanguages.id ?? 0, fill: 'var(--chart-id)' },
    { code: 'vi', count: dashboardData.translatedLanguages.vi ?? 0, fill: 'var(--chart-vi)' },
    { code: 'pl', count: dashboardData.translatedLanguages.pl ?? 0, fill: 'var(--chart-pl)' },
    { code: 'tr', count: dashboardData.translatedLanguages.tr ?? 0, fill: 'var(--chart-tr)' },
  ];

  const readingTotalCount = readingChartData.reduce((acc, curr) => acc + curr.count, 0);
  const publicationTotalCount = publicationChartData.reduce((acc, curr) => acc + curr.count, 0);
  const originalLanguagesTotalCount = originalLanguagesChartData.reduce((acc, curr) => acc + curr.count, 0);
  const translatedLanguagesTotalCount = translatedLanguagesChartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <h2 className="font-secondary mb-2 border-b opacity-80 lg:w-max">
        Howdy{' '}
        <Link
          href={route('u.index')}
          className="text-secondary hover:underline"
        >
          {'<'}
          {auth.user.name}
          {'>'}
        </Link>
        ! You have been using libsim for {getRelativeTime(auth.user.created_at, true)}. Thanks for creating{' '}
        <Link
          href={route('work.index')}
          className="text-secondary hover:underline"
        >{`<${dashboardData.worksCount}>`}</Link>{' '}
        entries :)
      </h2>

      <div className="flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-2">
          <h2 className="font-secondary text-xl">Your latest (updated) work entry</h2>
          <ul>
            <WorkCard
              work={dashboardData.latestWork}
              key={dashboardData.latestWork.id}
            />
          </ul>
        </div>

        <div className="flex flex-col gap-y-2">
          <h2 className="font-secondary text-xl">Some data from your works</h2>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Reading Statuses</CardTitle>
                <CardDescription>(...out of {dashboardData.worksCount} total entries)</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={readingChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={readingChartData}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={60}
                      strokeWidth={5}
                    />
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-3xl font-bold"
                      fill={appearance === 'light' ? '#000000' : '#FFFFFF'}
                    >
                      <tspan
                        x="50%"
                        dy="-0.5em"
                        className="text-white"
                      >
                        {readingTotalCount.toLocaleString()}
                      </tspan>
                      <tspan
                        x="50%"
                        dy="1.5em"
                        className="text-sm opacity-70"
                      >
                        Entries
                      </tspan>
                    </text>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Publication Statuses</CardTitle>
                <CardDescription>(...out of {dashboardData.worksCount} total entries)</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={publicationChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={publicationChartData}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={60}
                      strokeWidth={5}
                    />
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-3xl font-bold"
                      fill={appearance === 'light' ? '#000000' : '#FFFFFF'}
                    >
                      <tspan
                        x="50%"
                        dy="-0.5em"
                        className="text-white"
                      >
                        {publicationTotalCount.toLocaleString()}
                      </tspan>
                      <tspan
                        x="50%"
                        dy="1.5em"
                        className="text-sm opacity-70"
                      >
                        Entries
                      </tspan>
                    </text>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Original Languages</CardTitle>
                <CardDescription>(...out of {dashboardData.worksCount} total entries)</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={originalLanguagesChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={originalLanguagesChartData}
                      dataKey="count"
                      nameKey="code"
                      innerRadius={60}
                      strokeWidth={5}
                    />
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-3xl font-bold"
                      fill={appearance === 'light' ? '#000000' : '#FFFFFF'}
                    >
                      <tspan
                        x="50%"
                        dy="-0.5em"
                        className="text-white"
                      >
                        {originalLanguagesTotalCount.toLocaleString()}
                      </tspan>
                      <tspan
                        x="50%"
                        dy="1.5em"
                        className="text-sm opacity-70"
                      >
                        Entries
                      </tspan>
                    </text>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Translated Languages</CardTitle>
                <CardDescription>(...out of {dashboardData.worksCount} total entries)</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={translatedLanguagesChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={translatedLanguagesChartData}
                      dataKey="count"
                      nameKey="code"
                      innerRadius={60}
                      strokeWidth={5}
                    />
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-3xl font-bold"
                      fill={appearance === 'light' ? '#000000' : '#FFFFFF'}
                    >
                      <tspan
                        x="50%"
                        dy="-0.5em"
                        className="text-white"
                      >
                        {translatedLanguagesTotalCount.toLocaleString()}
                      </tspan>
                      <tspan
                        x="50%"
                        dy="1.5em"
                        className="text-sm opacity-70"
                      >
                        Entries
                      </tspan>
                    </text>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <h2 className="font-secondary text-lg">
            Your favorite{' '}
            {isMobile ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    {'<tags>'}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>A list of all of your tags</DrawerTitle>
                    <DrawerDescription>Cool looking table</DrawerDescription>
                  </DrawerHeader>

                  <div className="max-h-50 overflow-y-scroll px-3">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-secondary text-secondary w-[100px]">Name</TableHead>
                          <TableHead className="font-secondary text-secondary text-right">Appearances</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedTags?.map(([name, count]) => (
                          <TableRow
                            className="text-foreground text-xs"
                            key={`${name}${count}`}
                          >
                            <TableCell className="font-medium">{name}</TableCell>
                            <TableCell className="text-right">{count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <DrawerFooter>
                    <DrawerClose>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            ) : (
              <HoverCard>
                <HoverCardTrigger className="text-secondary hover:underline">{'<tags>'}</HoverCardTrigger>
                <HoverCardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-secondary text-secondary w-[100px]">Name</TableHead>
                        <TableHead className="font-secondary text-secondary text-right">Appearances</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedTags?.map(([name, count]) => (
                        <TableRow
                          className="text-foreground text-xs"
                          key={`${name}${count}`}
                        >
                          <TableCell className="font-medium">{name}</TableCell>
                          <TableCell className="text-right">{count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </HoverCardContent>
              </HoverCard>
            )}{' '}
            ...
          </h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-secondary text-secondary w-[100px]">Name</TableHead>
                <TableHead className="font-secondary text-secondary text-right">Appearances</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTags?.slice(0, 5).map(([name, count]) => (
                <TableRow key={`${name}${count}`}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell className="text-right">{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h2 className="font-secondary text-lg">
            ... And your fullest{' '}
            {isMobile ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    {'<collections>'}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>A list of your collections</DrawerTitle>
                    <DrawerDescription>Cool looking collection table</DrawerDescription>
                  </DrawerHeader>

                  <div className="max-h-50 overflow-y-scroll px-3">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-secondary text-secondary w-[100px]">Name</TableHead>
                          <TableHead className="font-secondary text-secondary text-right">Appearances</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(dashboardData.collectionsData)
                          .map(([id, data]) => ({
                            id,
                            ...data,
                          }))
                          .map((collection) => (
                            <TableRow
                              className="text-foreground text-xs"
                              key={collection.id}
                            >
                              <Link href={route('collection.view', { collection: collection.id })}>
                                <TableCell className="font-medium hover:underline">{collection.name}</TableCell>
                              </Link>
                              <TableCell className="text-right">{collection.count}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  <DrawerFooter>
                    <DrawerClose>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            ) : (
              <HoverCard>
                <HoverCardTrigger className="text-secondary hover:underline">{'<collections>'}</HoverCardTrigger>
                <HoverCardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-secondary text-secondary w-[100px]">Name</TableHead>
                        <TableHead className="font-secondary text-secondary text-right">Appearances</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(dashboardData.collectionsData)
                        .map(([id, data]) => ({
                          id,
                          ...data,
                        }))
                        .map((collection) => (
                          <TableRow
                            className="text-foreground text-xs"
                            key={collection.id}
                          >
                            <Link href={route('collection.view', { collection: collection.id })}>
                              <TableCell className="font-medium hover:underline">{collection.name}</TableCell>
                            </Link>
                            <TableCell className="text-right">{collection.count}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </HoverCardContent>
              </HoverCard>
            )}
            .
          </h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-secondary text-secondary w-[100px]">Name</TableHead>
                <TableHead className="font-secondary text-secondary text-right">Appearances</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(dashboardData.collectionsData)
                .slice(0, 5)
                .map(([id, data]) => ({
                  id,
                  ...data,
                }))
                .map((collection) => (
                  <TableRow
                    className="text-foreground"
                    key={collection.id}
                  >
                    <Link href={route('collection.view', { collection: collection.id })}>
                      <TableCell className="font-medium hover:underline">{collection.name}</TableCell>
                    </Link>
                    <TableCell className="text-right">{collection.count}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <EmptyBottomMargin />
    </AppLayout>
  );
}
