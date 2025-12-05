# QR-Enabled Mineral Water Product Information System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-%3E%3D4.4-green)

A comprehensive data engineering project that implements a QR code-based product information retrieval system for bottled mineral water products, featuring RESTful APIs, MongoDB database, and real-time QR scanning capabilities.

---

## Project Overview

This system allows users to quickly access detailed product information by scanning QR codes on mineral water bottles. Built as a capstone project for the Data Engineering course at Ho Chi Minh City University of Technology (HCMUT), it demonstrates key data engineering principles including database normalization, query optimization, indexing, and security.

---

## Key Features

- **QR Code Scanning**: Automatic QR code generation and scanning for instant product lookup
- **Complete CRUD Operations**: Full product management with admin authentication
- **Security**: Role-based access control (read-only vs admin users)
- **Performance Optimization**: Aggregation pipelines, indexing, and query optimization
- **Data Consistency**: Normalized database schema across 5 collections
- **Backup & Recovery**: Automated backup strategies using mongodump/mongorestore
- **RESTful API**: Clean API design following REST principles

---

## Architecture

### Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB (via MongoDB Compass)
- **Architecture Pattern**: MVC (Model-View-Controller)
- **QR Generation**: qrcode library
- **API Style**: RESTful

### System Architecture

The system implements a layered architecture pattern:
```
┌─────────────────────────────────┐
│  Presentation Layer             │  HTML + JavaScript
├─────────────────────────────────┤
│  Route Layer                    │  Express Routes
├─────────────────────────────────┤
│  Middleware Layer               │  Authentication, Validation, Rate Limiting
├─────────────────────────────────┤
│  Controller Layer               │  Business Logic
├─────────────────────────────────┤
│  Service/Model Layer            │  Aggregation Pipeline, Database Queries
├─────────────────────────────────┤
│  Data Access Layer              │  MongoDB Connection
├─────────────────────────────────┤
│  Database Layer                 │  5 Normalized Collections
└─────────────────────────────────┘
```

---

## Database Schema

The system uses 5 normalized collections to ensure data consistency and eliminate redundancy:

### Collections

1. **Product**: Main product information (ProductID, name, volume, price)
2. **Composition**: Mineral composition and pH range
3. **CareInstruction**: Storage and handling instructions
4. **Brand**: Brand information (1-N relationship with Product)
5. **Supplier**: Supplier details (1-N relationship with Product)

### Entity Relationships

- Product to Brand: Many-to-One relationship
- Product to Supplier: Many-to-One relationship
- Product to Composition: One-to-One relationship
- Product to CareInstruction: One-to-Many relationship

---

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (version 4.4 or higher)
- MongoDB Compass (optional, for graphical interface)

### Installation

**Step 1: Clone the repository**
```bash
git clone https://github.com/hinlin1501/qr-mineral-water-system.git
cd qr-mineral-water-system
```

**Step 2: Install dependencies**
```bash
npm install
```

**Step 3: Configure MongoDB connection**

Create a `config/db.js` file with your MongoDB connection string:
```javascript
const MONGODB_URI = 'mongodb://localhost:27017/MineralWater';
```

**Step 4: Set up MongoDB users**
```javascript
// Read-only user for public API
db.createUser({
  user: "qr_readonly",
  pwd: "your_password",
  roles: [{ role: "read", db: "MineralWater" }]
});

// Admin user for CRUD operations
db.createUser({
  user: "admin",
  pwd: "your_admin_password",
  roles: [{ role: "readWrite", db: "MineralWater" }]
});
```

**Step 5: Import sample data**
```bash
mongorestore --db MineralWater ./backup/
```

**Step 6: Start the server**
```bash
npm start
```

The server will run on `http://localhost:4000`

---

## API Documentation

### Public Endpoints (Read-Only Access)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/qr/:code` | Retrieve product details by QR code |
| GET | `/product/:ProductID` | Serve product information page |

### Admin Endpoints (Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` | Create new product with auto-generated QR code |
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product by ID |
| PUT | `/api/products/:id` | Update product information |
| DELETE | `/api/products/:id` | Delete product (cascade deletion) |

### Example API Request
```bash
# Retrieve product information by QR code
curl http://localhost:4000/api/products/qr/AQU500
```

**Response:**
```json
{
  "ProductID": "AQU500",
  "ProductName": "Aquafina 500ml",
  "Volume": "500ml",
  "Price": "5.000đ/chai",
  "Brand": {
    "BrandName": "Aquafina",
    "Country": "Việt Nam"
  },
  "Supplier": {
    "SupplierName": "Suntory PepsiCo Việt Nam",
    "Contact": "(84-28) 3821 9437"
  },
  "Composition": {
    "MineralComposition": "Nước tinh khiết, TDS < 50 mg/L",
    "pHRange": "6.0–7.0"
  },
  "CareInstructions": ["Để nơi khô ráo, thoáng mát; tránh ánh nắng trực tiếp"]
}
```

---

## Data Engineering Techniques

### 1. Database Normalization

The database schema has been normalized to Third Normal Form (3NF) to:

