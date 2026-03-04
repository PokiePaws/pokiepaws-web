# 🐾 PokiePaws Web

Aplikacja webowa dla sieci franczyzowej PokiePaws

### Platforma: TypeScript + React / Next.js
### Obsługuje role: Guest, Vet, Admin
### Komunikuje się z centralnym REST API + WebSocket (real-time)
## 📋 Opis
Aplikacja webowa jest jednym z czterech komponentów systemu PokiePaws.
Umożliwia niezalogowanym użytkownikom poznanie sieci, lekarzom/franczyzobiorcom prowadzenie gabinetu, a centrali - pełną administrację i kontrolę.
Pełna responsywność (TailwindCSS mobile-first), ujednolicony design PokiePaws, powiadomienia w czasie rzeczywistym.
Funkcjonalności

##  🌐 Strona publiczna (Guest – niezalogowany)
  - Landing page sieci PokiePaws – misja, model franczyzowy, jak dołączyć 
  - Interaktywna mapa gabinetów sieci w całej Polsce 
  - Podgląd informacji o każdym gabinecie (adres, godziny otwarcia, lekarze, kontakt, zdjęcia)
  - Responsywny blog z artykułami o zdrowiu i pielęgnacji zwierząt 
  - Formularz kontaktowy + sekcja informacji o franczyzie

##  🔐 Logowanie (email + hasło) – dla Vet i Admin
### 🏥 Panel lekarza / franczyzobiorcy (Vet)
- Kalendarz wizyt – widok tygodniowy / miesięczny, drag & drop, dodawanie / edycja / usuwanie
- Lista pacjentów gabinetu (zwierzęta + właściciele) z wyszukiwaniem
- Dokumentacja medyczna – wprowadzanie diagnozy, zaleceń, recept, załączników
- Zarządzanie profilem gabinetu (godziny pracy, przerwy, opis usług, zdjęcia, cennik publiczny)
- Deklarowanie dostępności – ustawianie slotów roboczych (synchronizowane z aplikacją mobilną)
- Sklep centralny – przeglądanie katalogu produktów (leki, szczepionki, karma, sprzęt)
- Koszyk i składanie zamówień
- Historia zamówień z podglądem statusu 
- Powiadomienia real-time o nowych wizytach i zmianach statusu zamówień (WebSocket)

## ⚙️ Panel administracyjny centrali (Admin)
- Zarządzanie gabinetami franczyzowymi (dodawanie, edycja, zawieszanie, dezaktywacja)
- Zatwierdzanie nowych franczyzobiorców
- Zarządzanie użytkownikami systemu (wszystkie role)
- Statystyki sieci – liczba wizyt, zamówień, aktywnych gabinetów
- Zarządzanie treścią bloga i strony publicznej (dodawanie, edycja, publikacja)

### 🔔 Powiadomienia real-time (WebSocket) – nowe wizyty, anulowania, zmiany statusu zamówień
### 🌐 Obsługa języka polskiego i angielskiego
### 📱 Pełna responsywność – mobile-first, hamburger menu na małych ekranach, poprawne działanie kalendarza i tabel na urządzeniach mobilnych
### 🎨 Spójna identyfikacja wizualna PokiePaws we wszystkich warstwach