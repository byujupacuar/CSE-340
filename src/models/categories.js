import db from "./db.js";

const getAllCategories = async () => {
  const query = `
    SELECT id, name, description
    FROM public.categories;
  `;

  const result = await db.query(query);

  return result.rows;
};

export { getAllCategories };