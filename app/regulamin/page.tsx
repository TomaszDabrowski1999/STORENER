import { FileText } from "lucide-react";
import InfoPage, { InfoCard } from "../../components/InfoPage";

export const metadata = { title: "Regulamin" };

/* ─────────────────────────────────────────────────────────────
   Pełna treść Regulaminu Sklepu Internetowego www.storener.pl.
   Treść jest zdefiniowana jako dane (sekcje + punkty), a poniżej
   renderowana w spójnym układzie InfoPage. Edycja regulaminu =
   edycja tablicy SECTIONS.
   ───────────────────────────────────────────────────────────── */

type SectionItem = string | { text: string; sub: string[] };

type Section = {
  title: string;
  intro?: string;
  items: SectionItem[];
};

const SECTIONS: Section[] = [
  {
    title: "I. Postanowienia ogólne",
    items: [
      "Niniejszy Regulamin określa ogólne warunki, sposób świadczenia Usług drogą elektroniczną i sprzedaży prowadzonej za pośrednictwem Sklepu Internetowego www.storener.pl. Sklep prowadzi Natalia Dąbrowska z siedzibą w Gałęzewku, pod adresem Gałęzewko 14, 88-420 Rogowo, NIP 5621765581, REGON 540792425, zwana dalej Sprzedawcą.",
      {
        text: "Kontakt ze Sprzedawcą odbywa się poprzez:",
        sub: [
          "adres poczty elektronicznej: storener@interia.pl;",
          "pod numerem telefonu: +48 661 377 044;",
          "formularz kontaktowy dostępny na stronach Sklepu Internetowego.",
        ],
      },
      "Niniejszy Regulamin jest nieprzerwanie dostępny w witrynie internetowej www.storener.pl, w sposób umożliwiający jego pozyskanie, odtwarzanie i utrwalanie jego treści poprzez wydrukowanie lub zapisanie na nośniku w każdej chwili.",
      "Sprzedawca informuje, że korzystanie z Usług świadczonych drogą elektroniczną może wiązać się z zagrożeniem po stronie każdego użytkownika sieci Internet, polegającym na możliwości wprowadzenia do systemu teleinformatycznego Klienta szkodliwego oprogramowania oraz pozyskania i modyfikacji jego danych przez osoby nieuprawnione. By uniknąć ryzyka wystąpienia zagrożeń w/w Klient powinien stosować właściwe środki techniczne, które zminimalizują ich wystąpienie, a w szczególności programy antywirusowe i zaporę sieciową typu firewall.",
      "Sprzedawca wyznaczył pojedynczy punkt kontaktowy służący do kontaktu z Klientami, z organami państw członkowskich Unii Europejskiej, Komisją Unii Europejskiej i Radą Usług Cyfrowych, o której mowa w Rozporządzeniu DSA. Komunikacja w punkcie odbywa się pod adresem e-mail wskazanym w ppkt. 2 powyżej, w języku polskim i angielskim.",
    ],
  },
  {
    title: "II. Definicje",
    intro: "Użyte w Regulaminie pojęcia oznaczają:",
    items: [
      "Dni robocze – są to dni od poniedziałku do piątku z wyłączeniem dni ustawowo wolnych od pracy;",
      "Klient – Konsument, Przedsiębiorca oraz Przedsiębiorca na prawach konsumenta, który dokonuje Zamówienia w ramach Sklepu Internetowego lub korzysta z innych Usług dostępnych w Sklepie Internetowym;",
      "Kodeks Cywilny – ustawa z dnia 23 kwietnia 1964 r. (Dz. U. Nr 16, poz. 93 ze zm.);",
      "Konto – przydzielona danemu Klientowi część Sklepu Internetowego, za pomocą której Klient może dokonywać określonych działań w ramach Sklepu Internetowego;",
      "Konsument – Klient będący konsumentem w rozumieniu art. 22[1] Kodeksu cywilnego;",
      "Przedsiębiorca – Klient będący przedsiębiorcą w rozumieniu art. 43[1] Kodeksu cywilnego;",
      "Przedsiębiorca na prawach konsumenta – osoba fizyczna prowadząca jednoosobową działalność gospodarczą, będąca przedsiębiorcą w rozumieniu art. 43[1] Kodeksu cywilnego, dla której Umowa świadczenia Usług drogą elektroniczną lub sprzedaży jest bezpośrednio związana z jej działalnością gospodarczą, ale nie ma charakteru zawodowego, wynikającego w szczególności z przedmiotu wykonywanej przez nie działalności gospodarczej, udostępnionego na podstawie przepisów o Centralnej Ewidencji i Informacji o Działalności Gospodarczej;",
      "Kontent – publicznie udostępniane przez Sprzedawcę treści dodawane przez Klientów za pośrednictwem funkcjonalności Sklepu internetowego;",
      "Przewoźnik – podmiot lub osoba dostarczająca zamówione przez Klienta Towary;",
      "Regulamin – niniejszy dokument;",
      "Rozporządzenie DSA – Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2022/2065 z dnia 19 października 2022 r. w sprawie jednolitego rynku usług cyfrowych oraz zmiany dyrektywy 2000/31/WE (akt o usługach cyfrowych);",
      "Towar – produkt prezentowany w Sklepie Internetowym, którego opis jest dostępny przy każdym z prezentowanych produktów;",
      "Umowa sprzedaży – Umowa sprzedaży Towarów w rozumieniu Kodeksu Cywilnego, zawarta pomiędzy Sprzedawcą a Klientem;",
      "Usługi – usługi świadczone przez Sprzedawcę na rzecz Klientów drogą elektroniczną w rozumieniu przepisów ustawy z dnia 18 lipca 2002 roku o świadczeniu usług drogą elektroniczną (Dz.U. nr 144, poz. 1204 ze zm.);",
      "Ustawa o prawach konsumenta – ustawa z dnia 30 maja 2014 r. o prawach konsumenta (Dz. U. 2014, Nr 827);",
      "Ustawa o świadczeniu usług drogą elektroniczną – ustawa z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną (Dz. U. Nr 144, poz. 1204 ze zm.);",
      "Zamówienie – oświadczenie woli Klienta, zmierzające bezpośrednio do zawarcia Umowy sprzedaży, określające w szczególności rodzaj i liczbę Towaru.",
    ],
  },
  {
    title: "III. Zasady korzystania ze Sklepu Internetowego",
    items: [
      {
        text: "Korzystanie ze Sklepu Internetowego jest możliwe pod warunkiem spełnienia przez system teleinformatyczny, z którego korzysta Klient, następujących minimalnych wymagań technicznych:",
        sub: [
          "komputer lub urządzenie mobilne z dostępem do Internetu,",
          "dostęp do poczty elektronicznej,",
          "przeglądarka internetowa Microsoft Edge w wersji 42.x lub nowszej, Firefox w wersji 48.0 lub nowszej, Chrome w wersji 50 lub nowszej, Opera w wersji 50 lub nowszej, Safari w wersji 10.x lub nowszej,",
          "włączenie w przeglądarce internetowej Cookies oraz Javascript.",
        ],
      },
      "Korzystanie ze Sklepu Internetowego oznacza każdą czynność Klienta, która prowadzi do zapoznania się przez niego z treściami zawartymi w Sklepie.",
      {
        text: "Klient zobowiązany jest w szczególności do:",
        sub: [
          "niedostarczania i nieprzekazywania treści zabronionych przez przepisy prawa, np. treści propagujących przemoc, zniesławiających lub naruszających dobra osobiste, prawa autorskie i inne prawa osób trzecich,",
          "korzystania ze Sklepu Internetowego w sposób nie zakłócający jego funkcjonowania, w szczególności poprzez użycie określonego oprogramowania lub urządzeń,",
          "niepodejmowania działań takich jak: rozsyłanie lub umieszczanie w ramach Sklepu Internetowego niezamówionej informacji handlowej (spam),",
          "korzystania ze Sklepu Internetowego w sposób nieuciążliwy dla innych Klientów oraz dla Sprzedawcy,",
          "korzystania z wszelkich treści zamieszczonych w ramach Sklepu Internetowego jedynie w zakresie własnego użytku osobistego,",
          "korzystania ze Sklepu Internetowego w sposób zgodny z przepisami obowiązującego na terytorium Rzeczypospolitej Polskiej prawa, postanowieniami Regulaminu, a także z ogólnymi zasadami korzystania z sieci Internet.",
        ],
      },
      "Sprzedawca może dobrowolnie podejmować czynności sprawdzające Kontent dodany przez Klientów, w szczególności pod kątem zgodności z ppkt. 3 powyżej.",
      "Sprzedawca, podejmując czynności sprawdzające nie stosuje algorytmicznego podejmowania decyzji. Wszelkie decyzje podejmowane przez Sprzedawcę dot. Kontentu wynikają z przeglądu dokonanego przez człowieka.",
      "Sprzedawca umożliwia Klientom zgłaszanie Kontentu (dalej jako: „Zgłoszenie”), który narusza w szczególności ppkt. 3 powyżej, w tym w szczególności treści naruszające przepisy prawa polskiego i prawa Unii Europejskiej.",
      "Klient może dokonać Zgłoszenia za pośrednictwem formularza kontaktowego dostępnego na stronach Sklepu Internetowego lub za pośrednictwem poczty elektronicznej pod adresem storener@interia.pl.",
      "Jeżeli Zgłoszenie zawiera elektroniczne dane kontaktowe Klienta, który dokonał Zgłoszenia, Sprzedawca, bez zbędnej zwłoki, przesyła Klientowi potwierdzenie otrzymania zgłoszenia.",
      "Sprzedawca, po dokonaniu czynności sprawdzających, o których mowa w ppkt. 4 powyżej lub po otrzymaniu Zgłoszenia od Klienta, w terminie 14 dni od dnia otrzymania Zgłoszenia, podejmuje decyzję dot. zgłoszonego Kontentu.",
      {
        text: "Decyzja, o której mowa w ppkt. 9 powyżej (dalej jako „Decyzja”), może polegać na:",
        sub: [
          "ograniczeniu widoczności lub usunięciu Kontentu, którego dotyczyło Zgłoszenie;",
          "zawieszeniu lub zamknięciu Konta Klienta, który dodał Kontent, którego dotyczyło Zgłoszenie.",
        ],
      },
      "Sprzedawca podejmuje Decyzję w sposób terminowy, obiektywny i z zachowaniem należytej staranności.",
      "Sprzedawca bez zbędnej zwłoki informuje Klienta, który dokonał Zgłoszenia, o podjętej przez Sprzedawcę Decyzji.",
      "Sprzedawca, jeśli dysponuje elektronicznymi danymi kontaktowymi Klienta, informuje Klienta, który dodał zgłoszony Kontent, o podjętej Decyzji, a także przedstawia jej uzasadnienie.",
      "Klient, który dodał zgłoszony Kontent, może złożyć odwołanie od Decyzji Sprzedawcy w terminie 14 dni od dnia otrzymania powiadomienia o Decyzji Sprzedawcy.",
      "Odwołanie może zostać złożone Sprzedawcy za pośrednictwem poczty elektronicznej pod adresem storener@interia.pl i powinno zawierać imię, nazwisko oraz adres e-mail Klienta, który dodał zgłoszony Kontent wraz z wyczerpującym uzasadnieniem.",
      "Sprzedawca rozpatruje odwołanie, o którym mowa w ppkt. 14 powyżej w terminie 14 dni od dnia otrzymania.",
    ],
  },
  {
    title: "IV. Usługi",
    items: [
      "Sprzedawca umożliwia za pośrednictwem Sklepu Internetowego korzystanie z bezpłatnych Usług, które są świadczone przez Sprzedawcę 24 godziny na dobę, 7 dni w tygodniu.",
      "Usługa prowadzenia Konta w Sklepie Internetowym dostępna jest po dokonaniu rejestracji. Rejestracja następuje poprzez wypełnienie i zaakceptowanie formularza rejestracyjnego, udostępnianego na jednej ze stron Sklepu Internetowego. Umowa o świadczenie Usługi polegającej na prowadzeniu Konta w Sklepie Internetowym zawierana jest na czas nieoznaczony i ulega rozwiązaniu z chwilą przesłania przez Klienta żądania usunięcia Konta lub skorzystania z przycisku „Usuń Konto”.",
      "Klient ma możliwość wysyłania za pomocą formularza kontaktowego wiadomości do Sprzedawcy. Umowa o świadczenie Usługi polegającej na udostępnianiu interaktywnego formularza umożliwiającego Klientom kontakt ze Sprzedawcą jest zawierana na czas oznaczony i ulega rozwiązaniu z chwilą wysłania wiadomości przez Klienta.",
      "Klient ma możliwość zamieszczania w Sklepie Internetowym indywidualnych i subiektywnych wypowiedzi odnoszących się m.in. do Towaru czy przebiegu transakcji. Klient dodając wypowiedzi oświadcza, że posiada wszelkie prawa do tych treści, a w szczególności autorskie prawa majątkowe, prawa pokrewne oraz prawa własności przemysłowej. Umowa o świadczenie usługi polegającej na zamieszczaniu opinii o Towarach w Sklepie Internetowym zawierana jest na czas oznaczony i ulega rozwiązaniu z chwilą dodania opinii.",
      "Wypowiedzi powinny być zredagowane w sposób przejrzysty i zrozumiały, nadto nie mogą naruszać obowiązujących przepisów prawa, w tym praw podmiotów trzecich – w szczególności nie mogą mieć charakteru zniesławiającego, naruszać dóbr osobistych lub stanowić czynu nieuczciwej konkurencji. Zamieszczone wypowiedzi są rozpowszechniane na stronach internetowych Sklepu Internetowego.",
      "Poprzez zamieszczenie wypowiedzi Klient wyraża zgodę na nieodpłatne korzystanie z tej wypowiedzi oraz jej publikowanie przez Sprzedawcę, a także dokonywanie opracowań utworów w rozumieniu ustawy o prawie autorskim i prawach pokrewnych (Dz. U. 1994 nr 24 poz. 83).",
      "Klient ma możliwość dodawania Towarów do listy ulubionych. Umowa o świadczenie Usługi polegającej na dodaniu Towarów do listy ulubionych jest zawierana na czas oznaczony i ulega rozwiązaniu z chwilą usunięcia Towarów z listy bądź zakończenia sesji przeglądarki przez Klienta.",
      "Klient ma możliwość porównania Towarów za pomocą Usługi Dodaj do porównania. Umowa o świadczenie Usługi polegającej na porównaniu Towarów zawierana jest na czas oznaczony i ulega rozwiązaniu z chwilą usunięcia Towarów z listy porównywanych bądź zakończenia sesji przeglądarki przez Klienta.",
      "Klient ma możliwość wysyłania wiadomości do Sprzedawcy za pomocą formularza „Zapytaj o produkt” dostępnego na karcie każdego Towaru. Umowa o świadczenie Usługi polegającej na udostępnianiu interaktywnego formularza „Zapytaj o produkt” umożliwiającego Klientom kontakt ze Sprzedawcą w sprawie Towarów jest zawierana na czas oznaczony i ulega rozwiązaniu z chwilą wysłania wiadomości przez Klienta.",
      "W przypadku Towarów, które nie są dostępne w magazynie Sprzedawcy, Klient ma możliwość otrzymania powiadomienia, gdy Towar będzie już dostępny, za pośrednictwem Usługi „Powiadom o dostępności”. Świadczenie Usługi jest możliwe poprzez wskazanie adresu e-mail, na który wysyłane ma zostać powiadomienie. Umowa o świadczenie Usługi polegającej na zaznaczeniu opcji powiadomienia o dostępności Towaru jest zawierana na czas oznaczony i ulega rozwiązaniu z chwilą kliknięcia przycisku „Powiadom o dostępności”.",
      "Sprzedawca ma prawo do organizowania okazjonalnych konkursów i promocji, których warunki każdorazowo zostaną podane na stronach internetowych Sklepu. Promocje w Sklepie Internetowym nie podlegają łączeniu, o ile Regulamin danej promocji nie stanowi inaczej.",
      "W przypadku naruszenia przez Klienta postanowień niniejszego Regulaminu, Sprzedawca po uprzednim bezskutecznym wezwaniu do zaprzestania lub usunięcia naruszeń, z wyznaczeniem stosownego terminu, może rozwiązać umowę o świadczenie Usług z zachowaniem 14-dniowego terminu wypowiedzenia.",
    ],
  },
  {
    title: "V. Procedura zawarcia Umowy sprzedaży",
    items: [
      "Informacje o Towarach podane na stronach internetowych Sklepu, w szczególności ich opisy, parametry techniczne i użytkowe oraz ceny, stanowią zaproszenie do zawarcia Umowy, w rozumieniu art. 71 Kodeksu Cywilnego.",
      "Wszystkie Towary dostępne w Sklepie Internetowym są fabrycznie nowe, zgodne z Umową i zostały legalnie wprowadzone na rynek polski.",
      "W przypadku, gdy Sprzedawca stosuje mechanizmy indywidualnego dostosowania cen na podstawie zautomatyzowanego podejmowania decyzji, każdorazowo przekazuje tę informację Konsumentowi podczas składania Zamówienia, z uwzględnieniem wymogów, jakie nakładają w tym zakresie przepisy dotyczące ochrony danych osobowych.",
      "Czynności zmierzające do zawarcia Umowy pomiędzy Sprzedawcą a Przedsiębiorcą, a w szczególności złożenie Zamówienia, mogą dokonywać jedynie osoby należycie umocowane do działania w imieniu Przedsiębiorcy. Przyjmuje się, że osoba składająca Zamówienie jest osobą upoważnioną przez Przedsiębiorcę do tych czynności.",
      "Warunkiem złożenia Zamówienia jest posiadanie aktywnego konta poczty elektronicznej, jak również Konta w Sklepie i zalogowanie się do niego.",
      "W przypadku składania Zamówienia poprzez formularz Zamówienia dostępny na stronie internetowej Sklepu Internetowego, Zamówienie zostaje złożone Sprzedawcy przez Klienta w formie elektronicznej i stanowi ofertę zawarcia Umowy sprzedaży Towarów będących przedmiotem Zamówienia. Oferta złożona w postaci elektronicznej wiąże Klienta, jeżeli na podany przez Klienta adres poczty elektronicznej Sprzedawca prześle potwierdzenie przyjęcia do realizacji Zamówienia, które stanowi oświadczenie Sprzedawcy o przyjęciu oferty Klienta i z chwilą jej otrzymania przez Klienta zawarta zostaje Umowa sprzedaży.",
      {
        text: "Złożenie Zamówienia w Sklepie Internetowym za pośrednictwem telefonu, poprzez przesłanie wiadomości elektronicznej lub poprzez przesłanie wiadomości za pośrednictwem formularza kontaktowego następuje w Dniach roboczych oraz godzinach wskazanych na stronie internetowej Sklepu Internetowego. W tym celu Klient powinien:",
        sub: [
          "podać podczas rozmowy telefonicznej, w treści wiadomości elektronicznej lub w treści wiadomości wysłanej za pośrednictwem formularza kontaktowego, kierowanej do Sprzedawcy, nazwę Towaru spośród Towarów znajdujących się na stronie internetowej Sklepu i jego ilość,",
          "wskazać sposób dostawy i formę płatności spośród sposobów dostawy i płatności podanych na stronie internetowej Sklepu,",
          "podać dane potrzebne do realizacji Zamówienia, a w szczególności: imię i nazwisko, miejsce zamieszkania oraz adres e-mail.",
        ],
      },
      "Informacja na temat całkowitej wartości Zamówienia, o którym mowa w pkt. powyżej, podawana jest każdorazowo przez Sprzedawcę ustnie po skompletowaniu całości Zamówienia lub poprzez poinformowanie w drodze wiadomości elektronicznej wraz z informacją, że zawarcie przez Klienta Umowy sprzedaży pociąga za sobą obowiązek zapłaty za zamówiony Towar; z tą chwilą zostaje zawarta Umowa sprzedaży.",
      "W przypadku Klienta będącego Konsumentem, Sprzedawca każdorazowo po złożeniu Zamówienia za pośrednictwem telefonu, poczty elektronicznej lub formularza kontaktowego przesyła Klientowi potwierdzenie warunków złożonego Zamówienia.",
      "Umowa zostaje zawarta z chwilą przesłania przez Klienta będącego Konsumentem (w odpowiedzi na potwierdzenie warunków Zamówienia przesłanych przez Sprzedawcę) wiadomości elektronicznej na adres poczty elektronicznej Sprzedawcy, w której Klient: akceptuje treść przesłanego Zamówienia i wyraża zgodę na jego realizację oraz akceptuje treść Regulaminu i potwierdza zapoznanie się z pouczeniem o odstąpieniu od Umowy.",
      "Po zawarciu Umowy sprzedaży, Sprzedawca potwierdza Klientowi jej warunki, przesyłając je na adres poczty elektronicznej Klienta lub pisemnie na podany przez Klienta adres.",
      "Sprzedawca zastrzega sobie prawo odmowy realizacji Zamówienia względem Przedsiębiorcy, w szczególności, gdy Zamówienie nie zawiera wszystkich istotnych danych, gdy Przedsiębiorca opóźnia się z jakąkolwiek płatnością wobec Sprzedawcy lub z innych przyczyn wskazanych przez Sprzedawcę.",
      "O odmowie realizacji Zamówienia, niezależnie od przyczyny, Sprzedawca informuje Przedsiębiorcę drogą telefoniczną lub mailową.",
      "Względem Przedsiębiorców, Sprzedawca w każdej chwili może odstąpić od Umowy w całości lub w części. W przypadku, gdy Zamówienie jest realizowane częściami, odstąpienie ma skutek jedynie w stosunku do części Zamówienia, która nie została zrealizowana, a w szczególności, która nie została wydana Przewoźnikowi, o ile z treści oświadczenia Sprzedawcy o odstąpieniu od Umowy nie wynika inaczej.",
      "Sprzedawca przesyła oświadczenie o odstąpieniu od Umowy drogą mailową na adres mailowy wskazany przez Przedsiębiorcę w Zamówieniu.",
      "Umowa sprzedaży zawierana jest w języku polskim, o treści zgodnej z Regulaminem.",
    ],
  },
  {
    title: "VI. Dostawa",
    items: [
      "Dostawa Towarów jest ograniczona do terytorium Unii Europejskiej oraz jest realizowana na adres wskazany przez Klienta w trakcie składania Zamówienia.",
      "Dostawa Towarów względem Przedsiębiorców jest płatna na zasadach i w wysokości określonej w Zamówieniu.",
      "Dostawa Towarów odbywa się za pośrednictwem Przewoźnika, tj. za pośrednictwem firmy kurierskiej, dostarczone do Paczkomatu lub transportem własnym Sprzedawcy.",
      "Poza metodami dostawy wskazanymi w ppkt. 3 powyżej, Klient może również odebrać Towar w punkcie odbioru osobistego Sprzedawcy.",
      "Z chwilą wydania Towarów będących przedmiotem Zamówienia złożonego przez Przedsiębiorcę Przewoźnikowi, przechodzą na Klienta korzyści i ciężary związane z rzeczą oraz niebezpieczeństwo przypadkowej utraty lub uszkodzenia rzeczy.",
      "Dostawa jest realizowana w Dni robocze. Sprzedawca może indywidualnie ustalić z Przedsiębiorcą dostawę również w dni inne niż Dni robocze.",
      "Dostawa Towarów zamówionych przez Klienta będącego Przedsiębiorcą nastąpi w terminie wskazanym przez Sprzedawcę.",
      "Przedsiębiorca po otrzymaniu dostawy Towarów zobowiązany jest sprawdzić ich stan. W przypadku stwierdzenia uszkodzeń lub innych zastrzeżeń podczas odbioru Towaru przez Przedsiębiorcę, należy sporządzić w obecności Przewoźnika protokół zastrzeżeń, określając precyzyjnie ilość i rodzaj Towarów oraz ich uszkodzenia zgodnie z procedurą obowiązującą u danego Przewoźnika.",
      "Względem Przedsiębiorców, Sprzedawca nie ponosi odpowiedzialności za działania Przewoźnika.",
      "Sprzedawca nie odpowiada za szkody wynikłe z niepoprawności lub niekompletnych danych podanych przez Przedsiębiorcę w trakcie składania Zamówienia, a także spowodowanych przez błędne podanie danych kontaktowych lub adresu odbioru.",
      "Przyjmuje się, że osoba odbierająca Towary w imieniu Przedsiębiorcy jest osobą upoważnioną przez niego do dokonania odbioru dostawy i podpisania się w jego imieniu na dokumencie dostawy, jak również dokonania innych czynności z tym związanych.",
      "W przypadku jednokrotnego nieodebrania przez Przedsiębiorcę Zamówionych Towarów, jeżeli były one dostarczane za pośrednictwem Przewoźnika, Sprzedawca może według swojego wyboru wyznaczyć Przedsiębiorcy inny termin odbioru lub dostawy Zamówienia lub rozwiązać Umowę w trybie natychmiastowym z Przedsiębiorcą lub odstąpić od Umowy, na zasadach wskazanych w niniejszym Regulaminie. Ponadto Przedsiębiorca jest zobowiązany do zapłaty kosztów poniesionych przez Sprzedawcę z tytułu nieodebrania Towarów, o którym mowa w niniejszym podpunkcie oraz kosztu wysyłki Towaru.",
      "Przedsiębiorca zobowiązuje się do zapłaty wszelkich kosztów poniesionych przez Sprzedawcę z tytułu nieodebrania Zamówionych Towarów przez Przedsiębiorcę.",
      "Sprzedawca nie ponosi odpowiedzialności za ewentualne szkody powstałe po stronie Przedsiębiorcy w wyniku oczekiwania na załadunek zorganizowanym przez Przedsiębiorcę transportem, w wyniku niedostosowania się do terminu odbioru Towarów wskazanego w Zamówieniu lub określonego przez Sprzedawcę.",
      "Sprzedawca na stronach internetowych Sklepu w opisie Towaru informuje Klienta będącego konsumentem o liczbie Dni roboczych potrzebnych do realizacji Zamówienia i jego dostawy, a także o wysokości opłat za dostawę Towaru.",
      "Termin dostawy i realizacji Zamówienia liczony jest w Dniach roboczych zgodnie z pkt. VII ppkt. 2.",
      "Sprzedawca dostarcza Klientowi dowód zakupu.",
      "Jeżeli dla Towarów objętych Zamówieniem przewidziano różny okres realizacji, dla całego Zamówienia obowiązuje okres najdłuższy spośród przewidzianych.",
    ],
  },
  {
    title: "VII. Ceny i metody płatności",
    items: [
      "Ceny Towarów podawane są w złotych polskich i zawierają wszystkie składniki, w tym podatek VAT, cła oraz inne opłaty.",
      {
        text: "Klient może wybrać następujące metody płatności:",
        sub: [
          "przelew bankowy na rachunek bankowy Sprzedawcy (w tym przypadku realizacja Zamówienia rozpoczęta zostanie po przesłaniu Klientowi przez Sprzedawcę potwierdzenia przyjęcia Zamówienia, zaś wysyłka dokonana zostanie niezwłocznie po wpłynięciu środków na rachunek bankowy Sprzedawcy i skompletowaniu Zamówienia);",
          "gotówką przy odbiorze osobistym – płatność w punkcie odbioru osobistego Sprzedawcy (w tym przypadku realizacja Zamówienia zostanie dokonana niezwłocznie po przesłaniu Klientowi przez Sprzedawcę potwierdzenia przyjęcia Zamówienia, zaś Towar wydany zostanie w punkcie odbioru osobistego Sprzedawcy);",
          "gotówką za pobraniem, płatność dostawcy przy dokonywaniu dostawy (w tym przypadku realizacja Zamówienia i jego wysyłka zostanie rozpoczęta po przesłaniu Klientowi przez Sprzedawcę potwierdzenia przyjęcia Zamówienia i skompletowaniu Zamówienia);",
          "płatność elektroniczna (w tym przypadku realizacja Zamówienia rozpoczęta zostanie po przesłaniu Klientowi przez Sprzedawcę potwierdzenia przyjęcia Zamówienia oraz po otrzymaniu przez Sprzedawcę informacji z systemu agenta rozliczeniowego o dokonaniu płatności przez Klienta, zaś wysyłka dokonana zostanie niezwłocznie po skompletowaniu Zamówienia).",
        ],
      },
      "Sprzedawca na stronach internetowych Sklepu informuje Klienta o terminie, w jakim jest on zobowiązany dokonać płatności za Zamówienie. W przypadku braku płatności przez Klienta w terminie, o którym mowa w zdaniu poprzednim, Sprzedawca po uprzednim bezskutecznym wezwaniu do zapłaty z wyznaczeniem stosownego terminu może odstąpić od Umowy na podstawie art. 491 Kodeksu Cywilnego.",
      "Przedsiębiorca nie będzie potrącał ani odliczał kwot dochodzonych lub należnych od Sprzedawcy, w ramach innego zobowiązania, jakie łączy go ze Sprzedawcą lub od wynagrodzenia, jakie przysługuje Sprzedawcy od Przedsiębiorcy, chyba że w ramach odrębnych ustaleń strony postanowiły inaczej.",
      "Sprzedawca ma prawo wstrzymać realizację Zamówień lub dostawę Towarów lub może odstąpić od Umowy w całości lub w części, w przypadku opóźnienia w płatnościach przez Przedsiębiorcę na rzecz Sprzedawcy. Z tego tytułu Przedsiębiorcy nie przysługują żadne roszczenia obecne ani przyszłe z tytułu szkód lub utraconych korzyści, jakie mogą wyniknąć w związku ze wstrzymaniem dostaw.",
    ],
  },
  {
    title: "VIII. Uprawnienie do odstąpienia od Umowy",
    items: [
      "Klient będący Konsumentem może odstąpić od Umowy bez podania przyczyny poprzez złożenie stosownego oświadczenia w terminie 30 dni. Do zachowania tego terminu wystarczy wysłanie oświadczenia przed jego upływem.",
      "Klient może sformułować oświadczenie samodzielnie bądź skorzystać ze wzoru oświadczenia udostępnionego przez Sprzedawcę na stronie Sklepu.",
      "Termin 30-dniowy liczy się od dnia, w którym nastąpiło dostarczenie Towaru lub w przypadku Umowy o świadczenie Usług od dnia jej zawarcia.",
      "Sprzedawca z chwilą otrzymania oświadczenia o odstąpieniu od Umowy przez Konsumenta prześle na adres poczty elektronicznej Konsumenta potwierdzenie otrzymania oświadczenia o odstąpieniu od Umowy.",
      {
        text: "Prawo do odstąpienia od Umowy przez Konsumenta jest wyłączone w przypadku:",
        sub: [
          "Umowy o świadczenie usług, za które Konsument jest zobowiązany do zapłaty ceny, jeżeli Sprzedawca wykonał w pełni usługę za wyraźną i uprzednią zgodą Konsumenta, który został poinformowany przed rozpoczęciem świadczenia, że po spełnieniu świadczenia przez przedsiębiorcę utraci prawo odstąpienia od umowy, i przyjął to do wiadomości;",
          "Umowy, w której cena lub wynagrodzenie zależy od wahań na rynku finansowym, nad którymi Sprzedawca nie sprawuje kontroli, i które mogą wystąpić przed upływem terminu do odstąpienia od Umowy;",
          "Umowy, w której przedmiotem świadczenia jest Towar nieprefabrykowany, wyprodukowany według specyfikacji Konsumenta lub służący zaspokojeniu jego zindywidualizowanych potrzeb;",
          "Umowy, w której przedmiotem świadczenia jest Towar ulegający szybkiemu zepsuciu lub mający krótki termin przydatności do użycia;",
          "Umowy, w której przedmiotem świadczenia jest Towar dostarczany w zapieczętowanym opakowaniu, którego po otwarciu opakowania nie można zwrócić ze względu na ochronę zdrowia lub ze względów higienicznych, jeżeli opakowanie zostało otwarte po dostarczeniu;",
          "Umowy, w której przedmiotem świadczenia są produkty, które po dostarczeniu, ze względu na swój charakter, zostają nierozłącznie połączone z innymi rzeczami;",
          "Umowy, w której przedmiotem świadczenia są napoje alkoholowe, których cena została uzgodniona przy zawarciu Umowy Sprzedaży, a których dostarczenie może nastąpić dopiero po upływie 30 dni i których wartość zależy od wahań na rynku, nad którymi Sprzedawca nie ma kontroli;",
          "Umowy, w której Konsument wyraźnie żądał, aby Sprzedawca do niego przyjechał w celu dokonania pilnej naprawy lub konserwacji; jeżeli Sprzedawca świadczy dodatkowo inne usługi niż te, których wykonania Konsument żądał, lub dostarcza Towary inne niż części zamienne niezbędne do wykonania naprawy lub konserwacji, prawo odstąpienia od Umowy przysługuje Konsumentowi w odniesieniu do dodatkowych usług lub Towarów;",
          "Umowy, w której przedmiotem świadczenia są nagrania dźwiękowe lub wizualne albo programy komputerowe dostarczane w zapieczętowanym opakowaniu, jeżeli opakowanie zostało otwarte po dostarczeniu;",
          "Umowy, której przedmiotem jest dostarczanie dzienników, periodyków lub czasopism, z wyjątkiem Umowy o prenumeratę;",
          "Umowy zawartej w drodze aukcji publicznej;",
          "Umowy o świadczenie usług, za które Konsument jest zobowiązany do zapłaty ceny, w przypadku których Konsument wyraźnie zażądał od Sprzedawcy, aby przyjechał do niego w celu dokonania naprawy, a usługa została już w pełni wykonana za wyraźną i uprzednią zgodą Konsumenta;",
          "Umowy o świadczenie usług w zakresie zakwaterowania, innych niż do celów mieszkalnych, przewozu rzeczy, najmu samochodów, gastronomii, usług związanych z wypoczynkiem, wydarzeniami rozrywkowymi, sportowymi lub kulturalnymi, jeżeli w umowie oznaczono dzień lub okres świadczenia usługi;",
          "Umowy o dostarczanie Treści cyfrowych, niedostarczanych na nośniku materialnym, za które Konsument jest zobowiązany do zapłaty ceny, jeżeli Sprzedawca rozpoczął świadczenie za wyraźną i uprzednią zgodą Konsumenta, który został poinformowany przed rozpoczęciem świadczenia, że po spełnieniu świadczenia przez Sprzedawcę utraci prawo odstąpienia od umowy, i przyjął to do wiadomości, a Sprzedawca przekazuje konsumentowi potwierdzenie, o którym mowa w art. 15 ust. 1 i 2 albo art. 21 ust. 1 Ustawy o prawach konsumenta.",
        ],
      },
      "Pozostałe wyjątki od prawa do odstąpienia od Umowy zostały wskazane w art. 38 ust. 2 Ustawy o prawach konsumenta.",
      "W przypadku odstąpienia od Umowy zawartej na odległość, Umowa jest uważana za niezawartą. To, co strony świadczyły, ulega zwrotowi w stanie niezmienionym, chyba że zmiana była konieczna w celu stwierdzenia charakteru, cech i funkcjonalności Towaru. Zwrot powinien nastąpić niezwłocznie, nie później niż w terminie 14 dni. Zakupiony Towar należy zwrócić na adres Sprzedawcy.",
      "Sprzedawca niezwłocznie, jednak nie później niż w terminie 14 dni od dnia otrzymania oświadczenia Konsumenta o odstąpieniu od Umowy, zwróci Konsumentowi wszystkie dokonane przez niego płatności, w tym koszty dostarczenia Towaru. Sprzedawca dokonuje zwrotu płatności przy użyciu takiego samego sposobu zapłaty, jakiego użył Konsument, chyba że Konsument wyrazi zgodę na inny sposób zwrotu, przy czym sposób ten nie będzie się wiązał dla Konsumenta z żadnym kosztem. Sprzedawca może wstrzymać się ze zwrotem płatności otrzymanych od Klienta do chwili otrzymania Towaru z powrotem lub dostarczenia przez Klienta dowodu jej odesłania, w zależności od tego, które zdarzenie nastąpi wcześniej, chyba że Sprzedawca zaproponował, że sam odbierze Towar od Klienta.",
      "Jeżeli Konsument wybrał sposób dostarczenia Towaru inny niż najtańszy zwykły sposób dostarczenia oferowany przez Sprzedawcę, Sprzedawca nie jest zobowiązany do zwrotu Konsumentowi poniesionych przez niego dodatkowych kosztów.",
      "Klient ponosi tylko bezpośredni koszt zwrotu Towaru, chyba że Sprzedawca zgodził się ponieść ten koszt.",
      "Zawarte w niniejszym punkcie zapisy stosuje się również do Przedsiębiorcy na prawach konsumenta.",
    ],
  },
  {
    title: "IX. Reklamacje dotyczące Towarów",
    items: [
      "Sprzedawca zobowiązuje się dostarczyć Towar zgodny z Umową.",
      "Sprzedawca odpowiada z tytułu niezgodności Towaru z umową na zasadach określonych w Ustawie o prawach konsumenta wobec Klienta będącego Konsumentem oraz Klienta będącego osobą fizyczną zawierającą Umowę bezpośrednio związaną z jej działalnością gospodarczą, gdy z treści tej Umowy wynika, że nie posiada ona dla tej osoby charakteru zawodowego, wynikającego w szczególności z przedmiotu wykonywanej przez nią działalności gospodarczej, udostępnionego na podstawie przepisów o Centralnej Ewidencji i Informacji o Działalności Gospodarczej.",
      "Reklamacje, wynikające z naruszenia praw Klienta gwarantowanych prawnie lub na podstawie niniejszego Regulaminu, należy kierować na adres STORENER Natalia Dąbrowska, Gałęzewko 14, 88-420 Rogowo, na adres poczty elektronicznej: storener@interia.pl, numer telefonu +48 661 377 044.",
      "Celem rozpatrzenia reklamacji Klient powinien przesłać lub dostarczyć reklamowany Towar, jeżeli jest to możliwe, dołączając do niego dowód zakupu. Towar należy dostarczyć lub przesłać na adres wskazany w pkt. 3.",
      "Sprzedawca zobowiązuje się do rozpatrzenia każdej reklamacji w terminie do 14 dni od dnia jej otrzymania.",
      "W przypadku braków w reklamacji Sprzedawca wezwie Klienta do jej uzupełnienia w niezbędnym zakresie niezwłocznie, nie później jednak niż w terminie 7 dni, od daty otrzymania wezwania przez Klienta.",
    ],
  },
  {
    title: "X. Reklamacje w zakresie świadczenia usług drogą elektroniczną",
    items: [
      "Klient może zgłaszać Sprzedawcy reklamacje w związku z funkcjonowaniem Sklepu i korzystaniem z Usług. Reklamacje można zgłaszać pisemnie na adres: STORENER Natalia Dąbrowska, Gałęzewko 14, 88-420 Rogowo, na adres poczty elektronicznej: storener@interia.pl, numer telefonu +48 661 377 044.",
      "W reklamacji Klient powinien podać swoje imię i nazwisko, adres do korespondencji, rodzaj i opis zaistniałego problemu.",
      "Sprzedawca zobowiązuje się do rozpatrzenia każdej reklamacji w terminie do 14 dni od dnia jej otrzymania. W przypadku braków w reklamacji Sprzedawca wezwie Klienta do jej uzupełnienia w niezbędnym zakresie w terminie 7 dni, od daty otrzymania wezwania przez Klienta.",
    ],
  },
  {
    title: "XI. Gwarancje",
    items: [
      "Towary mogą posiadać gwarancję producenta.",
      "W wypadku Towarów objętych gwarancją, informacja dotycząca istnienia i treści gwarancji oraz czasu, na jaki została udzielona, jest każdorazowo prezentowana w opisie Towaru na stronach internetowych Sklepu.",
    ],
  },
  {
    title: "XII. Własność intelektualna",
    items: [
      "Przedsiębiorca zobowiązuje się, że bez uprzedniej zgody Sprzedawcy nie będzie używał znaków towarowych, oznaczeń handlowych lub symboli Sprzedawcy.",
      "Wszelkie rysunki, specyfikacje, karty techniczne, materiały reklamowe lub inne materiały udostępnione przez Sprzedawcę Przedsiębiorcy lub publicznie stanowią wyłączną własność Sprzedawcy. Przedsiębiorca nie będzie dokonywał w tych materiałach zmian bez uprzedniej zgody Sprzedawcy.",
      "Przedsiębiorca samodzielnie lub na podstawie odpowiedniego upoważnienia udziela Sprzedawcy na logotyp działalności Przedsiębiorcy nieodpłatnej, niewyłącznej i nieograniczonej czasowo i terytorialnie licencji na korzystanie z niego do własnych celów prowadzonej działalności przez Sprzedawcę na następujących polach eksploatacji: utrwalanie, zwielokrotnianie dowolną techniką, wprowadzenie utworu do pamięci komputera oraz do sieci komputerowej, publiczne wyświetlanie lub odtwarzanie w Internecie, a w szczególności na stronach internetowych Sprzedawcy.",
      "Przedsiębiorca wyraża zgodę na umieszczenie ww. danych w wykazie klientów Sprzedawcy, dostępnym m.in. na stronach internetowych Sprzedawcy.",
    ],
  },
  {
    title: "XIII. Pozasądowe sposoby rozstrzygania reklamacji i dochodzenia roszczeń",
    items: [
      {
        text: "Klient będący Konsumentem posiada m.in. następujące możliwości skorzystania z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń:",
        sub: [
          "jest uprawniony do zwrócenia się do stałego polubownego sądu konsumenckiego działającego przy Inspekcji Handlowej z wnioskiem o rozstrzygnięcie sporu wynikłego z zawartej Umowy sprzedaży;",
          "jest uprawniony do zwrócenia się do wojewódzkiego inspektora Inspekcji Handlowej z wnioskiem o wszczęcie postępowania mediacyjnego w sprawie polubownego zakończenia sporu między Klientem a Sprzedawcą;",
          "może uzyskać bezpłatną pomoc w sprawie rozstrzygnięcia sporu między Klientem a Sprzedawcą, korzystając także z bezpłatnej pomocy powiatowego (miejskiego) rzecznika konsumentów lub organizacji społecznej, do której zadań statutowych należy ochrona Konsumentów (m.in. Federacja Konsumentów, Stowarzyszenie Konsumentów Polskich). Porady udzielane są przez Federację Konsumentów pod bezpłatnym numerem infolinii konsumenckiej 800 007 707 oraz przez Stowarzyszenie Konsumentów Polskich pod adresem e-mail porady@dlakonsumentow.pl;",
          "złożyć swoją skargę za pośrednictwem unijnej platformy internetowej ODR, dostępnej pod adresem: http://ec.europa.eu/consumers/odr/.",
        ],
      },
    ],
  },
  {
    title: "XIV. Ochrona danych osobowych",
    items: [
      "Podane przez Klientów dane osobowe Sprzedawca zbiera i przetwarza zgodnie z obowiązującymi przepisami prawa oraz zgodnie z Polityką Prywatności, dostępną na stronie Sklepu.",
    ],
  },
  {
    title: "XV. Postanowienia końcowe",
    items: [
      "Przedsiębiorca zobowiązany jest do niezwłocznego zawiadamiania Sprzedawcy o wszelkich zmianach adresów do doręczeń, upoważnień, pełnomocnictw, pod rygorem uznania za ważną korespondencji oraz realizacji Zamówień złożonych przez dotychczas umocowane lub upoważnione osoby i uznania za skuteczne doręczenia pod ostatni wskazany adres.",
      "Wszelkie prawa do Sklepu Internetowego, w tym majątkowe prawa autorskie, prawa własności intelektualnej do jego nazwy, domeny internetowej, strony internetowej Sklepu Internetowego, a także do formularzy, logotypów należą do Sprzedawcy, a korzystanie z nich może następować wyłącznie w sposób określony i zgodny z Regulaminem.",
      "Zawarte w niniejszym Regulaminie zapisy dotyczące Konsumenta, w przedmiocie odstąpienia od umowy oraz reklamacji, stosuje się do osoby fizycznej zawierającej umowę bezpośrednio związaną z jej działalnością gospodarczą, gdy z treści tej umowy wynika, że nie posiada ona dla tej osoby charakteru zawodowego, wynikającego w szczególności z przedmiotu wykonywanej przez nią działalności gospodarczej, udostępnionego na podstawie przepisów o Centralnej Ewidencji i Informacji o Działalności Gospodarczej. Nie stosuje się zapisów o pozasądowych sposobach rozstrzygania reklamacji i dochodzenia roszczeń.",
      "Wszelkie sprawy i spory wynikłe z tytułu Zamówień lub Umów zawartych pomiędzy Sprzedawcą i Przedsiębiorcą, w szczególności związane z ustaleniem istnienia stosunku prawnego łączącego Sprzedawcę i Przedsiębiorcę, jego wykonaniem, rozwiązaniem, unieważnieniem oraz dochodzeniem roszczeń odszkodowawczych z tytułu niewykonania lub nienależytego wykonania Zamówienia lub Umowy, podlegają wyłącznej jurysdykcji właściwych sądów Rzeczypospolitej Polskiej oraz prawu polskiemu.",
      "Wszelkie spory wynikające z Umów lub realizacji Zamówień zawartych pomiędzy Sprzedawcą i Przedsiębiorcą będą rozstrzygane przez sąd właściwy dla siedziby Sprzedawcy.",
      "Rozstrzyganie ewentualnych sporów powstałych pomiędzy Sprzedawcą a Klientem, który jest Konsumentem lub Przedsiębiorcą na prawach konsumenta, zostaje poddane sądom właściwym zgodnie z postanowieniami właściwych przepisów Kodeksu postępowania cywilnego.",
      "W sprawach nieuregulowanych w niniejszym Regulaminie mają zastosowanie przepisy Kodeksu Cywilnego, przepisy Ustawy o świadczeniu usług drogą elektroniczną, przepisy Ustawy o prawach Konsumenta oraz inne właściwe przepisy prawa polskiego.",
      "O wszelkich zmianach niniejszego Regulaminu każdy Klient zostanie poinformowany poprzez informacje na stronie głównej Sklepu Internetowego zawierającej zestawienie zmian i termin ich wejścia w życie. Klienci posiadający Konto zostaną dodatkowo poinformowani o zmianach wraz z ich zestawieniem na wskazany przez nich adres poczty elektronicznej. Termin wejścia w życie zmian nie będzie krótszy niż 14 dni od dnia ich ogłoszenia. W razie, gdy Klient posiadający Konto Klienta nie akceptuje nowej treści Regulaminu, obowiązany jest zawiadomić o tym fakcie Sprzedawcę w ciągu 14 dni od daty poinformowania o zmianie Regulaminu. Zawiadomienie Sprzedawcy o braku akceptacji nowej treści Regulaminu skutkuje rozwiązaniem Umowy.",
    ],
  },
];

export default function Page() {
  return (
    <InfoPage
      eyebrow="Dokumenty"
      title="Regulamin"
      icon={FileText}
      subtitle="Regulamin Sklepu Internetowego www.storener.pl – ogólne warunki, sposób świadczenia Usług drogą elektroniczną i sprzedaży."
    >
      {SECTIONS.map((section) => (
        <InfoCard key={section.title} title={section.title}>
          {section.intro && (
            <p className="mb-3 leading-relaxed text-gray-600">{section.intro}</p>
          )}
          <ol className="list-decimal space-y-2.5 pl-5 leading-relaxed text-gray-600 marker:font-semibold marker:text-gray-400">
            {section.items.map((item, index) =>
              typeof item === "string" ? (
                <li key={index}>{item}</li>
              ) : (
                <li key={index}>
                  {item.text}
                  <ol className="mt-2 list-[lower-alpha] space-y-1.5 pl-5 marker:font-medium marker:text-gray-400">
                    {item.sub.map((subItem, subIndex) => (
                      <li key={subIndex}>{subItem}</li>
                    ))}
                  </ol>
                </li>
              )
            )}
          </ol>
        </InfoCard>
      ))}
    </InfoPage>
  );
}
