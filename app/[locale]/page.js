import { redirect } from "next/navigation";

export default async function Page({ params }) {
  //const { locale } = await params;
  let locale = "en"; // default to 'en' if locale is missing

  redirect(`/${locale}/login`);
}