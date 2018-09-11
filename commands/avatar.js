module.exports.run = async (client, message, args) => {
  if (message.mentions.users.first()) {
    message.channel.send(`**${message.mentions.users.first().username}**'s avatar:`, {
      embed: {
        files: [{
          attachment: message.mentions.users.first().displayAvatarURL,
          name: 'avatar.jpg'
        }]
      }
    }).catch(console.error);
  } else {
    message.channel.send(`**${message.author.username}**'s avatar:`, {
      embed: {
        files: [{
          attachment: message.author.displayAvatarURL,
          name: 'avatar.jpg'
        }]
      }
    }).catch(console.error);
  }
}

module.exports.help = {
  name: "avatar"
}
