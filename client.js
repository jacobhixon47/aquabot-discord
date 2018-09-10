const Discord = require('discord.js');
const auth = require('./auth.json');
const botSettings = require('./bot-settings.json');
const fs = require('fs');

const prefix = botSettings.prefix;

const client = new Discord.Client();
client.commands = new Discord.Collection();

// read directory of commands
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  // filter .js files
  let cmdFiles = files.filter(f => f.split(".").pop() === "js");
  if (cmdFiles.length <= 0) {
    console.log("//------> No commands to load!");
    return;
  }
  console.log(`//------> Loading ${cmdFiles.length} commands!`);
  // loop through .js command files
  cmdFiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    client.commands.set(props.help.name, props);
    console.log(`//------> ${i + 1}: command "${f}" loaded!`);
  });
});

// bot is ready
client.on('ready', async () => {
  console.log('AquaBot is ready!');
  console.log(client.commands);

// create and log invite link
  try {
    let link = await client.generateInvite(['ADMINISTRATOR']);
    console.log(link);
  } catch(err) {
    console.log(err.stack);
  }
});

// when message is sent in channel
client.on('message', async message => {
  // if author is a bot, end func
  if (message.author.bot) return;
  // if message is a DM, end func
  if (message.channel.type === 'dm') return;
  // separate first word, as 'command', from rest of message args
  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);
  // if the first word of a message doesn't begin with "!", end func
  if (!command.startsWith(prefix)) return;

  // -- NEW BOT COMMANDS FUNCTIONALITY
  let cmd = client.commands.get(command.slice(prefix.length));
  if (cmd) cmd.run(client, message, args);
});

client.login(auth.token);
