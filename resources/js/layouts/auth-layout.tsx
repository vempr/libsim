import AuthCardLayout from '@/layouts/auth/auth-card-layout';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <AuthCardLayout
      title={title}
      description={description}
      {...props}
    >
      {children}
    </AuthCardLayout>
  );
}
