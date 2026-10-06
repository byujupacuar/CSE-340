CREATE TABLE organizations (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(150) NOT NULL,
    description   TEXT         NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);
 
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT
);
 
CREATE TABLE service_projects (
    id              SERIAL PRIMARY KEY,
    organization_id INT          NOT NULL,
    title           VARCHAR(200) NOT NULL,
    description     TEXT         NOT NULL,
    location        VARCHAR(255) NOT NULL,
    project_date    DATE         NOT NULL,
    status          VARCHAR(50)  NOT NULL
                    CHECK (status IN ('planned', 'in progress', 'completed')),
    category_id     INT,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_service_projects_category
        FOREIGN KEY (category_id)
        REFERENCES categories (id)
        ON DELETE SET NULL
);
 
CREATE TABLE project_categories (
    project_id  INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_projects (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_categories_category
        FOREIGN KEY (category_id)
        REFERENCES categories (id)
        ON DELETE CASCADE
);

CREATE INDEX idx_service_projects_organization_id ON service_projects (organization_id);
CREATE INDEX idx_service_projects_category_id     ON service_projects (category_id);
CREATE INDEX idx_service_projects_project_date    ON service_projects (project_date);
CREATE INDEX idx_project_categories_category_id   ON project_categories (category_id);


INSERT INTO organizations (name, description, contact_email, logo_filename)
VALUES
    ('BrightFuture Builders',
     'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
     'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
    ('GreenHarvest Growers',
     'An urban farming collective promoting food sustainability and education in local neighborhoods.',
     'contact@greenharvest.org', 'greenharvest-logo.png'),
    ('UnityServe Volunteers',
     'A volunteer coordination group supporting local charities and service initiatives.',
     'hello@unityserve.org', 'unityserve-logo.png');
 
INSERT INTO categories (name, description)
VALUES
    ('Health',      'Projects related to healthcare and wellness'),
    ('Education',   'Projects related to schools, training, and infrastructure'),
    ('Employment',  'Projects related to job creation, fairs, and scholarships'),
    ('Culture',     'Projects related to arts, traditions, and community events'),
    ('Environment', 'Projects related to sustainability, ecology, and clean water');
 
INSERT INTO service_projects
    (organization_id, title, description, location, project_date, status, category_id)
VALUES
    -- Organización 1: BrightFuture Builders
    (1, 'Community Health Fair',       'Annual health fair providing free checkups.',       'La Paz',     '2026-09-15', 'planned',     1),
    (1, 'School Renovation',           'Renovation of local primary school facilities.',    'El Alto',    '2026-10-01', 'in progress', 2),
    (1, 'Food Distribution',           'Distribution of food packages to families.',        'Cochabamba', '2026-10-20', 'planned',     3),
    (1, 'Tech Workshop',               'Workshop on digital literacy for youth.',           'Santa Cruz', '2026-11-05', 'completed',   4),
    (1, 'Environmental Cleanup',       'Community cleanup of riverbanks.',                  'La Paz',     '2026-11-25', 'planned',     5),
 
    -- Organización 2: GreenHarvest Growers
    (2, 'Vaccination Campaign',        'Free vaccination drive for children.',              'Oruro',      '2026-09-18', 'in progress', 1),
    (2, 'Library Expansion',           'Adding new sections to the community library.',     'Sucre',      '2026-10-10', 'planned',     2),
    (2, 'Job Fair',                    'Connecting youth with local employers.',            'Tarija',     '2026-10-25', 'completed',   3),
    (2, 'Sports Tournament',           'Organizing a youth football tournament.',           'Potosí',     '2026-11-12', 'planned',     4),
    (2, 'Tree Planting',               'Planting 500 trees in rural areas.',                'Chuquisaca', '2026-11-30', 'in progress', 5),
 
    -- Organización 3: UnityServe Volunteers
    (3, 'Women Empowerment Program',   'Training workshops for women entrepreneurs.',       'La Paz',     '2026-09-20', 'planned',     1),
    (3, 'Hospital Equipment Upgrade',  'Providing new medical equipment.',                  'Santa Cruz', '2026-10-05', 'in progress', 2),
    (3, 'Scholarship Fund',            'Scholarships for underprivileged students.',        'Cochabamba', '2026-10-22', 'planned',     3),
    (3, 'Cultural Festival',           'Celebrating local traditions and arts.',            'El Alto',    '2026-11-08', 'completed',   4),
    (3, 'Water Supply Project',        'Improving access to clean water.',                  'Potosí',     '2026-11-28', 'planned',     5);
 
-- Refleja la categoría principal de cada proyecto en la tabla intermedia
INSERT INTO project_categories (project_id, category_id)
SELECT id, category_id
FROM service_projects
WHERE category_id IS NOT NULL
ON CONFLICT (project_id, category_id) DO NOTHING;

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_volunteers (
    user_id      INT NOT NULL,
    project_id   INT NOT NULL,
    signed_up_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id),
    CONSTRAINT fk_volunteer_user
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_volunteer_project
        FOREIGN KEY (project_id) REFERENCES service_projects (id) ON DELETE CASCADE
);

CREATE INDEX idx_project_volunteers_project_id ON project_volunteers (project_id);
