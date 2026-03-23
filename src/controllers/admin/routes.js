import express from 'express';
import AdminController from './adminMenu.js';
import { requireAdmin } from '../../middleware/adminMiddleware.js';

const router = express.Router();

router.use(requireAdmin);

router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/styles/admin.css">');
    next();
});

router.get('/menu', AdminController.showDashboard);
router.get('/menu/add', AdminController.showAddForm);
router.post('/menu', AdminController.addMenuItem);
router.post('/menu/add', AdminController.addMenuItem);
router.get('/menu/edit/:id', AdminController.showEditForm);
router.post('/menu/edit/:id', AdminController.updateMenuItem);
router.post('/menu/delete/:id', AdminController.deleteMenuItem);
router.post('/categories', AdminController.addCategory);
router.post('/categories/edit/:id', AdminController.updateCategory);
router.post('/categories/delete/:id', AdminController.deleteCategory);
router.post('/users', AdminController.createStaffAccount);
router.post('/users/:id/role', AdminController.updateUserRole);

export default router;