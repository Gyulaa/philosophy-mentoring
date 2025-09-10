import { promises as fs } from 'fs'
import path from 'path'

export interface PageContent {
  id: string
  title: string
  sections: ContentSection[]
  metadata?: Record<string, string>
}

export interface ContentSection {
  id: string
  type: 'hero' | 'text' | 'highlight' | 'info-box' | 'button'
  title?: string
  content?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  isHighlighted?: boolean
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  footerText: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const CONTENT_FILE = path.join(DATA_DIR, 'content.json')
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json')

// GitHub persistence configuration (free via GitHub repo)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = process.env.GITHUB_REPO // format: "owner/name"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'

function isGitHubCmsEnabled(): boolean {
  return Boolean(GITHUB_TOKEN && GITHUB_REPO)
}

function githubHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json'
  }
}

function getGithubContentUrl(filePath: string): string {
  return `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`
}

async function githubReadJson(filePath: string): Promise<any | null> {
  const url = getGithubContentUrl(filePath)
  const res = await fetch(url, { headers: githubHeaders(), cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`)
  const data = await res.json() as { content: string }
  const decoded = Buffer.from(data.content, 'base64').toString('utf8')
  return JSON.parse(decoded)
}

async function githubWriteJson(filePath: string, json: unknown): Promise<void> {
  // Get existing sha if present
  const getUrl = getGithubContentUrl(filePath)
  let sha: string | undefined
  const getRes = await fetch(getUrl, { headers: githubHeaders(), cache: 'no-store' })
  if (getRes.ok) {
    const existing = await getRes.json() as { sha?: string }
    sha = existing.sha
  }

  const putUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`
  const body = {
    message: `chore(cms): update ${filePath}`,
    content: Buffer.from(JSON.stringify(json, null, 2), 'utf8').toString('base64'),
    branch: GITHUB_BRANCH,
    sha
  }
  const putRes = await fetch(putUrl, { method: 'PUT', headers: githubHeaders(), body: JSON.stringify(body) })
  if (!putRes.ok) throw new Error(`GitHub write failed: ${putRes.status}`)
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Default content structure
const defaultContent: Record<string, PageContent> = {
  bemutatkozas: {
    id: 'bemutatkozas',
    title: 'Diákoknak',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Gondolkodj velünk!',
        subtitle: 'Fedezd fel a filozófia világát egy középiskolásoknak szóló, interaktív online mentorprogram keretében.'
      },
      {
        id: 'intro',
        type: 'text',
        title: 'A programról',
        content: 'Szia! Nagyon örülünk, hogy ránk találtál!\n\nE középiskolás filozófiai mentorprogram során hetente egy online óra keretében vállalkozunk a filozófia történet nagyjainak és a filozófiát az ókortól egészen napjainkig meghatározó gondolatok bemutatására. Az órák az alapokon kívül a modern gondolkodás minél tágabb spektrumát érintik majd, lesz szó a létezés nagy kérdései mellett tudományos problémákról, a tudásunk határairól, erkölcsi dilemmákról, politikáról, vallásról, nyelvről, irodalomról, gazdaságról és társadalomról. Ezek interaktív alkalmak lesznek, tehát rengeteg lehetőségetek lesz kérdezni is. Mindezen túl a program részét képezik plusz alkalmak meghívott vendég-előadókkal, valamint egy év végi zárókonferencia, ahol lehetőséged nyílik majd prezentálni is.'
      },
      {
        id: 'schedule-note',
        type: 'info-box',
        content: 'Az év tervezetét hamarosan itt tekintheted meg. Fontos, hogy a jelentkezők érdeklődése és a program lefolyása tükrében fenntartjuk magunknak a lehetőséget az év során kisebb változtatások eszközlésére.'
      },
      {
        id: 'about-us',
        type: 'highlight',
        title: 'Kik vagyunk mi?',
        content: 'A programszervezői és lebonyolítói NEM tanárok vagy egyetemi professzorok, hanem motivált egyetemisták, akiknek gimis korukban sokat jelentett a filozófia oktatás és most ezt szeretnék továbbadni Neked is. De ne ijedj meg, sokan közülünk filozófiát hallgatnak, vesznek rész egyetemi kutatásokban vagy járnak szakkollégiumba. Mind érettségiztünk emelt szinten filozófiából, OKTV-ztünk és páran még a Nemzetközi Filozófia Olimpián is voltak.'
      },
      {
        id: 'target-audience',
        type: 'text',
        title: 'Kiknek a jelentkezését várjuk?',
        content: 'Olyan középiskolás diákokét (9.-12. évfolyamig), akik úgy érzik, hogy szeretnek néha túlkérdezni azon, amit az iskolai anyag le tud fedni például magyarból, matekból, fizikából, töriből vagy etikából. Ha esetleg már vannak konkrét filozófiai kérdések vagy gondolkodók, amik felkeltették az érdeklődésedet, akkor pedig biztosan velünk a helyed, de ez nem elvárás.\n\nFontos továbbá, hogy merj saját ötletekkel előrukkolni, hiszen a program zárókonferenciájára a kijelölt mentorod segítségével el kell készítened egy saját filozófiai cikket, amit majd előadhatsz. Ha úgy érzed, hogy híján vagy még íráskészségnek vagy a gondolatok megragadásának ehhez a feladathoz, semmi gond, részben az önálló kritikai gondolkodás és a folyamatos reflexióra való képesség elsajátítása is a célunk a mentorálásoddal.'
      },
      {
        id: 'application',
        type: 'text',
        title: 'Jelentkezés',
        content: 'A jelentkezéshez egy Google Forms-ot kell kitölteni, ahol pár kérdés lesz Rólad és az eddigi tanulmányaidról, illetve, hogy hol hallottál a programról. Ezzel a kérdőívvel leginkább a mi munkánkat segíted. Ezen kívül kíváncsiak vagyunk rá, hogy miért szeretnél jelentkezni a programba, miért gondolod, hogy Neked kellene megadnunk a részvétel lehetőségét és hogyan, mire kívánod felhasználni az itt szerzett tudásodat. Ha van valamilyen versenyeredményed vagy szociális tevékenységed, amire büszke vagy és alátámasztja, hogy való Neked ez a mentorprogram, bátran írd bele azt is. Ez a maximum 2000 karakteres írásod segít majd nekünk abban, hogy megállapítsuk mi is érdekel Téged pontosan és így rögtön a megfelelő mentort oszthassuk be melléd.'
      },
      {
        id: 'apply-button',
        type: 'button',
        buttonText: 'Jelentkezés',
        buttonLink: '/jelentkezes'
      }
    ]
  }
}

const defaultSettings: SiteSettings = {
  siteName: 'FiloMento',
  siteDescription: 'Filozófiai Mentorprogram Tájékozatató oldal',
  contactEmail: 'filozofinformacio@gmail.com',
  footerText: '2025 Filozófiai Mentorprogram'
}

// Load content from file
export async function loadContent(): Promise<Record<string, PageContent>> {
  // GitHub-backed read if configured
  if (isGitHubCmsEnabled()) {
    try {
      const gh = await githubReadJson('data/content.json')
      if (gh) return gh
    } catch {
      // fall back to defaults below
    }
  }

  await ensureDataDir()
  try {
    const data = await fs.readFile(CONTENT_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    await saveContent(defaultContent)
    return defaultContent
  }
}

// Save content to file
export async function saveContent(content: Record<string, PageContent>): Promise<void> {
  if (isGitHubCmsEnabled()) {
    await githubWriteJson('data/content.json', content)
    return
  }
  await ensureDataDir()
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2))
}

