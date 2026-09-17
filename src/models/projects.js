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

const getProjectDetails = async (projectId) => {  
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
    WHERE sp.id = $1;
  `;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);

  return result.rows.length > 0 ? result.rows[0] : null;
};

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails };
