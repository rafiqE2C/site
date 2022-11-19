import express from 'express'
import asyncHandler from 'express-async-handler'
import User from './../models/userModel.js';
import generateToken from './../utils/genarateToken.js'

// @desc    Auth user & token
// @rout    POST /api/users/login
// @access  public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

   
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            date: user.date,
            phonenumber: user.phonenumber,
            address: user.address,
            description: user.description,
            level: user.level,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('البريد الإلكتروني أو كلمة السر خاطئة')
    }
})



// @desc    Register new user
// @desc    Register new user
// @rout    POST /api/users/
// @access  public
const registerUser = asyncHandler(async (req, res) => {
    const { name,  date, phonenumber, address,  description, level , email, password } = req.body

   //User.find({ "email": { "$nin": [ null, "" ] } })

   //Client.find({logo: {$nin: ["", null]}})
   

    const user = await User.create({
        name,
        date,
        phonenumber,
        address,
        description,
        level,
        email,
        password
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            date: user.date,
            phonenumber: user.phonenumber,
            address: user.address,
            description: user.description,
            level: user.level,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    GET user profile
// @rout    GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,

            date: user.date,
            address: user.address,
            level: user.level,
            phonenumber: user.phonenumber,
            description: user.description,

            isAdmin: user.isAdmin,
        })
    } else {
        res.status(401)
        throw new Error('User not found!!')
    }
})

// @desc    update user profile
// @rout    PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

    
        user.date = req.body.date || user.date
        user.address = req.body.address || user.address
        user.level = req.body.level || user.level
        user.phonenumber = req.body.phonenumber || user.phonenumber
        user.description = req.body.description || user.description

        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            
            date: updatedUser.date,
            address: updatedUser.address,
            level: updatedUser.level,
            phonenumber: updatedUser.phonenumber,
            description: updatedUser.description,
            
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(401)
        throw new Error('User not found!!')
    }
})

// @desc    GET all users
// @rout    GET /api/users/
// @access  Private/ADMIN
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

// @desc    delete user profile
// @rout    DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        await user.remove()
        res.json({ message: 'User Removed' })
    } else {
        res.status(401)
        throw new Error('User not found!!')
    }
})

// @desc    GET user by id
// @rout    GET /api/users/:id
// @access  Private/ADMIN
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(401)
        throw new Error('User not found!!')
    }
})

// @desc    update user
// @rout    PUT /api/users/
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        user.date = req.body.date || user.date
        user.address = req.body.address || user.address
        user.level = req.body.level || user.level
        user.phonenumber = req.body.phonenumber || user.phonenumber
        user.description = req.body.description || user.description

        user.isAdmin = req.body.isAdmin

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,

            date: updatedUser.date,
            address: updatedUser.address,
            level: updatedUser.level,
            phonenumber: updatedUser.phonenumber,
            description: updatedUser.description,

            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(401)
        throw new Error('User not found!!')
    }
})

export {
    authUser,
    getUserProfile,
    registerUser,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}