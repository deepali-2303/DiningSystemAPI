import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/jwt.js";
import connection from "../db/db.js";

const createUser = async (req, res) => {
  const { name, password ,email} = req.body;
  console.log(email);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // const hashedPassword = await bcrypt.hash(password, 10);

  const find = `SELECT * FROM ADMIN WHERE NAME = ?`;
  connection.query(find, [name], (e, result) => {
    if (e) {
      res.status(400).json({ message: e.sqlMessage });
      return;
    } else if (result.length > 0) {
      res.status(400).json({ message: "User already exists" });
      return;
    } else {
      const query = `INSERT INTO ADMIN (NAME, PASSWORD, EMAIL) VALUES (?, ?, ?)`;
      connection.query(query, [name, hashedPassword,email], (e, result) => {
        if (e) {
          res.status(400).json({ message: e.sqlMessage });
        } else {
          res.status(200).json({ message: "Account successfully created" });
        }
      });
    }
  });
};

const loginUser = async (req, res) => {
  const { name, password ,email} = req.body;
  console.log(name, password,email);
  const query = `SELECT * FROM ADMIN WHERE NAME = ?`;
  connection.query(query, [name], async (e, result) => {
    if (e) {
      console.error(e);
      res.status(400).json({ message: "An error occurred. Please try again later." });
      return;
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = result[0];
    console.log('User Object:', user);

    if (!user.PASSWORD) {
      return res.status(500).json({ message: 'Password field is missing' });
    }

    try {
      const passwordMatch = await bcrypt.compare(password, result[0].PASSWORD);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(result[0].id, true);
      res.status(200).json({ token });
    } catch (bcryptError) {
      console.error(bcryptError);
      res.status(500).json({
        message:
          "An error occurred during authentication. Please try again later.",
      });
    }
  });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM ADMIN WHERE ID = ?`;
  connection.query(query, [id], (e, result) => {
    if (e) {
      res.status(400).json({ message: e.sqlMessage });
      return;
    } else {
      res.status(200).json({ message: "User deleted successfully" });
    }
  });
};

const getUsers = async (req, res) => {
  const query = `SELECT * FROM ADMIN`;
  connection.query(query, (e, result) => {
    if (e) {
      res.status(400).json({ message: e.sqlMessage });
      return;
    } else {
      res.status(200).json(result);
    }
  });
};

export { createUser, loginUser, deleteUser, getUsers };
