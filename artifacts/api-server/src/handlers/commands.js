const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    console.log("Loading commands...");
    const commandsFolder = path.join(process.cwd(), 'src', 'commands');

    if (!fs.existsSync(commandsFolder)) {
        fs.mkdirSync(commandsFolder, { recursive: true });
    }

    const loadCommands = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const tempStat = fs.statSync(fullPath);
            if (tempStat.isDirectory()) {
                loadCommands(fullPath);
            } else if (file.endsWith('.js')) {
                const command = require(fullPath);
                if (command.name) {
                    client.commands.set(command.name, command);
                }
            }
        }
    };

    loadCommands(commandsFolder);
    console.log(`Loaded ${client.commands.size} commands.`);
};
