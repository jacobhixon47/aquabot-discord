const Discord = require('discord.js');
const botSettings = require('./../bot-settings.json');

module.exports.run = async (client, message, args) => {
  let embed = new Discord.RichEmbed()
  .setDescription('User Info')
  .setColor(botSettings.themeColor)
  .setAuthor(message.author.username)
  .addField('Full Username', `${message.author.username}#${message.author.discriminator}`)
  .addField('Created At', message.author.createdAt);
  // send message and log potential errors
  message.channel.send(embed).catch(err => {
    console.log(`\n\n//------ERROR------//\n\n${err.message}`);
    console.log(`\n\n//------STACK------//\n\n${err.stack}`);
  });
}

module.exports.help = {
  name: "userInfo"
}
