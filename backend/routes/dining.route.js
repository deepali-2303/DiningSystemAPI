import express from 'express';
import bookSlot, { addDiningPlace, searchByName, checkAvailability} from '../controllers/dining.controller.js'
import protectAdmin from '../middleware/adminAuth.js';
import protect from '../middleware/auth.js';

const router = express.Router();  

router.post('/admin/create', protectAdmin,addDiningPlace);
router.get('/search',searchByName);
router.get('/availability/:place_id',checkAvailability );
router.post('/book', protect, bookSlot)


export default router;