const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    console.log("Loading events...");
    const eventsFolder = path.join(process.cwd(), 'src', 'events');

    if (!fs.existsSync(eventsFolder)) {
        fs.mkdirSync(eventsFolder, { recursive: true });
    }

    const files = fs.readdirSync(eventsFolder).filter(file => file.endsWith('.js'));

    for (const file of files) {
        const event = require(path.join(eventsFolder, file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
    console.log(`Loaded ${files.length} events.`);
};
