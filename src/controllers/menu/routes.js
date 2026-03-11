import express from 'express';
import MenuController from './menu.js';

const router = express.Router();

router.get('/', MenuController.showMenu);

export default router;