import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

const commands = [];
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const commandsPath = path.join(__dirname, './commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

const commandsPath = "./dist/commands";
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
    const filePath = "./commands/" + file;
    const command = await import(filePath);
    if ('data' in command) {
        commands.push(command.data.toJSON());
        console.log(`Command ${command.data.name} loaded`);
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string);

try {
    console.log('Started refreshing application (/) commands.');
    console.log(commands.map(command => command.name));
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID as string),
        { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
} 