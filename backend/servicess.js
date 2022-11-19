import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

// import data
import users from './data/users.js';

// import models
import User from './models/userModel.js';
// connect db
import connectDB from './config/db.js';

dotenv.config()

connectDB()

const importData = async () => {
    try {

        // delete data if already exists
      
        await User.deleteMany();
       

        // add users to the database
        const createdUser = await User.insertMany(users)
        const adminUser = createdUser[0]._id

      
        console.log('Data Imported'.green.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1)
    }
}

const destroyData = async () => {
    try {

        // delete data if already exists
        await User.deleteMany();

        console.log('Data Destroyed'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}




