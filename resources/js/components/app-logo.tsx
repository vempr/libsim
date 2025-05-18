import AppLogoIcon from "./app-logo-icon";

export default function AppLogo() {
	return (
		<>
			<AppLogoIcon />
			<div className="ml-1 grid flex-1 text-left text-lg">
				<span className="mb-0.5 truncate leading-none font-brand">libsim</span>
			</div>
		</>
	);
}
