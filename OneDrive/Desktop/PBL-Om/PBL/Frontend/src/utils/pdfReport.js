const escapePdfText = (text) =>
  String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const textCmd = ({ x, y, text, font = "F1", size = 12, color = "0 0 0" }) =>
  `BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm (${escapePdfText(text)}) Tj ET`;

const rectCmd = ({ x, y, width, height, fill }) =>
  `${fill} rg ${x} ${y} ${width} ${height} re f`;

const lineCmd = ({ x1, y1, x2, y2, stroke = "0.85 0.75 0.8", width = 1 }) =>
  `${stroke} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`;

const buildSummaryRows = (inputSummary) => {
  const rows = [];
  let y = 618;

  inputSummary.slice(0, 14).forEach((item, index) => {
    const background = index % 2 === 0 ? "0.996 0.968 0.98" : "0.986 0.925 0.949";
    rows.push(rectCmd({ x: 46, y: y - 8, width: 520, height: 18, fill: background }));
    rows.push(textCmd({ x: 54, y, text: item.label, size: 10, color: "0.42 0.18 0.29" }));
    rows.push(textCmd({ x: 260, y, text: String(item.value), size: 10, color: "0.28 0.12 0.19" }));
    rows.push(textCmd({ x: 404, y, text: item.range, size: 10, color: "0.49 0.3 0.37" }));
    y -= 20;
  });

  return rows;
};

const buildRiskRows = (results) => {
  const commands = [];
  let y = 252;

  Object.entries(results).forEach(([key, value], index) => {
    if (!value) {
      return;
    }
    const diseaseName = key === "pcos" ? "PCOS" : key[0].toUpperCase() + key.slice(1);
    const background = index % 2 === 0 ? "0.998 0.949 0.968" : "0.986 0.925 0.949";
    commands.push(rectCmd({ x: 46, y: y - 8, width: 520, height: 24, fill: background }));
    commands.push(textCmd({ x: 56, y, text: diseaseName, size: 12, font: "F2", color: "0.49 0.16 0.31" }));
    commands.push(textCmd({ x: 230, y, text: `${value.probability}%`, size: 12, color: "0.77 0.25 0.47" }));
    commands.push(textCmd({ x: 380, y, text: value.risk, size: 12, color: "0.4 0.18 0.28" }));
    y -= 28;
  });

  return commands;
};

const buildPageOneStream = ({ gender, inputSummary, results }) => {
  const commands = [
    rectCmd({ x: 0, y: 720, width: 612, height: 72, fill: "0.83 0.29 0.52" }),
    rectCmd({ x: 420, y: 700, width: 160, height: 92, fill: "0.96 0.68 0.79" }),
    textCmd({ x: 46, y: 754, text: "HormoAI Health Report", font: "F2", size: 22, color: "1 1 1" }),
    textCmd({ x: 46, y: 734, text: "Predictive screening summary with visual risk insights", size: 11, color: "0.99 0.93 0.96" }),

    rectCmd({ x: 36, y: 650, width: 540, height: 46, fill: "0.996 0.94 0.965" }),
    textCmd({ x: 48, y: 676, text: "Profile", font: "F2", size: 13, color: "0.58 0.18 0.36" }),
    textCmd({ x: 48, y: 658, text: `Gender: ${gender}`, size: 11, color: "0.35 0.13 0.23" }),

    textCmd({ x: 46, y: 632, text: "User Input Summary", font: "F2", size: 16, color: "0.58 0.18 0.36" }),
    rectCmd({ x: 46, y: 600, width: 520, height: 22, fill: "0.92 0.47 0.65" }),
    textCmd({ x: 54, y: 607, text: "Parameter", font: "F2", size: 10, color: "1 1 1" }),
    textCmd({ x: 260, y: 607, text: "Observed Value", font: "F2", size: 10, color: "1 1 1" }),
    textCmd({ x: 404, y: 607, text: "Normal Range", font: "F2", size: 10, color: "1 1 1" }),
    ...buildSummaryRows(inputSummary),

    textCmd({ x: 46, y: 282, text: "Risk Assessment", font: "F2", size: 16, color: "0.58 0.18 0.36" }),
    rectCmd({ x: 46, y: 262, width: 520, height: 20, fill: "0.92 0.47 0.65" }),
    textCmd({ x: 56, y: 268, text: "Disease", font: "F2", size: 10, color: "1 1 1" }),
    textCmd({ x: 230, y: 268, text: "Risk Score", font: "F2", size: 10, color: "1 1 1" }),
    textCmd({ x: 380, y: 268, text: "Level", font: "F2", size: 10, color: "1 1 1" }),
    ...buildRiskRows(results),

    lineCmd({ x1: 46, y1: 58, x2: 566, y2: 58, stroke: "0.87 0.69 0.77" }),
    textCmd({ x: 46, y: 40, text: "HormoAI report generated for awareness. Not a medical diagnosis.", size: 10, color: "0.45 0.24 0.31" }),
  ];

  return commands.join("\n");
};

