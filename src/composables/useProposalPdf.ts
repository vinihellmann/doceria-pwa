import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { PDFFont, PDFPage } from 'pdf-lib'
import type { Proposal } from '@/types/proposal'
import { formatCurrency } from '@/utils/currency'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 42
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const IMAGE_AREA_HEIGHT = 260
const TITLE_SIZE = 20
const SUBTITLE_SIZE = 11
const BODY_SIZE = 11
const SMALL_SIZE = 10
const LINE_GAP = 4

type PdfFonts = {
  title: PDFFont
  body: PDFFont
}

function sanitizeFileName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const normalized = (text || '').replace(/\s+/g, ' ').trim()
  if (!normalized) return []

  const words = normalized.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const testWidth = font.widthOfTextAtSize(testLine, size)

    if (testWidth <= maxWidth) {
      currentLine = testLine
      continue
    }

    if (!currentLine) {
      lines.push(word)
      continue
    }

    lines.push(currentLine)
    currentLine = word
  }

  if (currentLine) lines.push(currentLine)
  return lines
}

function drawTextBlock(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  x: number,
  topY: number,
  maxWidth: number,
  color = rgb(0.23, 0.06, 0.15)
) {
  const lines = wrapText(text, font, size, maxWidth)
  const lineHeight = size + LINE_GAP

  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: topY - size - index * lineHeight,
      size,
      font,
      color
    })
  })

  return lines.length * lineHeight
}

async function embedImage(pdfDoc: PDFDocument, imageDataUrl: string) {
  if (imageDataUrl.startsWith('data:image/png')) {
    return pdfDoc.embedPng(imageDataUrl)
  }

  if (imageDataUrl.startsWith('data:image/jpeg') || imageDataUrl.startsWith('data:image/jpg')) {
    return pdfDoc.embedJpg(imageDataUrl)
  }

  return null
}

function drawCoverBar(page: PDFPage, title: string, subtitle: string, fonts: PdfFonts) {
  page.drawRectangle({
    x: MARGIN,
    y: PAGE_HEIGHT - MARGIN - 76,
    width: CONTENT_WIDTH,
    height: 76,
    color: rgb(0.98, 0.9, 0.96),
    borderColor: rgb(0.95, 0.83, 0.91),
    borderWidth: 1
  })

  page.drawText(title, {
    x: MARGIN + 18,
    y: PAGE_HEIGHT - MARGIN - 30,
    size: TITLE_SIZE,
    font: fonts.title,
    color: rgb(0.45, 0.1, 0.33)
  })

  page.drawText(subtitle, {
    x: MARGIN + 18,
    y: PAGE_HEIGHT - MARGIN - 52,
    size: SUBTITLE_SIZE,
    font: fonts.body,
    color: rgb(0.42, 0.23, 0.33)
  })
}

function drawFooter(page: PDFPage, label: string, font: PDFFont) {
  page.drawLine({
    start: { x: MARGIN, y: 28 },
    end: { x: PAGE_WIDTH - MARGIN, y: 28 },
    thickness: 1,
    color: rgb(0.93, 0.83, 0.89)
  })

  page.drawText(label, {
    x: MARGIN,
    y: 12,
    size: SMALL_SIZE,
    font,
    color: rgb(0.55, 0.33, 0.46)
  })
}

