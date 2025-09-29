import { getLangFromUrl, useTranslations } from '../i18n/utils'

const lang = getLangFromUrl(new URL(window.location.href)) || 'en'
const t = useTranslations(lang)
const codeNodes = document.querySelectorAll('pre:not([data-language="plaintext"])>code')

codeNodes.forEach(node => {
  let timeoutId
  const preHeader = document.createElement('div')
  const previousDomNode = node.parentElement.previousElementSibling
  const isPreTitle = previousDomNode
    && previousDomNode.tagName === 'P'
    && previousDomNode.children.length === 1
    && previousDomNode.querySelector('strong')
  if (isPreTitle) {
    preHeader.appendChild(previousDomNode)
  }
  const button = document.createElement('button')
  preHeader.className = 'pre-header'
  button.className = 'copy-button'
  button.innerText = t('copy')
  button.onclick = () => {
    navigator.clipboard.writeText(node.innerText)
    button.toggleAttribute('disabled')
    button.innerText = t('copied')

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      button.innerText = t('copy')
      button.toggleAttribute('disabled')
      timeoutId = null
    }, 2000)
  }
  preHeader.appendChild(button)
  node.parentNode.parentNode.insertBefore(preHeader, node.parentNode)
})
