export default function AppLogo() {
	return (
		<>
			<div className="flex aspect-square size-8 items-center justify-center rounded-md">
				<img src='/logo.jpg' className="size-8 rounded-sm" />
			</div>
			<div className="ml-1 grid flex-1 text-left text-sm">
				<span className="mb-0.5 truncate leading-none font-semibold">libsim</span>
			</div>
		</>
	);
}
