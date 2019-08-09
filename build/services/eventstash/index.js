"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_event_1 = __importDefault(require("./methods/store-event"));
exports.default = (config) => ({
    storeEvent: store_event_1.default(config)
});
