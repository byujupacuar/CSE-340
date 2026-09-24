import db from "./db.js";

const getAllProjects = async () => {
  const query = `
      SELECT 
      id,
      title,
      description,
      location,
      project_date,
      status
    FROM service_projects;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM service_projects
        WHERE organization_id = $1
        ORDER BY project_date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT
      sp.id,
      sp.title,
      sp.description,
      sp.project_date,
      sp.location,
      sp.organization_id,
      o.name
    FROM service_projects sp
    JOIN organizations o ON sp.organization_id = o.id
    WHERE sp.project_date >= CURRENT_DATE
    ORDER BY sp.project_date ASC
    LIMIT $1;
  `;

  const queryParams = [number_of_projects];
  const result = await db.query(query, queryParams);

  return result.rows;
};


const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT sp.id, sp.title, sp.description, sp.location, sp.project_date, sp.status
    FROM service_projects sp
    JOIN project_categories pc ON pc.project_id = sp.id
    WHERE pc.category_id = $1
    ORDER BY sp.project_date;
  `;
  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);
  return result.rows;
};

const createProject = async (title, description, location, projectDate, status, organizationId, categoryId = null) => {
    const query = `
      INSERT INTO service_projects (title, description, location, project_date, status, organization_id, category_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;

    const queryParams = [title, description, location, projectDate, status, organizationId, categoryId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }
    const newProjectId = result.rows[0].id;

    // Reflejar también la categoría en la tabla intermedia project_categories
    if (categoryId) {
        await db.query(
            `INSERT INTO project_categories (project_id, category_id)
             VALUES ($1, $2)
             ON CONFLICT (project_id, category_id) DO NOTHING;`,
            [newProjectId, categoryId]
        );
    }
    
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].id);
    }

    return result.rows[0].id;
}

const getProjectDetails = async (projectId) => {  
  const query = `
    SELECT
      sp.id,
      sp.title,
      sp.description,
      sp.project_date,
      sp.location,
      sp.status,
      sp.organization_id,
      sp.category_id,
      o.name
    FROM service_projects sp
    JOIN organizations o ON sp.organization_id = o.id
    WHERE sp.id = $1;
  `;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const updateProject = async (projectId, title, description, location, projectDate, status, organizationId, categoryId = null) => {
    const query = `
      UPDATE service_projects
      SET title = $1, description = $2, location = $3, project_date = $4, status = $5, organization_id = $6, category_id = $7
      WHERE id = $8
      RETURNING id;
    `;

    const queryParams = [title, description, location, projectDate, status, organizationId, categoryId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
    }

    return result.rows[0].id;
};

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getProjectsByCategoryId, createProject, updateProject };