const buildRecommendationRows = (suggestions) => {
  const commands = [];
  let y = 620;

  Object.entries(suggestions).forEach(([key, values]) => {
    const diseaseName = key === "pcos" ? "PCOS" : key[0].toUpperCase() + key.slice(1);
    commands.push(rectCmd({ x: 46, y: y - 2, width: 520, height: 22, fill: "0.96 0.86 0.91" }));
    commands.push(textCmd({ x: 56, y: y + 4, text: `${diseaseName} Recommendations`, font: "F2", size: 12, color: "0.58 0.18 0.36" }));
    y -= 28;

    values.forEach((value) => {
      commands.push(textCmd({ x: 62, y, text: `- ${value}`, size: 10, color: "0.35 0.13 0.23" }));
      y -= 16;
    });

    y -= 10;
  });

  return commands;
};

const buildPageTwoStream = ({ suggestions }) => {
  const commands = [
    rectCmd({ x: 0, y: 720, width: 612, height: 72, fill: "0.95 0.62 0.75" }),
    textCmd({ x: 46, y: 754, text: "Lifestyle Recommendations", font: "F2", size: 22, color: "1 1 1" }),
    textCmd({ x: 46, y: 734, text: "Actionable suggestions based on the predicted risk levels", size: 11, color: "0.99 0.95 0.97" }),
    ...buildRecommendationRows(suggestions),
    rectCmd({ x: 36, y: 76, width: 540, height: 68, fill: "0.996 0.94 0.965" }),
    textCmd({ x: 50, y: 122, text: "Important Note", font: "F2", size: 13, color: "0.58 0.18 0.36" }),
    textCmd({ x: 50, y: 104, text: "This report uses predictive models for screening support.", size: 10, color: "0.35 0.13 0.23" }),
    textCmd({ x: 50, y: 88, text: "Please consult a qualified healthcare professional for diagnosis and treatment.", size: 10, color: "0.35 0.13 0.23" }),
    textCmd({ x: 50, y: 44, text: "Thank you for using HormoAI", font: "F2", size: 11, color: "0.49 0.16 0.31" }),
  ];

  return commands.join("\n");
};

export const downloadPdfReport = ({ gender, results, suggestions, inputSummary }) => {
  const pageOneStream = buildPageOneStream({ gender, inputSummary, results });
  const pageTwoStream = buildPageTwoStream({ suggestions });

  const objects = [];
  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");
  objects.push("2 0 obj << /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >> endobj");
  objects.push("3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 7 0 R >> endobj");
  objects.push("4 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 8 0 R >> endobj");
  objects.push("5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj");
  objects.push("6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj");
  objects.push(`7 0 obj << /Length ${pageOneStream.length} >> stream\n${pageOneStream}\nendstream endobj`);
  objects.push(`8 0 obj << /Length ${pageTwoStream.length} >> stream\n${pageTwoStream}\nendstream endobj`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });

  const xrefPosition = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefPosition}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "HormoAI_Report.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
