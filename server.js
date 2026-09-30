import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';
import session from 'express-session';
import flash from './src/middleware/flash.js';

const SESSION_SECRET = process.env.SESSION_SECRET;
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configuración de vistas
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Middleware base
 */
// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Parseo de formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sesión
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hora
}));

// Mensajes flash (requiere sesión, por eso va después)
app.use(flash);

// Log de peticiones en desarrollo
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

// Variables disponibles en todas las vistas
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!(req.session && req.session.user);
  res.locals.user = req.session?.user || null;
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

/**
 * Rutas
 */
app.use(router);

/**
 * 404 (si ninguna ruta respondió)
 */
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

/**
 * Manejador de errores (siempre al final)
 */
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  console.error('Stack trace:', err.stack);

  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';

  const context = {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: err.message,
    stack: err.stack
  };

  res.status(status).render(`errors/${template}`, context);
});

/**
 * Inicio del servidor
 */
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});