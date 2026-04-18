export function validateValveBody(data) {
  const { model_number, category } = data;

  if (!model_number  || !category) {
    throw new Error("Missing required fields");
  }

  return true;
}