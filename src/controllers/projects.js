// Import any needed model functions
import { getAllProjects, getProjectsByOrganizationId, getProjectDetails, getUpcomingProjects } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5; // Define the number of upcoming projects to retrieve    
// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};  

const showProjectsByOrganizationPage = async (req, res) => {
    const organizationId = req.params.id;
    const projects = await getProjectsByOrganizationId(organizationId);

    const title = 'Projects by Organization';

    res.render('projects_by_organization', { title, projects });
}

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);

    if (!projectDetails) {
        res.status(404).send('Project not found');
        return;
    }

    const title = 'Project Details';

    res.render('project', { title, projectDetails });
};


// Export any controller functions
export { showProjectsPage, showProjectsByOrganizationPage, showProjectDetailsPage };

