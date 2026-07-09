import { redirect } from "next/navigation";

// Stara wersja tej strony czytała zamówienia z localStorage i pokazywała
// nieaktualne dane. Właściwa lista zamówień to /moje-zamowienia.
export default function OrdersRedirectPage() {
  redirect("/moje-zamowienia");
}
