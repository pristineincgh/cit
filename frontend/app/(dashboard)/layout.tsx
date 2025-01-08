import NavBar from '@/components/dashboard/navigation/navbar';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../(auth)/_actions/auth-actions';

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="3xl:w-[1500px] 3xl:mx-auto 3xl:border">
      <NavBar />
      <main className="p-5">{children}</main>
    </div>
  );
};

export default RootLayout;
