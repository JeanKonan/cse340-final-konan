# Fast-Food Online Ordering & Delivery Tracking System

**CSE 340 Final Project** | Winter 2026

A full-stack web application for fast-food ordering with real-time delivery tracking. Customers browse menu, place orders, and track status via WebSocket. Admin dashboard for menu and order management.

## 🎯 Features

**Customer:**
- Browse menu by category
- Shopping cart (add/update/remove)
- Checkout with delivery address
- Real-time order tracking with live status updates

**Admin:**
- Add/edit/delete menu items
- View all orders
- Update order status (triggers real-time updates to customers)
- Simulated auto-progression for demo

**Kitchen:**
- Kitchen dashboard with live incoming order queue
- Update order status for real-time customer tracking
- Toggle menu item availability during service

**Authentication:**
- User registration and login
- Session-based with secure password hashing

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js, EJS templates |
| **Database** | PostgreSQL (raw SQL, no ORM) |
| **Real-Time** | Socket.io (WebSocket) |
| **Auth** | bcrypt + express-session |

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL v14+

### Installation

```bash
# Clone and install
git clone <repo>
cd cse340-final-konan
npm install

# Setup database
createdb fast_food_ordering
npm run setup-db

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start server
npm run dev
```

Visit `http://localhost:3000`
Live app: `https://cse340-final-konan.onrender.com`

### Test Accounts
- **User role**: test@example.com
- **Admin role**: admin@example.com
- **Kitchen role**: johndoe@email.com

## Database Diagram

![Database Diagram](public/images/database-diagram.svg)
```mermaid
erDiagram
	CATEGORIES ||--o{ MENU_ITEMS : categorizes
	USERS ||--o{ ORDERS : places
	ORDERS ||--o{ ORDER_ITEMS : contains
	MENU_ITEMS ||--o{ ORDER_ITEMS : referenced_by
	ORDERS ||--o{ ORDER_TRACKING : tracked_by
	USERS ||--o{ SAVED_ADDRESSES : has

	CATEGORIES {
		int id PK
		varchar name
		text description
		int display_order
	}

	MENU_ITEMS {
		int id PK
		int category_id FK
		varchar name
		text description
		decimal price
		varchar image_path
		varchar image_alt
		boolean available
		boolean active
		timestamp created_at
	}

	USERS {
		int id PK
		varchar name
		varchar email
		varchar password_hash
		varchar phone
		text address
		varchar role
		timestamp created_at
	}

	ORDERS {
		int id PK
		int user_id FK
		varchar order_number
		varchar customer_name
		varchar customer_email
		varchar customer_phone
		boolean pickup
		varchar delivery_address_street
		varchar delivery_address_city
		varchar delivery_address_state
		varchar delivery_address_zip
		text special_instructions
		decimal subtotal
		decimal tax
		decimal delivery_fee
		decimal total
		varchar status
		timestamp created_at
		timestamp updated_at
	}

	ORDER_ITEMS {
		int id PK
		int order_id FK
		int menu_item_id FK
		int quantity
		decimal unit_price
		text customization
		decimal subtotal
	}

	ORDER_TRACKING {
		int id PK
		int order_id FK
		varchar status
		timestamp updated_at
		text notes
	}

	SAVED_ADDRESSES {
		int id PK
		int user_id FK
		varchar label
		varchar street
		varchar city
		varchar state
		varchar zip
		boolean is_default
	}

	SESSIONS {
		varchar sid PK
		json sess
		timestamp expire
	}
```

## 📁 Project Structure

```
src/
├── controllers/        # Route handlers (menu, cart, order, account, admin)
├── models/            # Database models (menu, order, user)
├── views/             # EJS templates (menu, cart, order, account, admin)
├── middleware/        # Auth, validation, error handling
├── utils/             # Payment, email, address validation services
└── config/            # Database and Socket.io config

public/               # CSS, JavaScript, images
```

## 🔒 Security

- Passwords hashed with bcrypt (10 salt rounds)
- Parameterized SQL queries (SQL injection prevention)
- Session-based authentication with HttpOnly cookies
- Input validation and sanitization

## 🎓 Key Implementation Features

✅ Traditional MVC with server-side rendering  
✅ Real-time order tracking with WebSocket  
✅ Transaction-based order creation  
✅ Mock payment processing (demo)  
✅ Responsive mobile-first design  
✅ RESTful API with Postman tests  
✅ Category filtering and search  

## 📝 Development Workflow

```bash
npm run dev       # Start with nodemon
npm run setup-db  # Initialize database
npm run lint      # Check code with ESLint
npm run format    # Format with Prettier
```

## 👨‍💻 Author

**Konan Jean** | CSE 340 - Web Backend Development | Winter 2026
