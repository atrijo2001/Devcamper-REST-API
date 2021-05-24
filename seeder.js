const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')


//Load env variables
dotenv.config({path: './config/config.env'})

//Load Models
const Bootcamp = require('./Models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')
const Review = require('./models/Review')

//Connect to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

//Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'))



//Import into the DB
const ImportData = async() => {
    try {
        await Course.create(courses)
        await Bootcamp.create(bootcamps)
        await User.create(users)
        await Review.create(reviews)

        console.log('Data imported'.green.inverse)
        process.exit()
    } catch (error) {
        console.error(error);
        
    }
}

//Delete Data
const deleteData = async() => {
    try {
        await Course.deleteMany()
        await Bootcamp.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Data Destroyed...'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(error);
        
    }
}

if(process.argv[2] === '-i'){
    ImportData()
} else if(process.argv[2] === '-d'){
    deleteData()
}