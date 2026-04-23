import { translateChatRequest } from "./translationLayer";
import {
  getStandardStock,
  getIndependentStock,
  getTopProducts,
  getTopCompanies
} from "@/lib/chatbi/queryEngine";

export async function chatCore(body) {
  const parsed = translateChatRequest(body);

  switch (parsed.intent) {
  case "GET_STANDARD_STOCK":
    return { answer: await getStandardStock(parsed.key) };

  case "GET_INDEPENDENT_STOCK":
    return { answer: await getIndependentStock(parsed.key) };

  case "GET_TOP_PRODUCTS":
    return { answer: await getTopProducts(parsed.topN) };

  case "GET_TOP_COMPANIES":
    return { answer: await getTopCompanies(parsed.topN) };

  default:
    return { answer: "Unknown request" };
}
}