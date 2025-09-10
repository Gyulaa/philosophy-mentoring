# 🚀 FiloMento Admin Rendszer - Útmutató

## 🎯 Bevezetés

Üdvözöllek a FiloMento admin rendszerében! Ezt a rendszert kifejezetten azért hoztam létre, hogy te is könnyedén tudj változtatásokat eszközölni a weboldalon, anélkül hogy programoznod kellene.

## 🔐 Hozzáférés

### 1. Belépés az Admin Felületre
```
URL: [WEBOLDAL_CÍME]/admin
Jelszó: FiloMento2025Admin!
```

### 2. Bejelentkezés
1. Nyisd meg a weboldalt
2. Add hozzá az URL végére: `/admin`
3. Add meg a jelszót: `FiloMento2025Admin!`
4. A bejelentkezés 24 órán át érvényes

## 🎛️ Jelenlegi Funkciók

### ✅ Amit Most Már Tudsz Csinálni:
- **Biztonságos bejelentkezés** admin jelszóval
- **Dashboard megtekintése** - áttekintés a weboldal állapotáról
- **Alapvető navigáció** az admin felületen
- **Élő oldal előnézete** - láthatod a változásokat

### 🔄 Amit Hamarosan Tudsz Majd Csinálni:
- **Tartalom szerkesztése** vizuálisan, egyszerű felületen
- **Szövegek módosítása** minden oldalon
- **Képek feltöltése és cseréje**
- **Új oldalak létrehozása**
- **Kapcsolati adatok módosítása**

## 🛠️ Technikai Részletek

### Amit Implementáltam:
- **Biztonságos authentikáció** cookie-alapú bejelentkezéssel
- **Fájl-alapú adattárolás** - minden adat JSON fájlokban
- **API végpontok** a tartalom kezeléséhez
- **Dinamikus oldal renderelés** - a CMS automatikusan frissíti az oldalakat
- **PM2 service management** - stabil szerver működés

### Rendszer Architektúra:
```
📁 src/
├── 📁 app/
│   ├── 📁 admin/           # Admin felület oldalak
│   ├── 📁 api/             # API végpontok
├── 📁 components/
│   ├── 📁 admin/           # Admin komponensek
│   ├── DynamicPage.tsx     # Dinamikus oldal renderelő
├── 📁 lib/
│   ├── cms.ts              # Tartalomkezelő rendszer
│   ├── auth.ts             # Authentikáció
📁 data/                    # Automatikusan létrejönnek
├── content.json            # Oldal tartalmak
├── settings.json           # Webhely beállítások
```

## 🎨 Következő Fejlesztési Lépések

### Prioritás 1 - Tartalomszerkesztő (1-2 hét)
- **Vizuális szerkesztő felület** minden oldalhoz
- **Drag & drop** szakaszok átrendezéséhez
- **WYSIWYG editor** szövegek formázásához
- **Képfeltöltés** lehetőség

### Prioritás 2 - Beállítások Kezelése (1 hét)
- **Webhely beállítások** módosítása
- **Kapcsolati adatok** szerkesztése
- **SEO beállítások** optimalizálása

### Prioritás 3 - További Funkciók (2-3 hét)
- **Új oldalak** létrehozása
- **Menü kezelése**
- **Backup és restore** funkciók
- **Felhasználó-barát hibaüzenetek**

## 🔒 Biztonság

### Mit Tettem a Biztonságért:
- **Jelszavas védelem** az admin felületre
- **HTTP-only cookies** - nem lehet JavaScript-tel elérni
- **Session timeout** 24 óra után
- **Fájl alapú adattárolás** - nincs adatbázis biztonsági kockázat

### Mit Kell Figyelned:
- **Soha ne oszd meg** a jelszót senkivel
- **Mindig jelentkezz ki** használat után
- **Időnként változtasd meg** a jelszót (kérj segítséget)

## 📱 Használat Mobilon

Az admin felület **reszponzív**, tehát telefonról és tabletről is használható:
- **Egyszerű navigáció** érintéssel
- **Automatikus alkalmazkodás** a képernyőhöz
- **Teljes funkcionalitás** mobil eszközökön is

## 🆘 Hibaelhárítás

### Gyakori Problémák és Megoldásaik:

#### "Unauthorized" hiba
**Mit jelent:** Lejárt a bejelentkezésed vagy rossz a jelszó
**Megoldás:** Menj a `/admin/login` oldalra és jelentkezz be újra

#### Változtatások nem jelennek meg
**Mit jelent:** A böngésző cache-eli a régi verziót
**Megoldás:** Frissítsd az oldalt (F5) vagy Ctrl+F5

#### Lassú betöltés
**Mit jelent:** A szerver indítása időbe telik
**Megoldás:** Várj 1-2 percet, majd próbáld újra

## 📞 Támogatás

### Ha Segítségre Van Szükséged:
1. **Nézd át ezt az útmutatót** még egyszer
2. **Próbáld ki újra** a problémás műveletet
3. **Írj nekem** részletes leírással:
   - Mit próbáltál csinálni?
   - Mi történt helyette?
   - Milyen hibaüzenet jelent meg?

### Fejlesztési Kérések:
Ha van valami konkrét funkció, amit szeretnél:
- **Írd le részletesen** mit szeretnél elérni
- **Küldj példát** ha van (link más weboldalról)
- **Add meg a prioritást** (mennyire sürgős)

## 🚀 Jövőbeni Tervek

### Rövid Távú (1-2 hónap)
- **Teljes tartalomszerkesztő** minden oldalhoz
- **Képkezelés** feltöltéssel és szerkesztéssel
- **Beállítások panel** a webhely személyre szabásához

### Középtávú (3-6 hónap)
- **Új oldalak létrehozása** egyszerűen
- **Formok kezelése** (jelentkezési űrlap stb.)
- **Analitika integráció** látogatottság mérésére

### Hosszú Távú (6-12 hónap)
- **Többnyelvűség** támogatása
- **Fejlett SEO eszközök**
- **Automatikus biztonsági mentés**

---

## 💡 Tippek a Hatékony Használathoz

1. **Tervezd meg előre** mit szeretnél változtatni
2. **Kis lépésekben dolgozz** - ne csinálj sok változtatást egyszerre
3. **Mindig nézd meg az előnézetet** mentés előtt
4. **Készíts jegyzeteket** arról, mit változtattál
5. **Ne félj kísérletezni** - minden visszavonható

---

**Készítette:** [Te]
**Dátum:** 2025. szeptember
**Verzió:** 1.0

*Remélem, hogy ezzel az admin rendszerrel sokkal egyszerűbb lesz a weboldal karbantartása! Bármilyen kérdésed van, bátran keress! 😊*