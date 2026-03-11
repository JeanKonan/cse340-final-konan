import MenuModel from "../../models/menu.js";

class MenuController {
    static async showMenu(req, res, next) {
        try {
            const { category } = req.query;
            const menuItems = category
                ? await MenuModel.filterByCategory(category)
                : await MenuModel.getMenuItems();

            const categories = await MenuModel.getCategories();

            res.render('menu/browse', {
                title: 'Menu',
                menuItems,
                categories,
                selectedCategory: category || null,
                user: req.session.user || null
            });
        } catch (error) {
            next(error);
        }
    };
}

export default MenuController;