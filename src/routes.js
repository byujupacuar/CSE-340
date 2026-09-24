import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage, showNewProjectForm, processNewProjectForm, projectValidation, showProjectDetailsPage, showEditProjectForm, processEditProjectForm} from './controllers/projects.js';
import { testErrorPage } from './controllers/errors.js';
import { showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm} from './controllers/organizations.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, categoryValidation, showEditCategoryForm, processEditCategoryForm } from './controllers/categories.js';
const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
// Route for new project page
router.get('/new-project', showNewProjectForm);
// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);
// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
// Route to display the edit project form
router.get('/edit-project/:id', showEditProjectForm);
// Route to handle the edit project form submission
router.post('/edit-project/:id', projectValidation, processEditProjectForm);
// Route for new category page
router.get('/new-category', showNewCategoryForm);
// Route to handle new category form submission
router.post('/new-category', categoryValidation, processNewCategoryForm);
// Route to display the edit category form
router.get('/edit-category/:id', showEditCategoryForm);
// Route to handle the edit category form submission
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);
// error-handling routes
router.get('/test-error', testErrorPage);

export default router;
