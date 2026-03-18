import UserHomePage from "@/components/user-home/UserHomePage";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

export default function home() {
  return <UserHomePage />;
}
