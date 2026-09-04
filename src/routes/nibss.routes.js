const express = require("express");
const authApi = require("../integrations/nibss/auth.api");
const router = express.Router();

router.post("/onboard", async (req, res, next) => {
    try {
        const result = await authApi.onboardFintech(req.body);

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error)
    }
});

router.post("/login", async( req, res, next ) => {
    try {
        const result = await authApi.login();

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error)
    }
});

module.exports = router;