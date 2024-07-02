"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gateway_1 = require("../handlers/gateway");
const router = (0, express_1.Router)();
//====================================================================================
// one tiem account router
router.get('/transfer-account/:gurasaNum/:suyaNum', (req, res) => (0, gateway_1.generateOneTimeAcc)(req, res));
router.post('/webhook', (req, res) => (0, gateway_1.webhookHandler)(req, res));
exports.default = router;
//# sourceMappingURL=gateway.js.map