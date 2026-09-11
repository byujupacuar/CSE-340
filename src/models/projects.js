import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT 
      sp.id,
      sp.title,
      sp.description,
      sp.location,
      sp.project_date,
      sp.status,
      o.name AS organization_name
    FROM service_projects sp
    JOIN organizations o ON sp.organization_id = o.id
    ORDER BY sp.project_date ASC;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}