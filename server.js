const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/DB')
const errorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const cookieparser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit');
const hpp = require('hpp')
const cors = require('cors')

//Load env vars
dotenv.config({path: './config/config.env'});

//Routes
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const user = require('./routes/users')
const reviews = require('./routes/Review');


const app = express();
connectDB()

//Body Parser
app.use(express.json())

//Cookie Parser
app.use(cookieparser())

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//File uploading
app.use(fileupload())

//Sanitize data
app.use(mongoSanitize())

//Prevent cross side scripting
app.use(xss())

//Set security headers
app.use(helmet())

//Enable cors
app.use(cors())

//Rate Limiting
const limiter = rateLimit({
    windowMs: 10*1000*60, //10mins
    max: 100
})

app.use(limiter)

//Prevent http param pollution
app.use(hpp())


//Set static folder
app.use(express.static(path.join(__dirname, "public")))

//Mount the routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/user', user)
app.use('/api/v1/reviews', reviews)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold));


//Handle unhandled promise rejections
process.on('unhandled rejection', (err, promise)=>{
    console.log(`Error ${err.message}.red`);
    //Close server and exit process
    server.close(()=> process.exit(1));
})