const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Church } = require("../models");

/*
Signup - POST /api/auth/signup
Creates a nex church account*/
async function signup(req, res, next) {
    try {
        const { name, pastorName, email, password } = req.body;

        // Check if required fields are present
        if (!name || !pastorName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if email is already taken
        const existing = await Church.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: "Email already in use" });
        }

        // Hashing password, 10 = salt rounds
        const passwordHash = await bcrypt.hash(password, 10);

        // Create church record in database
        const church = await Church.create({
            name,
            pastorName,
            email,
            passwordHash
        });

        // Sign a JWT token - payload must contain churchId
        const token = jwt.sign(
            { churchId: church.id },
            process.env.JWT_SECRET
        );

        // Return the token to the client
        return res.status(201).json({ token });

    } catch (err) {
        next(err);
    }
}

/* 
LOGIN - POST /api/auth/login
Verifies credentials and returns token*/
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // Validate if both fields are present
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find the church by email
        const church = await Church.findOne( {where: { email } });
        if (!church) {
            // Using same message as wrong password, confuse attacker
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare submitted password with stored hash using bcrypt.compare()
        const passwordMatch = await bcrypt.compare(password, church.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Sign a JWT token
        const token = jwt.sign(
            { churchId: church.id },
            process.env.JWT_SECRET
        );

        // Return token
        return res.status(200).json({ token });

    } catch (err) {
        next(err);
    }
}

/* ME - GET /api/auth/me
Returns currently logged in church
Protected - requireAuth runs first
and puts churchId on req.churchId */
async function me(req, res, next) {
    try {
        // req.churchId was set by requireAuth middleware
        const church = await Church.findByPk(req.churchId);

        if (!church) {
            return res.status(404).json({ error: "Church not found" });
        }

        // Return church data excluding passwordHash
        return res.status(200).json({
            id: church.id,
            name: church.name,
            pastorName: church.pastorName,
            email: church.email,
            welcomeSmsMessage: church.welcomeSmsMessage,
        });

    }
    catch (err) {
        next(err);
    }
}

module.exports = { signup, login, me };