import express from 'express'
const router = express.Router()

import { 
    authUser, 
    getUserProfile, 
    registerUser, 
    updateUserProfile, 
    getUsers, 
    deleteUser,
    getUserById,
    updateUser
} from '../controllers/userController.js'
import { protect, admin } from './../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)



    //////////email
    
    router.post("/contact", (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const message = req.body.message; 
        const mail = {
          from: name,
          to: "***************@gmail.com",
          subject: "Contact Form Submission",
          html: `<p>Name: ${name}</p>
                 <p>Email: ${email}</p>
                 <p>Message: ${message}</p>`,
        };
        contactEmail.sendMail(mail, (error) => {
          if (error) {
            res.json({ status: "ERROR" });
          } else {
            res.json({ status: "Message Sent" });
          }
        });
      });

export default router