// Load settings from file
export async function loadSettings(): Promise<SiteSettings> {
  if (isGitHubCmsEnabled()) {
    try {
      const gh = await githubReadJson('data/settings.json')
      if (gh) return gh
    } catch {
      // fall back
    }
  }
  await ensureDataDir()
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    await saveSettings(defaultSettings)
    return defaultSettings
  }
}

// Save settings to file
export async function saveSettings(settings: SiteSettings): Promise<void> {
  if (isGitHubCmsEnabled()) {
    await githubWriteJson('data/settings.json', settings)
    return
  }
  await ensureDataDir()
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2))
}

// Get specific page content
export async function getPageContent(pageId: string): Promise<PageContent | null> {
  const content = await loadContent()
  return content[pageId] || null
}

// Update specific page content
export async function updatePageContent(pageId: string, pageContent: PageContent): Promise<void> {
  const content = await loadContent()
  content[pageId] = pageContent
  await saveContent(content)
}

// Add new page
export async function addPage(pageContent: PageContent): Promise<void> {
  const content = await loadContent()
  content[pageContent.id] = pageContent
  await saveContent(content)
}

// Delete page
export async function deletePage(pageId: string): Promise<void> {
  const content = await loadContent()
  delete content[pageId]
  await saveContent(content)
}

// Get all pages
export async function getAllPages(): Promise<PageContent[]> {
  const content = await loadContent()
  return Object.values(content)
}