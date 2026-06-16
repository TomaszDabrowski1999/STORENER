import { Undo2 } from "lucide-react";
import InfoPage, { InfoCard, Steps } from "../../components/InfoPage";

export const metadata = { title: "Zwroty i wymiany" };

export default function Page() {
  return (
    <InfoPage
      eyebrow="Zakupy bez obaw"
      title="Zwroty i wymiany"
      icon={Undo2}
      subtitle="Przejrzyste zasady zwrotów to spokój podczas zakupów. Poniżej wyjaśniamy, jak krok po kroku zwrócić produkt."
    >
      <InfoCard title="Jak zwrócić produkt?">
        <Steps
          items={[
            "Skontaktuj się z obsługą klienta i podaj numer zamówienia.",
            "Spakuj produkt oraz dołącz informację o zwrocie.",
            "Wyślij paczkę na adres podany przez obsługę sklepu.",
            "Po przyjęciu zwrotu środki zostaną zwrócone zgodnie z metodą płatności.",
          ]}
        />
      </InfoCard>

      <InfoCard className="bg-[#0a0a0a] text-white">
        <p className="text-sm leading-relaxed text-white/70">
          Potrzebujesz pomocy ze zwrotem? Napisz na{" "}
          <a href="mailto:storener@interia.pl" className="font-medium text-[#4caf3d] hover:underline">
            storener@interia.pl
          </a>{" "}
          lub zadzwoń pod{" "}
          <a href="tel:+48661377044" className="font-medium text-[#4caf3d] hover:underline">
            +48 661 377 044
          </a>
          .
        </p>
      </InfoCard>
    </InfoPage>
  );
}
