const { Church } = require("../models");

// GET PROFILE - GET /api/church/profile

async function getProfile(res, req, next) {
    try {
        // req.churchId comes from requireAuth middleware
        const church = await Church.findByPk(req.churchId);

        if (!church) {
            return res.status(404).json({ error: "Church not found" });
        }

        // Return all profile fields
        return res.status(200).json({
            id: church.id,
            name: church.name,
            pastorName: church.pastorName,
            email: church.email,
            welcomeSmsMessage: church.welcomeSmsMessage,
        });

    } catch (err) {
        next(err);
    }
}

// UPDATE PROFILE - PUT /api/church/profile
async function updateProfile(req, res, next) {
    try {
        // Find church by id
        const church = await Church.findByPk(req.churchId);

        if (!church) {
            return res.status(404).json({ error: "Church not found" });
        }

        // Extracting fields we allow to be updated(email and passwordHash not here, they need dedicated endpoints with extra check)
        const { name, pastorName, welcomeSmsMessage } = req.body;

        // Build update object only including fields sent in the request
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (pastorName !== undefined) updates.pastorName = pastorName;
        if (welcomeSmsMessage !== undefined) updates.welcomeSmsMessage = welcomeSmsMessage;

        // Apply the updates
        await church.update(updates);

        // Return updated profile
        return res.status(200).json({
            id: church.id,
            name: church.name,
            pastorName: church.pastorName,
            email: church.email,
            welcomeSmsMessage: church.welcomeSmsMessage,
        });

    } catch (err) {
        next(err);
    }
}

module.exports = { getProfile, updateProfile };