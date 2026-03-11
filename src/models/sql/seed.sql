BEGIN;

-- Categories
INSERT INTO categories (name, description, display_order) VALUES
('Soups', 'Traditional Ivorian soups and stews', 1),
('Protein', 'Choice of meat or fish', 2),
('Compact Meals', 'Rice-based or single-plate meals', 3),
('Sides', 'Perfect sides', 4),
('Drinks', 'Refreshing beverages', 5);

-- Menu Items
-- Resolve category IDs by name so seeding works even when SERIAL values are not 1..5.
INSERT INTO menu_items (category_id, name, description, price, available) VALUES
((SELECT id FROM categories WHERE name = 'Soups' LIMIT 1), 'Chicken Kedjenou', 'Slow-cooked chicken stew with vegetables and spices', 11.99, TRUE),
((SELECT id FROM categories WHERE name = 'Soups' LIMIT 1), 'Fish Soup', 'Spicy fish stew with tomatoes, onions, and peppers', 12.49, TRUE),
((SELECT id FROM categories WHERE name = 'Soups' LIMIT 1), 'Peanut Soup', 'Sauce with peanut paste and spices', 10.49, TRUE),
((SELECT id FROM categories WHERE name = 'Soups' LIMIT 1), 'Palm Nut Soup', 'Sauce with the juice from palm nut and spices', 11.49, TRUE),
((SELECT id FROM categories WHERE name = 'Protein' LIMIT 1), 'Grilled Chicken (Poulet Braise)', 'Charcoal grilled chicken', 10.99, TRUE),
((SELECT id FROM categories WHERE name = 'Protein' LIMIT 1), 'Fried Fish', 'Whole fried fish with light seasoning', 11.49, TRUE),
((SELECT id FROM categories WHERE name = 'Protein' LIMIT 1), 'Beef Skewers', 'Spiced grilled beef on skewers', 9.99, TRUE),
((SELECT id FROM categories WHERE name = 'Protein' LIMIT 1), 'Smoked Pork', 'Slow-cooked pork slices with light seasoning', 5.49, TRUE),
((SELECT id FROM categories WHERE name = 'Compact Meals' LIMIT 1), 'Garba', 'Attieke served with fried tuna, onions, tomato, and spicy pepper sauce', 7.99, TRUE),
((SELECT id FROM categories WHERE name = 'Compact Meals' LIMIT 1), 'Alloco Rice Plate', 'Fried plantains served with rice and chicken', 9.99, TRUE),
((SELECT id FROM categories WHERE name = 'Compact Meals' LIMIT 1), 'Fried Rice', 'Rice with vegetables and spices', 12.99, TRUE),
((SELECT id FROM categories WHERE name = 'Compact Meals' LIMIT 1), 'Alloco Poulet', 'Fried plantains served with grilled chicken and onion sauce', 9.99, TRUE),
((SELECT id FROM categories WHERE name = 'Compact Meals' LIMIT 1), 'Tchep', 'Traditional slow-cooked rice with vegetables and spices', 13.99, TRUE),
((SELECT id FROM categories WHERE name = 'Sides' LIMIT 1), 'Attieke', 'Cassava couscous commonly served with grilled fish or meat', 3.99, TRUE),
((SELECT id FROM categories WHERE name = 'Sides' LIMIT 1), 'Alloco', 'Sweet fried plantains served with spicy pepper sauce', 3.49, TRUE),
((SELECT id FROM categories WHERE name = 'Sides' LIMIT 1), 'White Rice', 'Slow-cooked rice', 3.99, TRUE),
((SELECT id FROM categories WHERE name = 'Sides' LIMIT 1), 'French Fries', 'Crispy golden fries', 3.99, TRUE),
((SELECT id FROM categories WHERE name = 'Sides' LIMIT 1), 'Fried Yam', 'Crispy fried yam slices', 3.99, TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Bissap (Hibiscus Drink)', 'Sweet and refreshing hibiscus flower drink', 2.49, TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Ginger Juice (Gnamankoudji)', 'Spicy and refreshing homemade ginger drink', 2.49, TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Baobab Juice', 'Creamy juice made from baobab fruit', 2.99, TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Coke', 'Coca-Cola', 1.99, TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Sprite', 'Lemon-lime soda', 1.99, TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Water', 'Bottled water', 1.49, TRUE);

-- Admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@fastfood.com', '$2b$10$rZ0VD.KZ5JcdJqHvF5K8P.NQYZJHvGq8jKqF5ZqW8jfvL6YOeKhNe', 'admin');

-- Test customer (password: test123)
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('Test Customer', 'customer@test.com', '$2b$10$8K1p/a0dL6RT/YPPy7JFHOHmGGZ0KVp0kFqLBGvX8aPPWcXRYcEJm', '555-0100', 'customer');

COMMIT;
