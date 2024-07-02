import connection from "../db/db.js";

const createAdminSchema = () => {
  const query = `CREATE TABLE IF NOT EXISTS ADMIN(
    ID INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL,
    PASSWORD TEXT NOT NULL,
    EMAIL VARCHAR(255) NOT NULL)`;

  connection.query(query, (e, result) => {
    {
      if (e) {
        console.log("Error creating table : ", e);
        return;
      } else {
        console.log("Admin Table created successfully");

      }
    }
  });
}

export default createAdminSchema;