type TrendDirection = "up" | "down" | "flat";

export type MarketBoardItem = {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  unit: string;
  monthLabel: string;
  monthText: string;
  monthDirection: TrendDirection;
  yearLabel: string;
  yearText: string;
  yearDirection: TrendDirection;
  cadence: string;
  updatedAt: string;
  sourceLabel: string;
  points: number[];
  live: boolean;
};

function takeLast<T>(items: T[], count: number) {
  return items.slice(Math.max(items.length - count, 0));
}

const INTERNAL_MARKET_BOARD: MarketBoardItem[] = [
  {
    id: "construction-materials",
    title: "\uAC74\uC124\uC790\uC7AC",
    subtitle: "\uB0B4\uBD80 \uC2DC\uC138 \uC5F0\uB3D9 \uB300\uAE30",
    value: "-",
    unit: "\uB0B4\uBD80",
    monthLabel: "1\uAC1C\uC6D4 \uB300\uBE44",
    monthText: "\uC790\uB8CC \uB300\uAE30",
    monthDirection: "flat",
    yearLabel: "1\uB144 \uB300\uBE44",
    yearText: "\uC790\uB8CC \uB300\uAE30",
    yearDirection: "flat",
    cadence: "\uC0AC\uB0B4",
    updatedAt: "\uC0AC\uB0B4 \uC6B4\uC601 \uBAA8\uB4DC",
    sourceLabel: "\uB0B4\uBD80 \uC785\uB825",
    points: takeLast([98, 99, 99, 100, 100, 101, 101, 101], 24),
    live: false,
  },
  {
    id: "steel",
    title: "\uCCA0\uAC15",
    subtitle: "\uB0B4\uBD80 \uC9C0\uD45C \uB4F1\uB85D \uC804",
    value: "-",
    unit: "\uB0B4\uBD80",
    monthLabel: "1\uAC1C\uC6D4 \uB300\uBE44",
    monthText: "\uC790\uB8CC \uB300\uAE30",
    monthDirection: "flat",
    yearLabel: "1\uB144 \uB300\uBE44",
    yearText: "\uC790\uB8CC \uB300\uAE30",
    yearDirection: "flat",
    cadence: "\uC0AC\uB0B4",
    updatedAt: "\uC0AC\uB0B4 \uC6B4\uC601 \uBAA8\uB4DC",
    sourceLabel: "\uB0B4\uBD80 \uC785\uB825",
    points: takeLast([102, 102, 101, 101, 101, 100, 100, 100], 24),
    live: false,
  },
  {
    id: "concrete",
    title: "\uB808\uBBF8\uCF58",
    subtitle: "\uB0B4\uBD80 \uC9C0\uD45C \uB4F1\uB85D \uC804",
    value: "-",
    unit: "\uB0B4\uBD80",
    monthLabel: "1\uAC1C\uC6D4 \uB300\uBE44",
    monthText: "\uC790\uB8CC \uB300\uAE30",
    monthDirection: "flat",
    yearLabel: "1\uB144 \uB300\uBE44",
    yearText: "\uC790\uB8CC \uB300\uAE30",
    yearDirection: "flat",
    cadence: "\uC0AC\uB0B4",
    updatedAt: "\uC0AC\uB0B4 \uC6B4\uC601 \uBAA8\uB4DC",
    sourceLabel: "\uB0B4\uBD80 \uC785\uB825",
    points: takeLast([100, 100, 101, 101, 100, 100, 99, 99], 24),
    live: false,
  },
  {
    id: "copper",
    title: "\uAD6C\uB9AC",
    subtitle: "\uB0B4\uBD80 \uC9C0\uD45C \uB4F1\uB85D \uC804",
    value: "-",
    unit: "\uB0B4\uBD80",
    monthLabel: "1\uAC1C\uC6D4 \uB300\uBE44",
    monthText: "\uC790\uB8CC \uB300\uAE30",
    monthDirection: "flat",
    yearLabel: "1\uB144 \uB300\uBE44",
    yearText: "\uC790\uB8CC \uB300\uAE30",
    yearDirection: "flat",
    cadence: "\uC0AC\uB0B4",
    updatedAt: "\uC0AC\uB0B4 \uC6B4\uC601 \uBAA8\uB4DC",
    sourceLabel: "\uB0B4\uBD80 \uC785\uB825",
    points: takeLast([101, 100, 100, 99, 99, 100, 100, 101], 24),
    live: false,
  },
  {
    id: "fx",
    title: "\uD658\uC728",
    subtitle: "\uB0B4\uBD80 \uC9C0\uD45C \uB4F1\uB85D \uC804",
    value: "-",
    unit: "\uB0B4\uBD80",
    monthLabel: "1\uAC1C\uC6D4 \uB300\uBE44",
    monthText: "\uC790\uB8CC \uB300\uAE30",
    monthDirection: "flat",
    yearLabel: "1\uB144 \uB300\uBE44",
    yearText: "\uC790\uB8CC \uB300\uAE30",
    yearDirection: "flat",
    cadence: "\uC0AC\uB0B4",
    updatedAt: "\uC0AC\uB0B4 \uC6B4\uC601 \uBAA8\uB4DC",
    sourceLabel: "\uB0B4\uBD80 \uC785\uB825",
    points: takeLast([100, 101, 100, 100, 99, 100, 101, 101], 24),
    live: false,
  },
];

export async function getMarketBoardItems() {
  return INTERNAL_MARKET_BOARD;
}
