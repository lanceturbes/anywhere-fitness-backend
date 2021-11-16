// Libraries
const express = require("express")
const helmet = require("helmet")
const cors = require("cors")

// Custom Middleware
const handleError = require("./middleware/handle-error")
const authRouter = require("./auth/auth-router")
const usersRouter = require("./users/users-router")
const fitnessClassesRouter = require("./fitness-classes/fitness-classes-router")

// Server Instantiation
const server = express()

// Middleware Application
server.use(express.json())
server.use(helmet())
server.use(cors())

// Routers
server.use("/api/auth", authRouter)
server.use("/api/users", usersRouter)
server.use("/api/classes", fitnessClassesRouter)

// Error Handler
server.use(handleError)

// Server Export
module.exports = server
