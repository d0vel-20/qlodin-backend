"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Configure storage engine
const storage = multer_1.default.memoryStorage(); // Store file in memory
// Initialize upload
const upload = (0, multer_1.default)({ storage });
exports.default = upload;