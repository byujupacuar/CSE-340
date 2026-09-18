import db from "./db.js";

const getAllCategories = async () => {
  const query = `
    SELECT id, name, description
    FROM public.categories;
  `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoryById = async (categoryId) => {
  const query = `
    SELECT id, name, description
    FROM categories
    WHERE id = $1;
  `;
  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT c.id, c.name, c.description
    FROM categories c
    JOIN project_categories pc ON pc.category_id = c.id
    WHERE pc.project_id = $1;
  `;
  const queryParams = [projectId];
  const result = await db.query(query, queryParams);
  return result.rows;
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId };

