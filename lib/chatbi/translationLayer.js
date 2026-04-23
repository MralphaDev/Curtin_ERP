export function translateChatRequest(body) {
  if (body.category === "inventory") {
    if (body.type === "standard") {
      return { intent: "GET_STANDARD_STOCK", key: body.key };
    }

    if (body.type === "independent") {
      return { intent: "GET_INDEPENDENT_STOCK", key: body.key };
    }
  }

  if (body.category === "sales") {
    if (body.type === "topProducts") {
      return { intent: "GET_TOP_PRODUCTS", topN: body.topN };
    }

    if (body.type === "topCompanies") {
      return { intent: "GET_TOP_COMPANIES", topN: body.topN };
    }
  }

  return { intent: "UNKNOWN" };
}