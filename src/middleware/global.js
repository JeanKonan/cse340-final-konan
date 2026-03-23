const setHeadAssetsFunctionality = (res) => {
    res.locals.styles = [];
    res.locals.scripts = [];

    res.addStyle = (css, priority = 0) => {
        res.locals.styles.push({ content: css, priority });
    };

    res.addScript = (js, priority = 0) => {
        res.locals.scripts.push({ content: js, priority });
    };

    // These functions will be available in EJS templates
    res.locals.renderStyles = () => {
        return res.locals.styles            // Sort by priority: higher numbers load first
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.content)
            .join('\n');
    };

    res.locals.renderScripts = () => {
        return res.locals.scripts            // Sort by priority: higher numbers load first
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.content)
            .join('\n');
    };
};

const addLocalVariables = (req, res, next) => {

    res.locals.NODE_ENV = process.env.NODE_ENV.toLowerCase() || 'production';

    res.locals.queryParams = { ...req.query };

    res.locals.isLoggedIn = false;
    res.locals.user = null;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.user = req.session.user;
    }

    res.locals.currentYear = new Date().getFullYear();

    // Prevent browsers from caching server-rendered pages that contain session state.
    if (req.accepts('html')) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }

    const cartItems = req.session?.cart?.items;
    res.locals.cartItemCount = Array.isArray(cartItems)
        ? cartItems.reduce((sum, item) => sum + (Number.parseInt(item.quantity, 10) || 0), 0)
        : 0;

    setHeadAssetsFunctionality(res);

    next();
};

export { addLocalVariables };