// Import any needed model functions
import { getAllProjects, getProjectsByOrganizationId, getProjectDetails, getUpcomingProjects, createProject, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId, getAllCategories } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from "express-validator";

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('status')
        .trim()
        .notEmpty().withMessage('Status is required')
        .isIn(['planned', 'in progress', 'completed']).withMessage('Status must be planned, in progress, or completed'),
    body('categoryId')
        .optional({ checkFalsy: true })
        .isInt().withMessage('Category must be a valid integer'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

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

     const categories = await getCategoriesByProjectId(projectId);
    const title = 'Project Details';

    res.render('project', { title, projectDetails, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    const categories = await getAllCategories();

    res.render('new-project', { title, organizations, categories });
}

const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, status, organizationId, categoryId } = req.body;

      // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, status, organizationId, categoryId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);

    if (!projectDetails) {
        res.status(404).send('Project not found');
        return;
    }

    const organizations = await getAllOrganizations();
    const categories = await getAllCategories();
    const title = 'Edit Service Project';

    res.render('update-project', { title, projectDetails, organizations, categories });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, location, date, status, organizationId, categoryId } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    try {
        await updateProject(projectId, title, description, location, date, status, organizationId, categoryId || null);
        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

// Export any controller functions
export { showProjectsPage, showProjectsByOrganizationPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm, projectValidation };

