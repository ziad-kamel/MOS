import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manufacturers',
};

export default function ManufacturersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
