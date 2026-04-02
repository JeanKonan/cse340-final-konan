import express from 'express';
import ContactController from './contact.js';

const router = express.Router();

router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/styles/contact.css">');
    next();
});

router.get('/', ContactController.showContactForm);
router.post('/', ContactController.submitContactForm);

export default router;
