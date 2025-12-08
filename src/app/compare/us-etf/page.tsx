import type { Metadata } from "next";
import { USETFContent } from "./USETFContent";

export const metadata: Metadata = {
  title: "미국 S&P500 ETF 비교 - SPY vs VOO vs IVV",
  description:
    "SPY, VOO, IVV, SPYM 등 미국 상장 S&P500 ETF를 보수율, 거래량, 수익률 기준으로 비교합니다.",
  openGraph: {
    title: "미국 S&P500 ETF 비교",
    description: "SPY vs VOO vs IVV - 어떤 ETF가 나에게 맞을까?",
  },
};

export default function USETFPage() {
  return <USETFContent />;
}
