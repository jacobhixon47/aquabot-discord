const Discord = require('discord.js');
const auth = require('./auth.json');
const botSettings = require('./bot-settings.json');
const prefix = botSettings.prefix;

const client = new Discord.Client();

// bot is ready
client.on('ready', async () => {
  console.log('AquaBot is ready!');

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

  // commands switch cases (if, else)
  switch (command) {
    // !aquabot
    case `${prefix}aquabot`:
      message.reply('AquaBot is currently in development!');
      break;
    // !userinfo
    case `${prefix}userinfo`:
      // create RichEmbed with userInfo
      let embed = new Discord.RichEmbed()
          .setDescription("User Info")
          .setColor(botSettings.themeColor)
          .setAuthor(message.author.username)
          .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
          .addField("Created At", message.author.createdAt);
      // send message and log potential errors
      message.channel.send(embed).catch(err => {
        console.log(`\n\n//------ERROR------//\n\n${err.message}`);
        console.log(`\n\n//------STACK------//\n\n${err.stack}`);
      });
      break;
    // !mute
    case `${prefix}mute`:
      // check if command author has permission to use command
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(" you do not have this permission.");
      // get mute target or if none, end func
      var muteTarget = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
      if (!muteTarget) return message.channel.send("Oops! You didn't specify a user to mute.");
      // if target is author of command msg, end func
      if (muteTarget.id === message.author.id) return message.channel.send("You cannot mute yourself.");
      // if target is higher role than author, end func
      if (muteTarget.highestRole.position >= message.author.highestRole.position) return message.channel.send("You cannot mute someone with a higher role than you!");
      // look for muted role in guild
      var role = message.guild.roles.find(r => r.name === "Aqua Muted");
      // if muted role does not exist, create muted role
      if (!role) {
        try {
          role = await message.guild.createRole({
            name: "Aqua Muted",
            color: "#e4e4e4",
            permissions: []
          });
          // loop through channels & disable messages and reactions perms for the muted role
          message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(role, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            });
          });
        } catch(err) {
          console.log(`\n\n//------ERROR------//\n\n${err.message}`);
          console.log(`\n\n//------STACK------//\n\n${err.stack}`);
        }
      }
      if (muteTarget.roles.has(role.id)) return message.channel.send("This user is already muted!");

      await muteTarget.addRole(role).catch(err => {console.log(err.stack); });
      message.reply(`${muteTarget.user.username} has been muted! o7`);
      break;
    // !unmute
    case `${prefix}unmute`:
      // check if command author has permission to use command
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(" you do not have this permission.");
      // get user or if none, end func
      var muteTarget = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
      if (!muteTarget) return message.channel.send("Oops! You didn't specify a user to mute.");
      // check if target is the same as author
      if (muteTarget.id === message.author.id) return message.channel.send("You cannot unmute yourself.");
      // if target is higher role than author, end func
      if (muteTarget.highestRole.position >= message.author.highestRole.position) return message.channel.send("You cannot unmute someone with a higher role than you!");
      // Check for muted role
      var role = message.guild.roles.find(r => r.name === "Aqua Muted");
      // if muted role does not exist, create muted role
      if (!role || !muteTarget.roles.has(role.id)) return message.channel.send("This user is not muted!");

      await muteTarget.removeRole(role).catch(err => {console.log(err.stack); });
      message.reply(`${muteTarget.user.username} has been unmuted! o7`);
      break;
  }
});

client.login(auth.token);
