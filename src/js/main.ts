import matchSorter from 'match-sorter'
import iconTags from '../data/iconTags'

const $smallContainer = document.getElementById('small')
const $mediumContainer = document.getElementById('medium')
const $searchInput = document.getElementById('search') as HTMLInputElement
const $icons: HTMLLIElement[] = Array.from(
  document.querySelectorAll('[data-name]')
)
const icons: Record<string, Record<string, HTMLLIElement>> = {}
const index: {
  name: string
  tags: string[]
}[] = []
const iconNames: string[] = []

for (let i = 0; i < $icons.length; i++) {
  let name = $icons[i].getAttribute('data-name')
  let style = $icons[i].getAttribute('data-style')
  if (icons[name]) {
    icons[name][style] = $icons[i]
  } else {
    icons[name] = { [style]: $icons[i] }
  }
  iconNames.push(name)
  index.push({
    name,
    tags: (iconTags as Record<string, string[]>)[name] || [],
  })
}

function search(query: string): void {
  let matches = matchSorter(index, query, {
    keys: ['name', 'tags'],
  })
  let matchedNames = matches.map((x) => x.name)
  iconNames
    .filter((name) => matchedNames.indexOf(name) === -1)
    .forEach((name) => {
      icons[name].small.remove()
      icons[name].medium.remove()
    })
  $smallContainer.append(...matchedNames.map((name) => icons[name].small))
  $mediumContainer.append(...matchedNames.map((name) => icons[name].medium))
}

$searchInput.addEventListener('input', (e) => {
  search((e.target as HTMLInputElement).value)
})

window.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  const copy = target.getAttribute('data-copy')
  if (!copy) return
  let indent = 1
  const svg = target
    .closest('li')
    .querySelector('svg')
    .outerHTML.replace(/>\s+</g, '><')
    .replace(/\s+width="[0-9]+" height="[0-9]+"\s+/, ' ')
    .replace(/(>)(<\/?)/g, (_, gt, lt) => {
      let closing = /\/$/.test(lt)
      if (closing) {
        indent--
      }
      let str = `${gt}\n` + '  '.repeat(indent) + lt
      if (!closing) {
        indent++
      }
      return str
    })
    .replace(/>\s+?<\/([^>]+)>/g, ' />')

  if (copy === 'html') {
    navigator.clipboard.writeText(svg).then(() => {
      console.log('Copied HTML:', svg)
    })
    return
  }

  const jsx = svg.replace(
    /(\s)([a-z-]+)="([^"]+)"/gi,
    (_, prefix: string, attr: string, value: string) => {
      const jsxValue = /^[0-9.]+$/.test(value) ? `{${value}}` : `"${value}"`
      return `${prefix}${attr.replace(
        /-([a-z])/gi,
        (_, letter: string) => `${letter.toUpperCase()}`
      )}=${jsxValue}`
    }
  )
  navigator.clipboard.writeText(jsx).then(() => {
    console.log('Copied JSX:', jsx)
  })
})

window.addEventListener('keydown', (e) => {
  const target = e.target as HTMLElement
  if (
    e.key !== '/' ||
    target.tagName === 'INPUT' ||
    target.tagName === 'SELECT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  ) {
    return
  }
  e.preventDefault()
  $searchInput.focus()
})
