BEGIN;

-- Categories
INSERT INTO categories (name, description, display_order)
SELECT v.name, v.description, v.display_order
FROM (
	VALUES
		('Soups', 'Traditional Ivorian soups and stews', 1),
		('Protein', 'Choice of meat or fish', 2),
		('Compact Meals', 'Rice-based or single-plate meals', 3),
		('Sides', 'Perfect sides', 4),
		('Drinks', 'Refreshing beverages', 5)
) AS v(name, description, display_order)
WHERE NOT EXISTS (
	SELECT 1
	FROM categories c
	WHERE c.name = v.name
);

-- Menu Items
-- Resolve category IDs by name so seeding works even when SERIAL values are not 1..5.
INSERT INTO menu_items (category_id, name, description, price, image_path, image_alt, available) VALUES
((SELECT id FROM categories WHERE name = 'Soups' LIMIT 1), 'Chicken Kedjenou', 'Slow-cooked chicken stew with vegetables and spices', 11.99, '/images/poulet-kedjenou.webp', 'Chicken Kedjenou stew', TRUE),
((SELECT id FROM categories WHERE name = 'Soups' LIMIT 1), 'Fish Soup', 'Spicy fish stew with tomatoes, onions, and peppers', 12.49, '/images/fish_soup.jpg', 'Spicy fish soup', TRUE),
((SELECT id FROM categories WHERE name = 'Soups' LIMIT 1), 'Peanut Soup', 'Sauce with peanut paste and spices', 10.49, '/images/sauce-arachide.webp', 'Peanut sauce soup', TRUE),
((SELECT id FROM categories WHERE name = 'Soups' LIMIT 1), 'Palm Nut Soup', 'Sauce with the juice from palm nut and spices', 11.49, '/images/sauce-graine.webp', 'Palm nut soup', TRUE),
((SELECT id FROM categories WHERE name = 'Protein' LIMIT 1), 'Grilled Chicken (Poulet Braise)', 'Charcoal grilled chicken', 10.99, '/images/grilled-chicken.jpg', 'Charcoal grilled chicken', TRUE),
((SELECT id FROM categories WHERE name = 'Protein' LIMIT 1), 'Fried Fish', 'Whole fried fish with light seasoning', 11.49, '/images/fried-fish.jpg', 'Whole fried fish', TRUE),
((SELECT id FROM categories WHERE name = 'Protein' LIMIT 1), 'Beef Skewers', 'Spiced grilled beef on skewers', 9.99, '/images/beef-skewers.webp', 'Spiced beef skewers', TRUE),
((SELECT id FROM categories WHERE name = 'Protein' LIMIT 1), 'Smoked Pork', 'Slow-cooked pork slices with light seasoning', 5.49, '/images/smoked-pork.jpg', 'Smoked pork slices', TRUE),
((SELECT id FROM categories WHERE name = 'Compact Meals' LIMIT 1), 'Garba', 'Attieke served with fried tuna, onions, tomato, and spicy pepper sauce', 7.99, '/images/garba.jpeg', 'Garba with fried tuna and attieke', TRUE),
((SELECT id FROM categories WHERE name = 'Compact Meals' LIMIT 1), 'Alloco Rice Plate', 'Fried plantains served with rice and chicken', 9.99, '/images/alloco-riz-poulet.jpg', 'Alloco rice plate with chicken', TRUE),
((SELECT id FROM categories WHERE name = 'Compact Meals' LIMIT 1), 'Fried Rice', 'Rice with vegetables and spices', 12.99, '/images/fried-rice.jpeg', 'Fried rice with vegetables', TRUE),
((SELECT id FROM categories WHERE name = 'Compact Meals' LIMIT 1), 'Alloco Poulet', 'Fried plantains served with grilled chicken and onion sauce', 9.99, '/images/alloco-poulet.jpg', 'Alloco with grilled chicken', TRUE),
((SELECT id FROM categories WHERE name = 'Compact Meals' LIMIT 1), 'Tchep', 'Traditional slow-cooked rice with vegetables and spices', 13.99, '/images/tchep.jpg', 'Tchep rice dish', TRUE),
((SELECT id FROM categories WHERE name = 'Sides' LIMIT 1), 'Attieke', 'Cassava couscous commonly served with grilled fish or meat', 3.99, '/images/attieke.jpg', 'Attieke cassava couscous', TRUE),
((SELECT id FROM categories WHERE name = 'Sides' LIMIT 1), 'Alloco', 'Sweet fried plantains served with spicy pepper sauce', 3.49, '/images/alloco.jpg', 'Fried sweet plantains', TRUE),
((SELECT id FROM categories WHERE name = 'Sides' LIMIT 1), 'White Rice', 'Slow-cooked rice', 3.99, '/images/rice.jpg', 'White rice', TRUE),
((SELECT id FROM categories WHERE name = 'Sides' LIMIT 1), 'French Fries', 'Crispy golden fries', 3.99, '/images/french-fries.jpg', 'Crispy French fries', TRUE),
((SELECT id FROM categories WHERE name = 'Sides' LIMIT 1), 'Fried Yam', 'Crispy fried yam slices', 3.99, '/images/fried-yam.jpg', 'Crispy fried yam', TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Bissap (Hibiscus Drink)', 'Sweet and refreshing hibiscus flower drink', 2.49, '/images/bissap.JPG', 'Bissap hibiscus drink', TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Ginger Juice (Gnamankoudji)', 'Spicy and refreshing homemade ginger drink', 2.49, '/images/ginger.jpeg', 'Homemade ginger juice', TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Baobab Juice', 'Creamy juice made from baobab fruit', 2.99, '/images/jus-de-baobab', 'Baobab fruit juice', TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Coke', 'Coca-Cola', 1.99, '/images/coke.jpg', 'Coca-Cola', TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Sprite', 'Lemon-lime soda', 1.99, '/images/sprite.jpg', 'Sprite lemon-lime soda', TRUE),
((SELECT id FROM categories WHERE name = 'Drinks' LIMIT 1), 'Water', 'Bottled water', 1.49, '/images/water.jpg', 'Bottled water', TRUE);

-- Admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@fastfood.com', '$2b$10$rZ0VD.KZ5JcdJqHvF5K8P.NQYZJHvGq8jKqF5ZqW8jfvL6YOeKhNe', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Test customer (password: test123)
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('Test Customer', 'customer@test.com', '$2b$10$8K1p/a0dL6RT/YPPy7JFHOHmGGZ0KVp0kFqLBGvX8aPPWcXRYcEJm', '555-0100', 'customer')
ON CONFLICT (email) DO NOTHING;

COMMIT;
