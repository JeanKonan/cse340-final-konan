import express from 'express';

const router = express.Router();

const homePage = (req, res) => {
    res.render('layouts/home', { title: 'Home' });
};

router.get('/', homePage);

export default router;