- Eliminate data redundancy
- Prevent update anomalies
- Ensure data consistency across collections

### 2. Query Optimization

**Aggregation Pipeline Implementation:**

- Utilizes MongoDB `$lookup` operator for efficient collection joins
- Achieves response time under 200ms even with large datasets
- Performance comparison documented with test cases

### 3. Indexing Strategy
```javascript
// Index creation for optimized queries
db.Product.createIndex({ ProductID: 1 });
db.Brand.createIndex({ BrandID: 1 });
db.Supplier.createIndex({ SupplierID: 1 });
db.Composition.createIndex({ ProductID: 1 });
db.CareInstruction.createIndex({ ProductID: 1 });
```

**Benefits:**

- Faster query execution
- Reduced database scan time
- Improved overall system performance

### 4. Backup and Recovery

**Backup Strategy:**
```bash
# Create database backup
mongodump --db MineralWater --out ./backup

# Restore database from backup
mongorestore --db MineralWater ./backup/MineralWater
```

**Features:**

- Automated backup scheduling
- Point-in-time recovery capability
- Data integrity verification

### 5. Security Implementation

**Role-Based Access Control:**

- Separate user accounts for read-only and administrative access
- MongoDB authentication and authorization

**Input Validation:**

- Regex validation pattern: `[A-Za-z0-9_-]+`
- Type checking for all input parameters
- NoSQL injection protection

**Rate Limiting:**

- Maximum 120 requests per minute per client
- Prevents denial-of-service attacks

**CORS Configuration:**

- Configured for secure cross-origin requests
- Supports QR scanning from mobile devices

---

## QR Code System

### Generation Process

QR codes are automatically generated during product creation:

- **Format**: PNG image (512×512 pixels)
- **Storage Location**: `public/qrcodes/{ProductID}.png`
- **URL Pattern**: `http://localhost:4000/product/{ProductID}`
- **Library**: qrcode npm package

### Workflow

1. Admin creates new product via API
2. System generates unique QR code PNG file
3. QR code URL stored in database
4. File accessible via public directory
5. Users scan QR code to access product information

---

## Sample Data

### Product Examples

| ProductID | Product Name | Volume | Price |
|-----------|--------------|--------|-------|
| AQU500 | Aquafina 500ml | 500ml | 5.000đ/chai |
| LAV500 | Lavie 500ml | 500ml | 6.000đ/chai |
| DAS510 | Dasani 510ml | 510ml | 5.500đ/chai |

### Brand Examples

| BrandID | Brand Name | Country |
|---------|------------|---------|
| A001 | Aquafina | Việt Nam |
| L001 | Lavie | Việt Nam |
| D001 | Dasani | Việt Nam |

---

## Testing

### Running Tests
```bash
# Execute test suite
npm test

# Query performance analysis
db.Product.find({ ProductID: "AQU500" }).explain("executionStats")
```

### Test Coverage

- Unit tests for all controller functions
- Integration tests for API endpoints
- Performance tests for query optimization
- Security tests for authentication and authorization

---

## Performance Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Query Response Time | < 200ms | < 200ms |
| QR Code Generation | < 100ms | < 100ms |
| API Rate Limit | 120 req/min | 120 req/min |
| Database Normalization | 3NF | 3NF |

---

## Future Enhancements

### Big Data Handling Capabilities

**Big Volume:**

- MongoDB sharding implementation for horizontal scaling
- Distributed data storage across multiple servers
- Load balancing for high-traffic scenarios

**Big Velocity:**

- Change Streams integration for real-time data updates
- Apache Kafka for event streaming
- Real-time analytics and monitoring

**Big Variety:**

- GridFS implementation for multimedia storage
- Support for images, videos, and documents
- Binary large object (BLOB) management

### Additional Planned Features

- Multi-language support (Vietnamese, English)
- Product analytics dashboard
- Mobile application integration
- Blockchain integration for supply chain tracking
- Machine learning-based product recommendations
- Advanced reporting and visualization

---

## Project Team

| Name |
|------|
| Huỳnh Ngọc Trâm Anh |
| Huỳnh Lê Phương Linh |
| Phan Cao Thiên Kiều |
| Nguyễn Thị Như Quỳnh |

**Course**: Data Engineering Capstone Project  
**Class**: CN01  
**Instructor**: Phan Trọng Nhân  
**Institution**: Ho Chi Minh City University of Technology (HCMUT)  
**Vietnam National University, Ho Chi Minh City**  
**Completion Date**: December 2025

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

We would like to express our gratitude to:

- Ho Chi Minh City University of Technology (HCMUT)
- Faculty of Computer Science and Engineering
- Our instructor, Mr. Phan Trọng Nhân, for his guidance and support
- All team members for their dedication and collaboration

---

## Contact Information

For questions, suggestions, or collaboration opportunities, please contact the team through the GitHub repository [issues page](https://github.com/hinlin1501/qr-mineral-water-system/issues).

---

**Repository**: [https://github.com/hinlin1501/qr-mineral-water-system](https://github.com/hinlin1501/qr-mineral-water-system)

