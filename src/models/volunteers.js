import db from './db.js'

const addVolunteer = async (userId, projectId) => {
  const query = 'INSERT INTO project_volunteers (user_id, project_id) VALUES ($1, $2) returning *';
  const values = [userId, projectId];
  const result = await db.query(query, values);
  return result.rows[0];
};

const removeVolunteer = async (userId, projectId) => {
  const query = 'DELETE FROM project_volunteers WHERE user_id = $1 AND project_id = $2 returning *';
  const values = [userId, projectId];
  const result = await db.query(query, values);
  return result.rows[0];
};

const isUserVolunteer = async (userId, projectId) => {
  const query = 'SELECT * FROM project_volunteers WHERE user_id = $1 AND project_id = $2';
  const values = [userId, projectId];
  const result = await db.query(query, values);
  return result.rows.length > 0;
};

const getProjectByVolunteerId = async (userId) => {
  const query = `
    SELECT sp.id, sp.title, sp.description, sp.location, sp.project_date, sp.status
    FROM service_projects sp
    JOIN project_volunteers pv ON pv.project_id = sp.id
    WHERE pv.user_id = $1
    ORDER BY sp.project_date;
  `;
  const queryParams = [userId];
  const result = await db.query(query, queryParams);
  return result.rows;
};

export { addVolunteer, removeVolunteer, isUserVolunteer, getProjectByVolunteerId };    