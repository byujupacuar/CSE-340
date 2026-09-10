import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT id, organization_id, title, description, location, project_date, status, category_id
      FROM public.service_projects;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}