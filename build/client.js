"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Client, GatewayIntentBits } = require('discord.js');
exports.default = () => {
    return new Client({ intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ] });
};
