import './globals.css';

export const metadata = {
  title: 'Budgetree Engage',
  description: 'Employee engagement, recognition and rewards.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
