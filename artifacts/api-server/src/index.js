const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Reaction, Partials.Message, Partials.Channel]
});

const http = require('http');
const PORT = process.env.PORT || 5000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
}).listen(PORT, () => {
    console.log(`[✅] Health server on port ${PORT}`);
});

client.commands = new Collection();
client.config = config;

const editsCandidatePaths = [
    path.join(__dirname, '..', 'edits.json'),
    path.join(process.cwd(), 'edits.json')
];

const getLatestEdits = () => {
    for (const p of editsCandidatePaths) {
        if (fs.existsSync(p)) {
            try {
                return JSON.parse(fs.readFileSync(p, 'utf8')) || {};
            } catch (err) {
                return {};
            }
        }
    }
    return {};
};

client.edits = new Proxy({}, {
    get(target, prop) {
        const liveData = getLatestEdits();
        return liveData[prop];
    }
});

process.on("unhandledRejection", (reason) => {
    console.log("\n[🚩 Anti-Crash] unhandled Rejection:");
    console.log(reason && reason.stack ? String(reason.stack) : String(reason));
});
process.on("uncaughtException", (err) => {
    console.log("\n[🚩 Anti-Crash] uncaught Exception:");
    console.log(err.stack ? err.stack : err);
});

require('./handlers/events')(client);
require('./handlers/commands')(client);
require('./handlers/advancedLogger')(client);

const token = config.token || process.env.DISCORD_BOT_TOKEN;
if (token) {
    client.login(token).catch(err => console.log("Login Error:", err));
} else {
    console.log("Please provide a valid token in config.json or DISCORD_BOT_TOKEN env variable.");
}

module.exports = client;
