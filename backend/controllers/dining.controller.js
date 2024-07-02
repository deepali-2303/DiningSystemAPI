import connection from "../db/db.js";


const addDiningPlace = async (req, res) => {
  const { name, address, phone_no, website, operational_hours, booked_slots } = req.body;


  const findQuery = `SELECT * FROM dining_places WHERE name = ? AND address = ?`;
  connection.query(findQuery, [name, address], (err, result) => {
    if (err) {
      res.status(400).json({ message: err.sqlMessage });
      return;
    } else if (result.length > 0) {
      res.status(400).json({ message: "Dining place already exists" });
      return;
    } else {
      const insertQuery = `
        INSERT INTO dining_places (name, address, phone_no, website, open_time, close_time, booked_slots)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      connection.query(insertQuery, [
        name,
        address,
        phone_no,
        website,
        operational_hours.open_time,
        operational_hours.close_time,
        JSON.stringify(booked_slots)
      ], (err, result) => {
        if (err) {
          res.status(400).json({ message: err.sqlMessage });
        } else {
          res.status(200).json({
            message: `${name} added successfully`,
            place_id: result.insertId,
            status_code: 200
          });
        }
      });
    }
  });
};


const searchByName = (req,res) => {
  const { name } = req.query;


  const query = `SELECT * FROM dining_places WHERE name LIKE ?`;
  
  connection.query(query, [`%${name}%`], (err, results) => {
    if (err) {
      res.status(400).json({ message: err.sqlMessage });
      return;
    }
    
    const formattedResults = results.map(place => ({
      place_id: place.id,
      name: place.name,
      address: place.address,
      phone_no: place.phone_no,
      website: place.website,
      operational_hours: {
        open_time: place.open_time,
        close_time: place.close_time
      },
      booked_slots: JSON.parse(place.booked_slots)
    }));

    res.status(200).json({ results: formattedResults });
  });
}






const checkAvailability = async (req, res) => {
  const {place_id} = req.params;
  const {  start_time, end_time } = req.body;

  if (!place_id || !start_time || !end_time) {
    res.status(400).json({ message: "place_id, start_time, and end_time query parameters are required" });
    return;
  }


  const findPlaceQuery = `SELECT booked_slots FROM dining_places WHERE id = ?`;

  connection.query(findPlaceQuery, [place_id], (err, results) => {
    if (err) {
      res.status(400).json({ message: err.sqlMessage });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: "Dining place not found" });
      return;
    }

    let bookedSlots = results[0].booked_slots ? JSON.parse(results[0].booked_slots) : [];

    const slotExists = bookedSlots.some(slot => {
      const existingStartTime = new Date(slot.start_time);
      const existingEndTime = new Date(slot.end_time);
      const requestedStartTime = new Date(start_time);
      const requestedEndTime = new Date(end_time);

      return (
        (requestedStartTime >= existingStartTime && requestedStartTime < existingEndTime) ||
        (requestedEndTime > existingStartTime && requestedEndTime <= existingEndTime) ||
        (requestedStartTime < existingStartTime && requestedEndTime > existingEndTime)
      );
    });

    if (slotExists) {
      res.status(400).json({ message: "Requested slot overlaps with existing bookings" });
      return;
    }



    res.status(200).json({
      place_id,
      available: true,
      next_available_slot: null, 
    });
  });
};



const bookSlot = async (req, res) => {
  const { place_id, start_time, end_time } = req.body;


  if (!place_id || !start_time || !end_time) {
    res.status(400).json({ message: "place_id, start_time, and end_time are required" });
    return;
  }


  const checkSlotQuery = `SELECT booked_slots FROM dining_places WHERE id = ?`;

  connection.query(checkSlotQuery, [place_id], (err, results) => {
    if (err) {
      res.status(400).json({ message: err.sqlMessage });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: "Dining place not found" });
      return;
    }

    let bookedSlots = results[0].booked_slots ? JSON.parse(results[0].booked_slots) : [];


    const slotExists = bookedSlots.some(slot => {
      const existingStartTime = new Date(slot.start_time);
      const existingEndTime = new Date(slot.end_time);
      const requestedStartTime = new Date(start_time);
      const requestedEndTime = new Date(end_time);

      return (
        (requestedStartTime >= existingStartTime && requestedStartTime < existingEndTime) ||
        (requestedEndTime > existingStartTime && requestedEndTime <= existingEndTime) ||
        (requestedStartTime < existingStartTime && requestedEndTime > existingEndTime)
      );
    });

    if (slotExists) {
      res.status(400).json({ status: "Slot is not available at this moment, please try some other place", status_code: 400 });
      return;
    }


    bookedSlots.push({ start_time, end_time });

    const updateQuery = `UPDATE dining_places SET booked_slots = ? WHERE id = ?`;
    connection.query(updateQuery, [JSON.stringify(bookedSlots), place_id], (err, result) => {
      if (err) {
        res.status(400).json({ message: err.sqlMessage });
        return;
      }

      const booking_id = result.insertId; 
      res.status(200).json({ status: "Slot booked successfully", status_code: 200, booking_id });
    });
  });
};

export default bookSlot;







export {addDiningPlace,searchByName, checkAvailability};