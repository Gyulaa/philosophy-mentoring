import React from 'react'

function JelentkezesPage() {
  return (
    <>
      <section className="hero-bg text-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Jelentkezz a programra!</h1>
        </div>
      </section>

      <main className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto content-card">

            <div className="text-lg leading-relaxed text-gray-700 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">A jelentkezés menete</h2>
              <p>A jelentkezés során a diákoknak először egy adatlapot kell kitölteni. Ebben nevükön, elérhetőségükön és
                oktatási intézményükön kívül nem kérünk el tőlük személyes adatokat. Itt leginkább számunkra fontos
                visszajelzésre lesz lehetőség, honnan hallottak a programról, miért javasolták nekik etc.
              </p>
              <br />
              <p> A második részben
                viszont egy maximum 2000 karakteres rövid írást fogunk tőlük kérni motivációjukról, a programmal
                kapcsolatos elvárásaikról, jövőbeli terveikről és eddigi munkáikról. Ennek fő célja, hogy megismerjük
                érdeklődési körüket, azonban ezzel egyben szándékunk is mérni, a diák mennyire tudja felmérni, hogy
                mennyire való számára a program. Az írásművek a Personal Statment műfaját hivatottak imitálni, amely egy
                előzetes képet ad nekünk arról, hogy a jelentkezőt hogyan kell továbbfejlesztenünk ebben a műfajban, mivel
                a filozófiai írásművek mellett fontos képességnek tartjuk, hogy későbbi ösztöndíj jelentkezésekhez vagy
                kutatási tervezetek megíráshoz megfelelő tudással lássuk el őket a személyes mentorálás során.
              </p>
            </div>

            <div className="flex justify-center">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSeHOEqXxPdNiMsVBasgq3wg2pCnZ_dr6t6e-_xCLYHtjOT6rg/viewform?embedded=true"
                width="100%"
                height="1880"
                style={{ maxWidth: "640px", minHeight: "1880px", border: "none" }}
                title="Filozófiai Mentorprogram Jelentkezési űrlap"
                loading="lazy"
                allowFullScreen
              >
                Betöltés…
              </iframe>

            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default JelentkezesPage