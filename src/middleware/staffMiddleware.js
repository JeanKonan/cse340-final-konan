const requireStaff = (req, res, next) => {
    const role = req.session?.user?.role;

    if (!role || (role !== 'kitchen' && role !== 'admin')) {
        return res.status(403).send('Access denied');
    }

    next();
};

export { requireStaff };
