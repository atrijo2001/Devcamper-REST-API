const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const User = require('../models/User')

//@desc   Register user
// @route   POST api/v1/auth/register
//@access public
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;

    //Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // const token = user.getSignedJwtToken()

    // res.status(200).json({success: true, user});
    //Generate a token
    sendTokenResponse(user, 200, res)
});

//@desc   Login user
// @route   POST api/v1/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password} = req.body;

    //Validate email and password
    if(!email || !password){
        return next(new ErrorResponse('Please provide an email', 400))
    }

    //Check for the user
    const user = await User.findOne({email: email}).select('+password');

    if(!user){
        return next(new ErrorResponse('Invalid credentials', 401))
    }
   
    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    //Generate a token
    // const token = user.getSignedJwtToken()

    // res.status(200).json({success: true, token});
    sendTokenResponse(user, 200, res)
});


//@desc   Get current logged in user
//@route  POST api/v1/auth/me
//@access Private
exports.getMe = asyncHandler(async(req, res, next)=>{
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: user
    })
})

//@desc   Forgot password
//@route  POST api/v1/auth/forgotpassword
//@access Public
exports.forgotPassword = asyncHandler(async(req, res, next)=>{
  const user = await User.findOne({email: req.body.email})

  if(!user){
    return next(new ErrorResponse('No such user exists', 404))
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken()


  await user.save({validateBeforeSave: false})

  res.status(200).json({
    success: true,
    data: user
  })
})





// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + 30* 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
