const { Router } = require('express');


const router = Router();

router.get('/', (req, res) => {
    return res.send("server running ...");
});

module.exports = router;