import { CreditCard, Landmark, Smartphone, Wallet } from "lucide-react";
import InfoPage, { InfoCard, InfoBox } from "../../components/InfoPage";

export const metadata = { title: "Płatności" };

const methods = [
  {
    icon: CreditCard,
    title: "Karta kredytowa / debetowa",
    desc: "Akceptujemy wszystkie główne karty, w tym Visa, MasterCard oraz American Express.",
  },
  {
    icon: Smartphone,
    title: "BLIK",
    desc: "Szybka i wygodna płatność jednym kodem z aplikacji bankowej.",
  },
  {
    icon: Wallet,
    title: "PayPal",
    desc: "Bezpieczne płatności online za pośrednictwem konta PayPal.",
  },
  {
    icon: Smartphone,
    title: "Płatności mobilne",
    desc: "Apple Pay oraz Google Pay – płać szybko telefonem.",
  },
];

export default function Page() {
  return (
    <InfoPage
      eyebrow="Płatności"
      title="Wygodne i bezpieczne płatności"
      icon={CreditCard}
      subtitle="Oferujemy różne metody płatności, abyś mógł wybrać tę najwygodniejszą. Współpracujemy z zaufanymi dostawcami usług płatniczych — każda transakcja jest szyfrowana."
    >
      <InfoCard title="Dostępne metody płatności">
        <div className="grid gap-3 sm:grid-cols-2">
          {methods.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-3 rounded-2xl border border-[#ecece9] bg-[#f7f7f5] p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4caf3d]/12 text-[#4caf3d]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0a0a0a]">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </InfoCard>

      <InfoCard title="Przelew bankowy">
        <p className="leading-relaxed text-gray-600">
          Możesz też zapłacić tradycyjnym przelewem bankowym na poniższe konto:
        </p>
        <InfoBox className="mt-4 flex items-center gap-3">
          <Landmark className="h-5 w-5 shrink-0 text-[#4caf3d]" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Konto PKO BP (PLN)</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-[#0a0a0a]">
              52 1020 1505 0000 0902 0288 1704
            </p>
          </div>
        </InfoBox>
      </InfoCard>
    </InfoPage>
  );
}