async function drawProposalItemPage(
  pdfDoc: PDFDocument,
  fonts: PdfFonts,
  proposal: Proposal,
  item: Proposal['items'][number],
  index: number,
  totalPages: number
) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])

  drawCoverBar(
    page,
    item.candyName,
    `Item ${index + 1} de ${totalPages} · Quantidade ${item.quantity} · ${formatCurrency(item.unitPrice * item.quantity)}`,
    fonts
  )

  let currentTop = PAGE_HEIGHT - MARGIN - 102

  page.drawText('Imagem do doce', {
    x: MARGIN,
    y: currentTop,
    size: SUBTITLE_SIZE,
    font: fonts.title,
    color: rgb(0.45, 0.1, 0.33)
  })

  const imageY = currentTop - IMAGE_AREA_HEIGHT - 14
  page.drawRectangle({
    x: MARGIN,
    y: imageY,
    width: CONTENT_WIDTH,
    height: IMAGE_AREA_HEIGHT,
    color: rgb(0.995, 0.97, 0.99),
    borderColor: rgb(0.95, 0.83, 0.91),
    borderWidth: 1
  })

  if (item.imageDataUrl) {
    const embeddedImage = await embedImage(pdfDoc, item.imageDataUrl)

    if (embeddedImage) {
      const dimensions = embeddedImage.scaleToFit(CONTENT_WIDTH - 24, IMAGE_AREA_HEIGHT - 24)
      const imageX = MARGIN + (CONTENT_WIDTH - dimensions.width) / 2
      const finalY = imageY + (IMAGE_AREA_HEIGHT - dimensions.height) / 2

      page.drawImage(embeddedImage, {
        x: imageX,
        y: finalY,
        width: dimensions.width,
        height: dimensions.height
      })
    } else {
      page.drawText('Formato de imagem não suportado no PDF. Cadastre JPG ou PNG.', {
        x: MARGIN + 20,
        y: imageY + IMAGE_AREA_HEIGHT / 2,
        size: BODY_SIZE,
        font: fonts.body,
        color: rgb(0.55, 0.33, 0.46)
      })
    }
  } else {
    page.drawText('Sem foto cadastrada para este doce.', {
      x: MARGIN + 20,
      y: imageY + IMAGE_AREA_HEIGHT / 2,
      size: BODY_SIZE,
      font: fonts.body,
      color: rgb(0.55, 0.33, 0.46)
    })
  }

  currentTop = imageY - 24

  page.drawText('Descrição', {
    x: MARGIN,
    y: currentTop,
    size: SUBTITLE_SIZE,
    font: fonts.title,
    color: rgb(0.45, 0.1, 0.33)
  })

  const descriptionHeight = drawTextBlock(
    page,
    item.description || 'Sem descrição cadastrada.',
    fonts.body,
    BODY_SIZE,
    MARGIN,
    currentTop - 8,
    CONTENT_WIDTH
  )

  currentTop = currentTop - 16 - descriptionHeight - 12

  page.drawText('Ingredientes', {
    x: MARGIN,
    y: currentTop,
    size: SUBTITLE_SIZE,
    font: fonts.title,
    color: rgb(0.45, 0.1, 0.33)
  })

  if (item.ingredients.length) {
    let ingredientsTop = currentTop - 8

    item.ingredients.forEach((ingredient) => {
      page.drawCircle({
        x: MARGIN + 4,
        y: ingredientsTop - BODY_SIZE / 2,
        size: 2.8,
        color: rgb(0.64, 0.11, 0.69)
      })

      const usedHeight = drawTextBlock(
        page,
        ingredient,
        fonts.body,
        BODY_SIZE,
        MARGIN + 14,
        ingredientsTop,
        CONTENT_WIDTH - 14
      )

      ingredientsTop -= usedHeight + 4
    })
  } else {
    drawTextBlock(
      page,
      'Nenhum ingrediente informado.',
      fonts.body,
      BODY_SIZE,
      MARGIN,
      currentTop - 8,
      CONTENT_WIDTH,
      rgb(0.55, 0.33, 0.46)
    )
  }

  drawFooter(page, `${proposal.title} · ${formatCurrency(proposal.total)}`, fonts.body)
}

