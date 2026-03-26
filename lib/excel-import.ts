import { read, utils } from "xlsx";
import {
  DEFAULT_REFERENCE_PROJECT,
  inferCostCategoryFromText,
  type CostCategory,
  type ReferenceProject,
  type ReferenceProjectItem,
} from "@/lib/estimator";

type ParsedRow = {
  name: string;
  category: CostCategory;
  amountEok: number;
  note?: string;
};

const HEADER_KEYWORDS = {
  name: ["item", "name", "description", "품명", "항목", "내역", "공종", "내용", "scope"],
  category: ["category", "type", "분류", "구분", "대분류", "spc", "s/p/c"],
  amount: ["amount", "cost", "price", "금액", "합계", "공사비", "원", "total", "epc"],
  note: ["note", "remark", "비고", "사유", "근거", "comment"],
};

function normalizeText(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function normalizeHeader(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function parseNumeric(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const text = normalizeText(value);
  if (!text) return null;

  const normalized = text
    .replace(/,/g, "")
    .replace(/원/g, "")
    .replace(/krw/gi, "")
    .replace(/\(([^)]+)\)/g, "-$1")
    .replace(/[^\d.-]/g, "");

  if (!normalized || normalized === "-" || normalized === ".") return null;

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function chooseHeaderRow(rows: unknown[][]) {
  let bestIndex = 0;
  let bestScore = -1;

  rows.slice(0, 12).forEach((row, index) => {
    const normalizedRow = row.map(normalizeHeader);
    const score = normalizedRow.reduce((sum, cell) => {
      if (!cell) return sum;

      let hit = 0;
      if (HEADER_KEYWORDS.name.some((keyword) => cell.includes(keyword))) hit += 2;
      if (HEADER_KEYWORDS.category.some((keyword) => cell.includes(keyword))) hit += 2;
      if (HEADER_KEYWORDS.amount.some((keyword) => cell.includes(keyword))) hit += 3;
      if (HEADER_KEYWORDS.note.some((keyword) => cell.includes(keyword))) hit += 1;
      return sum + hit;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function findColumn(headers: string[], bucket: keyof typeof HEADER_KEYWORDS) {
  return headers.findIndex((header) =>
    HEADER_KEYWORDS[bucket].some((keyword) => header.includes(keyword)),
  );
}

function findFallbackTextColumn(rows: unknown[][], startIndex: number) {
  const maxCols = Math.max(...rows.slice(startIndex, startIndex + 12).map((row) => row.length), 0);
  let bestColumn = 0;
  let bestScore = -1;

  for (let column = 0; column < maxCols; column += 1) {
    const score = rows.slice(startIndex, startIndex + 18).reduce((sum, row) => {
      const text = normalizeText(row[column]);
      return sum + (text && parseNumeric(text) === null ? text.length : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestColumn = column;
    }
  }

  return bestColumn;
}

function findFallbackAmountColumn(rows: unknown[][], startIndex: number) {
  const maxCols = Math.max(...rows.slice(startIndex, startIndex + 12).map((row) => row.length), 0);
  let bestColumn = 0;
  let bestScore = -1;

  for (let column = 0; column < maxCols; column += 1) {
    const score = rows.slice(startIndex, startIndex + 18).reduce((sum, row) => {
      const value = parseNumeric(row[column]);
      return sum + (value === null ? 0 : 1);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestColumn = column;
    }
  }

  return bestColumn;
}

function convertAmountToEok(rawAmount: number, context: string) {
  const magnitude = Math.abs(rawAmount);

  if (/(억원|eok|100m)/i.test(context)) return magnitude;
  if (/(백만원|million)/i.test(context)) return magnitude / 100;
  if (/(천원)/i.test(context)) return magnitude / 100_000;
  if (/(원|krw)/i.test(context) && magnitude >= 1_000_000) return magnitude / 100_000_000;
  if (magnitude >= 100_000_000) return magnitude / 100_000_000;
  if (magnitude >= 10_000) return magnitude / 100;
  return magnitude;
}

function extractWorkbookCorpus(
  fileName: string,
  rowsBySheet: Array<{ sheetName: string; rows: unknown[][] }>,
) {
  const texts = [fileName];

  rowsBySheet.forEach(({ sheetName, rows }) => {
    texts.push(sheetName);
    rows.slice(0, 20).forEach((row) => {
      row.forEach((cell) => {
        const text = normalizeText(cell);
        if (text) texts.push(text);
      });
    });
  });

  return texts.join(" ");
}

function parseSheetRows(sheetName: string, rows: unknown[][]) {
  if (rows.length === 0) return [] as ParsedRow[];

  const headerRowIndex = chooseHeaderRow(rows);
  const headers = rows[headerRowIndex].map(normalizeHeader);
  const dataStart = headerRowIndex + 1;
  const nameColumn =
    findColumn(headers, "name") >= 0
      ? findColumn(headers, "name")
      : findFallbackTextColumn(rows, dataStart);
  const amountColumn =
    findColumn(headers, "amount") >= 0
      ? findColumn(headers, "amount")
      : findFallbackAmountColumn(rows, dataStart);
  const categoryColumn = findColumn(headers, "category");
  const noteColumn = findColumn(headers, "note");
  const amountHeader = headers[amountColumn] ?? "";

  const parsed = rows
    .slice(dataStart)
    .map((row) => {
      const name = normalizeText(row[nameColumn]);
      const rawAmount = parseNumeric(row[amountColumn]);
      const note = noteColumn >= 0 ? normalizeText(row[noteColumn]) : "";
      const categoryText =
        categoryColumn >= 0 ? normalizeText(row[categoryColumn]) : `${name} ${note}`;

      if (!name || rawAmount === null || rawAmount === 0) return null;

      const loweredName = name.toLowerCase();
      if (/(total|subtotal|합계|총계)/i.test(loweredName)) return null;

      return {
        name,
        category: inferCostCategoryFromText(categoryText),
        amountEok: convertAmountToEok(rawAmount, `${amountHeader} ${note} ${sheetName}`),
        note: [sheetName, note].filter(Boolean).join(" / "),
      };
    })
    .filter(Boolean) as ParsedRow[];

  return parsed;
}

function createReferenceProjectId(fileName: string) {
  const normalized = fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `ref-${normalized || "project"}-${Date.now().toString(36)}`;
}

export async function importReferenceWorkbook(file: File): Promise<ReferenceProject> {
  const buffer = await file.arrayBuffer();
  const workbook = read(buffer, {
    type: "array",
    dense: true,
    cellDates: false,
  });

  const rowsBySheet = workbook.SheetNames.map((sheetName) => ({
    sheetName,
    rows: utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    }) as unknown[][],
  }));

  const items = rowsBySheet.flatMap(({ sheetName, rows }) => parseSheetRows(sheetName, rows));

  if (items.length === 0) {
    throw new Error("No itemized cost rows could be detected in the uploaded workbook.");
  }

  const filteredItems = items
    .filter((item) => item.amountEok > 0)
    .map<ReferenceProjectItem>((item, index) => ({
      code: `${item.category}-${String(index + 1).padStart(3, "0")}`,
      name: item.name,
      category: item.category,
      amountEok: Number(item.amountEok.toFixed(4)),
      note: item.note,
    }));

  const totalEok = Number(
    filteredItems.reduce((sum, item) => sum + item.amountEok, 0).toFixed(2),
  );

  const corpus = extractWorkbookCorpus(file.name, rowsBySheet);
  const capacityMatch = corpus.match(/(\d+(?:\.\d+)?)\s*mw/i);
  const yearMatch = corpus.match(/20\d{2}/);
  const fallbackName = file.name.replace(/\.[^.]+$/, "");

  return {
    id: createReferenceProjectId(file.name),
    name: fallbackName,
    source: "excel-upload",
    sourceFileName: file.name,
    referenceYear: yearMatch ? Number(yearMatch[0]) : DEFAULT_REFERENCE_PROJECT.referenceYear,
    referenceCapacityMw: capacityMatch
      ? Number(capacityMatch[1])
      : DEFAULT_REFERENCE_PROJECT.referenceCapacityMw,
    totalEok,
    items: filteredItems,
    notes: [
      `Imported from ${file.name}`,
      `${rowsBySheet.length} worksheet(s) scanned`,
      "Metadata was inferred from workbook text. Verify year and MW before final use.",
    ],
  };
}
