export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return (
    <div lang={locale} className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}