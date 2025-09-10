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
        <div className="text-center mt-12">
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
              <div key={section.id}>
                <SectionRenderer section={section} />
                {/* Add separator between sections, except for the last one */}
                {index < contentSections.length - 1 && 
                 section.type !== 'button' && 
                 contentSections[index + 1].type !== 'button' && (
                  <div className="border-t my-12"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}