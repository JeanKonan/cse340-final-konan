import express from 'express';
import AdminController from './adminMenu.js';
import { requireAdmin } from '../../middleware/adminMiddleware.js';
import { categoryValidators, idParamValidator, menuItemValidators, staffAccountValidators, userRoleValidators } from '../../middleware/validators.js';

const router = express.Router();

router.use(requireAdmin);

router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/styles/admin.css">');
    next();
});

router.get('/menu', AdminController.showDashboard);
router.get('/menu/add', AdminController.showAddForm);
router.post('/menu', menuItemValidators, AdminController.addMenuItem);
router.post('/menu/add', menuItemValidators, AdminController.addMenuItem);
router.get('/menu/edit/:id', idParamValidator, AdminController.showEditForm);
router.post('/menu/edit/:id', idParamValidator, menuItemValidators, AdminController.updateMenuItem);
router.post('/menu/delete/:id', idParamValidator, AdminController.deleteMenuItem);
router.post('/categories', categoryValidators, AdminController.addCategory);
router.post('/categories/edit/:id', idParamValidator, categoryValidators, AdminController.updateCategory);
router.post('/categories/delete/:id', idParamValidator, AdminController.deleteCategory);
router.post('/users', staffAccountValidators, AdminController.createStaffAccount);
router.post('/users/:id/role', userRoleValidators, AdminController.updateUserRole);

export default router;