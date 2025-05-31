"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ctos_controller_1 = require("../controllers/ctos.controller");
const router = (0, express_1.Router)();
router.get('/ultimo', ctos_controller_1.getUltimoCTO);
router.post('/', ctos_controller_1.postCTO);
exports.default = router;
