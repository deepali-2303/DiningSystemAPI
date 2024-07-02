import connection from "../db/db.js";



const createDiningSchema = () => {
  const query = `CREATE TABLE IF NOT EXISTS dining_places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone_no VARCHAR(15) NOT NULL,
    website VARCHAR(255),
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    booked_slots JSON DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`;

  connection.query(query, (e, result) => {
    {
      if (e) {
        console.log("Error creating table : ", e);
        return;
      } else {
        console.log("Dining Table created successfully");

      }
    }
  });
};

export default createDiningSchema;