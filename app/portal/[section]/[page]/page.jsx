import { notFound } from 'next/navigation';
import Workspace from '../../../../components/workspace';
import { navigation } from '../../../../lib/workspace';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.entries(navigation).flatMap(([section, { pages }]) =>
    pages.filter(([page]) => page !== 'dashboard').map(([page]) => ({ section, page })),
  );
}

export async function generateMetadata({ params }) {
  const { section, page } = await params;
  const title = navigation[section]?.pages.find(([id]) => id === page)?.[1];
  return { title: title ? title + ' | Budgetree Engage' : 'Budgetree Engage' };
}

export default async function Page({ params }) {
  const { section, page } = await params;
  if (!navigation[section]?.pages.some(([id]) => id === page)) notFound();
  return <Workspace section={section} page={page} />;
}
