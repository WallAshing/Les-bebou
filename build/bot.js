"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const discord_js_1 = require("discord.js");
const client_1 = __importDefault(require("./client"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const client = (0, client_1.default)();
const prefix = '?';
const commandsPath = path.join(__dirname, 'commands');
const messageCommandsPath = path.join(commandsPath, 'messages');
const messageCommands = new discord_js_1.Collection();
const messageCommandFiles = fs.readdirSync(messageCommandsPath).filter(file => file.endsWith('.js'));
for (const file of messageCommandFiles) {
    const filePath = path.join(messageCommandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        messageCommands.set(command.data.name, command);
    }
    else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}
client.once('ready', () => {
    console.log('Discord bot started successfully');
});
client.on(discord_js_1.Events.MessageCreate, (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (message.author.bot)
        return;
    if (message.content.toLowerCase()[0] !== '?')
        return;
    const command = messageCommands.get((_a = message.content.toLowerCase()) === null || _a === void 0 ? void 0 : _a.substring(1));
    if (!command)
        return;
    try {
        yield command.execute(message);
    }
    catch (error) {
        yield message.channel.send('There were an error');
        console.log(error);
    }
}));
const interactionCommandsPath = path.join(commandsPath, 'interactions');
const interactionCommands = new discord_js_1.Collection();
const interactionCommandFiles = fs.readdirSync(interactionCommandsPath).filter(file => file.endsWith('.js'));
for (const file of interactionCommandFiles) {
    const filePath = path.join(interactionCommandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        interactionCommands.set(command.data.name, command);
    }
    else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isChatInputCommand())
        return;
    const command = interactionCommands.get(interaction.commandName);
    try {
        yield command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            yield interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        else {
            yield interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
    // if (interaction.commandName === 'ask') {
    //     await interaction.reply({content: 'What is your question', ephemeral: true});
    // }
}));
client.login(process.env.DISCORD_TOKEN).then(() => console.log('successfully logged-in'));
