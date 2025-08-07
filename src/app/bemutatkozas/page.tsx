import React from 'react'

function IntroPage() {
  return (
    <>
      <section className="hero-bg text-white py-20 md:py-32 hero-text-bottom">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">Gondolkodj velünk!</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-center">Fedezd fel a filozófia világát egy középiskolásoknak szóló, interaktív online mentorprogram keretében.</p>
        </div>
      </section>
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto content-card">

            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">A programról</h2>

            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p className="font-semibold">Szia! Nagyon örülünk, hogy ránk találtál!</p>
              <p>E középiskolás filozófiai mentorprogram során hetente egy online óra keretében vállalkozunk a filozófia történet nagyjainak és a filozófiát az ókortól egészen napjainkig meghatározó gondolatok bemutatására. Az órák az alapokon kívül a modern gondolkodás minél tágabb spektrumát érintik majd, lesz szó a létezés nagy kérdései mellett tudományos problémákról, a tudásunk határairól, erkölcsi dilemmákról, politikáról, vallásról, nyelvről, irodalomról, gazdaságról és társadalomról. Ezek interaktív alkalmak lesznek, tehát rengeteg lehetőségetek lesz kérdezni is. Mindezen túl a program részét képezik plusz alkalmak meghívott vendég-előadókkal, valamint egy év végi zárókonferencia, ahol lehetőséged nyílik majd prezentálni is.</p>

              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-r-lg">
                <p>Az év tervezetét hamarosan itt tekintheted meg. Fontos, hogy a jelentkezők érdeklődése és a program lefolyása tükrében fenntartjuk magunknak a lehetőséget az év során kisebb változtatások eszközlésére.</p>
              </div>

              <p>Érdekel, hogy mit is csinál egész nap egy filozófus? Szeretnél többet megtudni a kortárs bölcseletről, napjaink meghatározó gondolatairól? Jó helyen jársz! Az órák mellett időközönként igyekszünk Neked egy kis betekintést nyújtani mindebbe, különböző filozófusok és vendég-előadók meghívásával, akik kutatásaikról és az őket foglalkoztató területekről fognak beszámolni.</p>

              <p>A program fontos eleme, hogy személyes mentorálást is kínálunk Neked. Érdeklődési körödnek megfelelően kijelölünk melléd egy mentort, aki one-on-one segít a zárókonferenciára írt cikked megalkotásában, a prezentálásra való készülésben, és akár további meetingek során támogatja egyéni filozófiai fejlődésedet.</p>

              <p>A mentorprogram egyben azt is lefedi, hogy ha esetleg meghozzuk a kedvedet ahhoz, hogy érettségizz filozófiából vagy beadd jelentkezésedet a januári OKTV-re, abban messzemenően támogatunk célirányos felkészítéssel és személyes élményekből gyűjtött tanácsokkal, tippekkel.</p>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Kik vagyunk mi?</h3>
                <p>A programszervezői és lebonyolítói NEM tanárok vagy egyetemi professzorok, hanem motivált egyetemisták, akiknek gimis korukban sokat jelentett a filozófia oktatás és most ezt szeretnék továbbadni Neked is. De ne ijedj meg, sokan közülünk filozófiát hallgatnak, vesznek rész egyetemi kutatásokban vagy járnak szakkollégiumba. Mind érettségiztünk emelt szinten filozófiából, OKTV-ztünk és páran még a Nemzetközi Filozófia Olimpián is voltak.</p>
              </div>
            </div>

            <div className="border-t my-12"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">Kiknek a jelentkezését várjuk?</h2>

            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>Olyan középiskolás diákokét (9.-12. évfolyamig), akik úgy érzik, hogy szeretnek néha túlkérdezni azon, amit az iskolai anyag le tud fedni például magyarból, matekból, fizikából, töriből vagy etikából. Ha esetleg már vannak konkrét filozófiai kérdések vagy gondolkodók, amik felkeltették az érdeklődésedet, akkor pedig biztosan velünk a helyed, de ez nem elvárás.</p>
              <p>Fontos továbbá, hogy merj saját ötletekkel előrukkolni, hiszen a program zárókonferenciájára a kijelölt mentorod segítségével el kell készítened egy saját filozófiai cikket, amit majd előadhatsz. Ha úgy érzed, hogy híján vagy még íráskészségnek vagy a gondolatok megragadásának ehhez a feladathoz, semmi gond, részben az önálló kritikai gondolkodás és a folyamatos reflexióra való képesség elsajátítása is a célunk a mentorálásoddal.</p>
            </div>

            <div className="border-t my-12"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">Jelentkezés</h2>

            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>A jelentkezéshez egy Google Forms-ot kell kitölteni, ahol pár kérdés lesz Rólad és az eddigi tanulmányaidról,
                illetve, hogy hol hallottál a programról. Ezzel a kérdőívvel leginkább a mi munkánkat segíted. Ezen kívül
                kíváncsiak vagyunk rá, hogy miért szeretnél jelentkezni a programba, miért gondolod, hogy Neked kellene
                megadnunk a részvétel lehetőségét és hogyan, mire kívánod felhasználni az itt szerzett tudásodat. Ha van
                valamilyen versenyeredményed vagy szociális tevékenységed, amire büszke vagy és alátámasztja, hogy való
                Neked ez a mentorprogram, bátran írd bele azt is. Ez a maximum 2000 karakteres írásod segít majd nekünk
                abban, hogy megállapítsuk mi is érdekel Téged pontosan és így rögtön a megfelelő mentort oszthassuk be
                melléd.
              </p>
            </div>

            {/* Apply Button */}
            <div className="text-center mt-12">
              <div id="apply-btn-container">
                <a href="jelentkezes" className="inline-block bg-[#4130DB] text-white text-lg font-semibold rounded-lg px-8 py-4 mt-8 shadow-lg hover:bg-[#2e1fa3] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#4130DB] focus:ring-offset-2">
                  {"Jelentkezés"}
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}

export default IntroPage