import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'productss | Task Manager',
  description: 'Manage your productss',
};

export default function productsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
