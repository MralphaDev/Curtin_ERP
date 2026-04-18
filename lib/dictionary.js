import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

export function getDictionary(locale) {
  return locale === "zh" ? zh : en;
}