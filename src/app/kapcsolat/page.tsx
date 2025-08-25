import React from 'react'

function KapcsolatPage() {
  return (
    <>
      <section className="hero-bg text-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Lépj velünk kapcsolatba!</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">Kérdésed van a programmal, a jelentkezéssel vagy bármi mással kapcsolatban? Lépj velünk kapcsolatba!</p>
        </div>
      </section>
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto content-card">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">Elérhetőségeink</h2>
            <div className="text-center text-lg text-gray-700 mb-12">
              <div className="mt-6 space-y-3">
                <p className="font-bold">📩 E-mail: <a href="mailto:filozofinformacio@gmail.com" className="text-indigo-600 hover:underline">filozofinformacio@gmail.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default KapcsolatPage