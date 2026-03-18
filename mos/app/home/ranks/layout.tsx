import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ranks',
};

export default function RanksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