async function drawSummaryPage(pdfDoc: PDFDocument, fonts: PdfFonts, proposal: Proposal) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])

  drawCoverBar(
    page,
    'Resumo da proposta',
    `${proposal.title} · ${new Date(proposal.createdAt).toLocaleString('pt-BR')}`,
    fonts
  )

  let currentTop = PAGE_HEIGHT - MARGIN - 112

  const totalUnits = proposal.items.reduce((acc, item) => acc + item.quantity, 0)
  const summaryCards = [
    { label: 'Tipos de doces', value: String(proposal.items.length) },
    { label: 'Unidades na proposta', value: String(totalUnits) },
    { label: 'Valor final', value: formatCurrency(proposal.total) }
  ]

  summaryCards.forEach((entry, index) => {
    const cardWidth = (CONTENT_WIDTH - 20) / 3
    const x = MARGIN + index * (cardWidth + 10)

    page.drawRectangle({
      x,
      y: currentTop - 70,
      width: cardWidth,
      height: 70,
      color: rgb(0.995, 0.97, 0.99),
      borderColor: rgb(0.95, 0.83, 0.91),
      borderWidth: 1
    })

    page.drawText(entry.label, {
      x: x + 12,
      y: currentTop - 25,
      size: SMALL_SIZE,
      font: fonts.body,
      color: rgb(0.55, 0.33, 0.46)
    })

    page.drawText(entry.value, {
      x: x + 12,
      y: currentTop - 52,
      size: 16,
      font: fonts.title,
      color: rgb(0.45, 0.1, 0.33)
    })
  })

  currentTop -= 98

  page.drawText('Itens incluídos', {
    x: MARGIN,
    y: currentTop,
    size: SUBTITLE_SIZE,
    font: fonts.title,
    color: rgb(0.45, 0.1, 0.33)
  })

  currentTop -= 16

  proposal.items.forEach((item) => {
    page.drawRectangle({
      x: MARGIN,
      y: currentTop - 44,
      width: CONTENT_WIDTH,
      height: 44,
      color: rgb(1, 1, 1),
      borderColor: rgb(0.95, 0.83, 0.91),
      borderWidth: 1
    })

    page.drawText(`${item.candyName} × ${item.quantity}`, {
      x: MARGIN + 12,
      y: currentTop - 27,
      size: BODY_SIZE,
      font: fonts.title,
      color: rgb(0.23, 0.06, 0.15)
    })

    page.drawText(formatCurrency(item.unitPrice * item.quantity), {
      x: PAGE_WIDTH - MARGIN - 110,
      y: currentTop - 27,
      size: BODY_SIZE,
      font: fonts.title,
      color: rgb(0.49, 0.18, 0.08)
    })

    currentTop -= 54
  })

  page.drawRectangle({
    x: MARGIN,
    y: 72,
    width: CONTENT_WIDTH,
    height: 54,
    color: rgb(0.98, 0.9, 0.96),
    borderColor: rgb(0.95, 0.83, 0.91),
    borderWidth: 1
  })

  page.drawText('Total final da proposta', {
    x: MARGIN + 16,
    y: 103,
    size: SMALL_SIZE,
    font: fonts.body,
    color: rgb(0.55, 0.33, 0.46)
  })

  page.drawText(formatCurrency(proposal.total), {
    x: MARGIN + 16,
    y: 82,
    size: 20,
    font: fonts.title,
    color: rgb(0.49, 0.18, 0.08)
  })

  drawFooter(page, 'Documento gerado localmente no navegador', fonts.body)
}

function downloadPdf(bytes: Uint8Array, proposalTitle: string) {
  const arrayBuffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(arrayBuffer).set(bytes)

  const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const safeName = sanitizeFileName(proposalTitle || 'proposta-doceria')

  anchor.href = url
  anchor.download = `${safeName || 'proposta-doceria'}.pdf`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export function useProposalPdf() {
  async function generateProposalPdf(proposal: Proposal) {
    if (!proposal.items.length) {
      throw new Error('Adicione ao menos um doce na proposta antes de gerar o PDF.')
    }

    const pdfDoc = await PDFDocument.create()
    const fonts: PdfFonts = {
      title: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      body: await pdfDoc.embedFont(StandardFonts.Helvetica)
    }

    pdfDoc.setTitle(proposal.title)
    pdfDoc.setAuthor('Doceria PWA')
    pdfDoc.setCreator('Doceria PWA Prototype')
    pdfDoc.setProducer('pdf-lib')
    pdfDoc.setLanguage('pt-BR')
    pdfDoc.setCreationDate(new Date(proposal.createdAt))
    pdfDoc.setModificationDate(new Date())
    pdfDoc.setKeywords(['doceria', 'proposta', 'pwa', 'catalogo'])

    for (let index = 0; index < proposal.items.length; index += 1) {
      await drawProposalItemPage(pdfDoc, fonts, proposal, proposal.items[index], index, proposal.items.length)
    }

    await drawSummaryPage(pdfDoc, fonts, proposal)

    const pdfBytes = await pdfDoc.save()
    downloadPdf(pdfBytes, proposal.title)

    return pdfBytes
  }

  return {
    generateProposalPdf
  }
}
