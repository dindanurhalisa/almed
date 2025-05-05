const createSlugFromName = (name: string) =>
  name.replace(/\s/g, "-").toLowerCase();

export { createSlugFromName };
