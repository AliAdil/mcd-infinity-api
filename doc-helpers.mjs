import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
  Header,
  Footer,
  PageNumber
} from 'docx';

console.log('Starting MCD Infinity API Documentation generator...');

// Color Palette Constants
const COLOR_PRIMARY = '1E3A8A';    // Deep Navy
const COLOR_SECONDARY = '0284C7';  // Ocean Blue
const COLOR_DARK = '1F2937';       // Charcoal text
const COLOR_MUTED = '6B7280';      // Gray
const COLOR_LIGHT_BG = 'F8FAFC';   // Off-white / light slate
const COLOR_HEADER_BG = '1E293B';  // Dark Slate
const COLOR_CODE_BG = 'F1F5F9';    // Code background
const COLOR_SUCCESS = '10B981';    // Emerald
const COLOR_WARNING = 'F59E0B';    // Amber
const COLOR_BORDER = 'E2E8F0';     // Light Border

// Border helpers
const thinBorder = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: COLOR_BORDER
};
const tableBorders = {
  top: thinBorder,
  bottom: thinBorder,
  left: thinBorder,
  right: thinBorder,
  insideHorizontal: thinBorder,
  insideVertical: thinBorder
};

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 }
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 }
  });
}

function createHeading3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 }
  });
}

function createPara(text, options = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    alignment: options.alignment || AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        color: options.color || COLOR_DARK,
        bold: Boolean(options.bold),
        italics: Boolean(options.italics),
        size: options.size || 22 // 11pt
      })
    ]
  });
}

function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix + ' ', bold: true, color: COLOR_DARK, size: 22 }));
  }
  children.push(new TextRun({ text, color: COLOR_DARK, size: 22 }));
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children
  });
}

function createCodeBlock(codeLines) {
  const lines = Array.isArray(codeLines) ? codeLines : codeLines.split('\n');
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 18, color: COLOR_SECONDARY },
      right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: COLOR_CODE_BG, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: lines.map(line => new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: line,
                  font: 'Consolas',
                  size: 19, // 9.5pt
                  color: '0F172A'
                })
              ]
            }))
          })
        ]
      })
    ]
  });
}

function createCallout(title, bodyText, type = 'info') {
  let borderColor = COLOR_SECONDARY;
  let bgFill = 'F0F9FF';
  let titleColor = '0369A1';
  if (type === 'success') {
    borderColor = COLOR_SUCCESS;
    bgFill = 'ECFDF5';
    titleColor = '047857';
  } else if (type === 'warning') {
    borderColor = COLOR_WARNING;
    bgFill = 'FFFBEB';
    titleColor = 'B45309';
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
      left: { style: BorderStyle.SINGLE, size: 24, color: borderColor },
      right: { style: BorderStyle.SINGLE, size: 4, color: borderColor }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: bgFill, type: ShadingType.CLEAR },
            margins: { top: 140, bottom: 140, left: 180, right: 180 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: title, bold: true, color: titleColor, size: 22 })
                ]
              }),
              new Paragraph({
                spacing: { after: 0 },
                children: [
                  new TextRun({ text: bodyText, color: COLOR_DARK, size: 21 })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

function createStyledTable(headers, rowsData, colWidths = []) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      width: colWidths[i] ? { size: colWidths[i], type: WidthType.PERCENTAGE } : undefined,
      shading: { fill: COLOR_HEADER_BG, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 20 })
          ]
        })
      ]
    }))
  });

  const bodyRows = rowsData.map((row, rIdx) => new TableRow({
    children: row.map((cellText, cIdx) => new TableCell({
      width: colWidths[cIdx] ? { size: colWidths[cIdx], type: WidthType.PERCENTAGE } : undefined,
      shading: { fill: rIdx % 2 === 0 ? 'FFFFFF' : COLOR_LIGHT_BG, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: String(cellText), color: COLOR_DARK, size: 20 })
          ]
        })
      ]
    }))
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [headerRow, ...bodyRows]
  });
}

// Sequence diagram box representation
function createSequenceDiagramBox(title, steps) {
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          columnSpan: 4,
          shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `SEQUENCE FLOW: ${title}`, bold: true, color: 'FFFFFF', size: 22 })
              ]
            })
          ]
        })
      ]
    }),
    new TableRow({
      tableHeader: true,
      children: ['Step #', 'Source ➔ Target', 'Operation / Message', 'Payload & Protocol Details'].map(h => new TableCell({
        shading: { fill: COLOR_HEADER_BG, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 19 })] })]
      }))
    })
  ];

  steps.forEach((step, idx) => {
    tableRows.push(new TableRow({
      children: [
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          shading: { fill: idx % 2 === 0 ? 'FFFFFF' : COLOR_LIGHT_BG, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: String(step.step), bold: true, color: COLOR_PRIMARY, size: 19 })] })]
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: idx % 2 === 0 ? 'FFFFFF' : COLOR_LIGHT_BG, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: step.flow, bold: true, color: COLOR_SECONDARY, size: 19 })] })]
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { fill: idx % 2 === 0 ? 'FFFFFF' : COLOR_LIGHT_BG, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: step.operation, bold: true, color: COLOR_DARK, size: 19 })] })]
        }),
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          shading: { fill: idx % 2 === 0 ? 'FFFFFF' : COLOR_LIGHT_BG, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: step.details, color: COLOR_DARK, size: 18 })] })]
        })
      ]
    }));
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: tableRows
  });
}

export {
  createHeading1,
  createHeading2,
  createHeading3,
  createPara,
  createBullet,
  createCodeBlock,
  createCallout,
  createStyledTable,
  createSequenceDiagramBox,
  Document,
  Packer,
  Paragraph,
  TextRun,
  Header,
  Footer,
  PageNumber,
  HeadingLevel,
  AlignmentType,
  WidthType
};
