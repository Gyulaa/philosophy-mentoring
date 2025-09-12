import React from 'react'
import Link from 'next/link'
import { PageContent, ContentSection } from '@/lib/cms'

interface DynamicPageProps {
  pageContent: PageContent
}

function SectionRenderer({ section }: { section: ContentSection }) {
  switch (section.type) {
    case 'hero':
      return (
        <section className="hero-bg text-white py-20 md:py-32">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
              {section.title || 'Gondolkodj velünk!'}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-center">
              {section.subtitle || section.content || 'Fedezd fel a filozófia világát egy középiskolásoknak szóló, interaktív online mentorprogram keretében.'}
            </p>
          </div>
        </section>
      )

    case 'text':
      return (
        <div className="space-y-6 text-lg leading-relaxed text-gray-700">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
              {section.title}
            </h2>
          )}
          {section.content && (
            <div className="whitespace-pre-wrap">
              {section.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className={index > 0 ? 'mt-6' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      )

    case 'highlight':
      return (
        <div className="bg-gray-100 p-6 rounded-lg">
          {section.title && (
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              {section.title}
            </h3>
          )}
          {section.content && (
            <div className="whitespace-pre-wrap text-gray-700">
              {section.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className={index > 0 ? 'mt-4' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      )

    case 'info-box':
      return (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-r-lg">
          {section.content && (
            <div className="whitespace-pre-wrap">
              {section.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className={index > 0 ? 'mt-3' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      )

    case 'button':
      return (
        <div className="text-center mt-12 mb-10 md:mb-14">
          {section.buttonText && section.buttonLink && (
            <div id="apply-btn-container">
              <Link 
                href={section.buttonLink} 
                className="inline-block bg-[#4130DB] text-white text-lg font-semibold rounded-lg px-8 py-4 mt-8 shadow-lg hover:bg-[#2e1fa3] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#4130DB] focus:ring-offset-2"
              >
                {section.buttonText}
              </Link>
            </div>
          )}
        </div>
      )

    case 'embed':
      return (
        <div className="flex justify-center">
          {section.embedUrl && (
            <iframe
              src={section.embedUrl}
              width="100%"
              height={(section.height || 1880).toString()}
              style={{ maxWidth: '640px', minHeight: `${section.height || 1880}px`, border: 'none' }}
              title={section.title || 'Beágyazott űrlap'}
              loading="lazy"
              allowFullScreen
            >
              Betöltés…
            </iframe>
          )}
        </div>
      )

    case 'image':
      return (
        <div className="flex justify-center my-10 md:my-14">
          {section.imageUrl && (() => {
            let src = section.imageUrl as string
            const match = src.match(/drive\.google\.com\/file\/d\/([^/]+)\//)
            if (match && match[1]) {
              src = `https://drive.google.com/uc?export=view&id=${match[1]}`
            }
            const width = section.imageWidth || 640
            const height = section.imageHeight
            return (
              <div className="w-full flex flex-col items-center" style={{ maxWidth: `${width}px` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={section.title || ''}
                  width={width}
                  height={height || undefined}
                  className="rounded"
                  style={{ width: `${width}px`, height: height ? `${height}px` : 'auto' }}
                  referrerPolicy="no-referrer"
                />
                {section.description && (
                  <p className="mt-2 text-sm text-gray-500 text-center">{section.description}</p>
                )}
              </div>
            )
          })()}
        </div>
      )

    default:
      return null
  }
}

export default function DynamicPage({ pageContent }: DynamicPageProps) {
  // Separate hero sections from content sections
  const heroSection = pageContent.sections.find(section => section.type === 'hero')
  const contentSections = pageContent.sections.filter(section => section.type !== 'hero')

  return (
    <>
      {heroSection && <SectionRenderer section={heroSection} />}
      
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto content-card">
            {contentSections.map((section, index) => (
              <div key={section.id} className={index > 0 && section.type === 'info-box' ? 'mt-12 md:mt-12' : ''}>
                {/* Only add a divider BEFORE sections except the first; never after */}
                {index > 0 && section.type !== 'button' && section.type !== 'image' && section.type !== 'info-box' && (
                  <div className="border-t my-12"></div>
                )}
                <SectionRenderer section={section} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}