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

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

const createCategory = async (name, description) => {
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING id;
    `;

    const queryParams = [name, description];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0].id);
    }

    return result.rows[0].id;
};

const updateCategory = async (categoryId, name, description) => {
  const query = `
    UPDATE categories
    SET name = $1, description = $2
    WHERE id = $3
    RETURNING id;
  `;

  const queryParams = [name, description, categoryId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated category with ID:', categoryId);
  }

  return result.rows[0].id;
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId, assignCategoryToProject, updateCategoryAssignments, createCategory, updateCategory };

