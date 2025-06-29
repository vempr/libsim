import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
  return (
    <>
      <AppLogoIcon />
      <div className="grid flex-1 text-left text-lg">
        <span className="font-brand mb-0.5 truncate leading-none">libsim</span>
      </div>
    </>
  );
}
