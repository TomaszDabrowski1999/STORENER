import { auth } from "../../auth";
import { redirect } from "next/navigation";
import CheckoutClientPage from "./CheckoutClientPage";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/logowanie");
  }

  return (
    <CheckoutClientPage
      sessionUser={{
        id: session.user.id,
        fullName: session.user.name ?? "",
        email: session.user.email ?? "",
      }}
    />
  );
}