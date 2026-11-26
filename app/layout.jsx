import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import '@fontsource/poppins/latin-800.css';
import './globals.css';

export const metadata = {
  title: 'Budgetree Engage',
  description: 'Employee engagement, recognition and rewards.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
