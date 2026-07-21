import { auth } from "../../auth";
import CheckoutClientPage from "./CheckoutClientPage";

export default async function CheckoutPage() {
  const session = await auth();

  // Zakupy są możliwe zarówno zalogowanym klientom, jak i jako gość –
  // nie przekierowujemy już na wymuszone logowanie.
  return (
    <CheckoutClientPage
      sessionUser={
        session?.user
          ? {
              id: session.user.id,
              fullName: session.user.name ?? "",
              email: session.user.email ?? "",
            }
          : null
      }
    />
  );
}
