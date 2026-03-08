BEGIN;

-- Categories
     INSERT INTO categories (name, description, display_order) VALUES
     ('Soups', 'Traditional Ivorian soups and stews', 1),
     ('Protein', 'Choice of meat or fish', 2),
     ('Compact Meals', 'Rice-based or single-plate meals', 3),
     ('Sides', 'Perfect sides', 2),
     ('Drinks', 'Refreshing beverages', 3);
     
     -- Menu Items
     INSERT INTO menu_items (category_id, name, description, price, available) VALUES
     (1, 'Chicken Kedjenou', 'Slow-cooked chicken stew with vegetables and spices', 11.99, TRUE),
     (1, 'Fish Soup', 'Spicy fish stew with tomatoes, onions, and peppers', 12.49, TRUE),
     (1, 'Peanut Soup', 'Sauce with peanut paste and spices', 10.49, TRUE),
     (1, 'Palm nut Soup', 'Sauce with the juice from palm nut, spices', 11.49, TRUE)

     (2, 'Grilled Chicken (Poulet Braisé)', 'Charcoal grilled chicken', 10.99, TRUE),
     (2, 'Fried Fish', 'Whole fried fish with light seasoning', 11.49, TRUE),
     (2, 'Beef Skewers', 'Spiced grilled beef on skewers', 9.99, TRUE),
     (2, 'Smoked Pork', 'Slow-cooked pork slices with light seasoning', 5.49, TRUE)

     (3, 'Garba', 'Attieke served with fried tuna, onions, tomato and spicy pepper sauce', 7.99, TRUE),
     (3, 'Alloco Rice Plate', 'Fried plantains served with rice and chicken', 9.99, true),
     (3, 'Fried Rice', 'rice with vegetables and spices', 12.99, TRUE),
     (3, 'Alloco Poulet', 'Fried plantains served with grilled chicken and onion sauce', 9.99, true),
     (3, 'Tchep', 'Traditional slow-cooked rice with vegetables and spices', 13.99, TRUE),
     

     (4, 'Attieke', 'Cassava couscous commonly served with grilled fish or meat', 3.99, true),
     (4, 'Alloco', 'Sweet fried plantains served with spicy pepper sauce', 3.49, true),
     (4, 'White Rice', 'Slow-cooked rice', 3.99, TRUE)
     (4, 'French Fries', 'Crispy golden fries', 3.99, true),
     (4, 'Fried Yam', 'Crispy fried yam slices', 3.99, true),

     (5, 'Bissap (Hibiscus Drink)', 'Sweet and refreshing hibiscus flower drink', 2.49, true),
     (5, 'Ginger Juice (Gnamankoudji)', 'Spicy and refreshing homemade ginger drink', 2.49, true),
     (5, 'Baobab Juice', 'Creamy juice made from baobab fruit', 2.99, true),
     (5, 'Coke', 'Coca-Cola', 1.99, true),
     (5, 'Sprite', 'Lemon-lime soda', 1.99, true),
     (5, 'Water', 'Bottled water', 1.49, true);
     
     -- Admin user (password: admin123)
     INSERT INTO users (name, email, password_hash, role) VALUES
     ('Admin User', 'admin@fastfood.com', '$2b$10$rZ0VD.KZ5JcdJqHvF5K8P.NQYZJHvGq8jKqF5ZqW8jfvL6YOeKhNe', 'admin');
     
     -- Test customer (password: test123)
     INSERT INTO users (name, email, password_hash, phone, role) VALUES
     ('Test Customer', 'customer@test.com', '$2b$10$8K1p/a0dL6RT/YPPy7JFHOHmGGZ0KVp0kFqLBGvX8aPPWcXRYcEJm', '555-0100', 'customer');
     