const fs = require('fs');

module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(" you do not have this permission.");
  // get mute target or if none, end func
  var muteTarget = message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
  console.log(`//------> MUTE TARGET HIGHEST ROLE: ${muteTarget.highestRole.calculatedPosition}`);
  console.log(`//------> AUTHOR HIGHEST ROLE: ${message.member.highestRole.calculatedPosition}`);
  if (!muteTarget) return message.channel.send("Oops! You didn't specify a user to mute.");
  // if target is author of command msg, end func
  if (muteTarget.id === message.author.id) return message.channel.send("You cannot mute yourself.");
  // if target is higher role than author (message.member), end func
  if (muteTarget.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition) return message.channel.send("You cannot mute someone with a higher role than you!");
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
        }).catch(err => {
          console.log(`//------ERROR------//\n\n${err.stack}`);
        });
      });
    } catch(err) {
      console.log(`\n\n//------ERROR------//\n\n${err.message}`);
      console.log(`\n\n//------STACK------//\n\n${err.stack}`);
    }
  }
  if (muteTarget.roles.has(role.id)) return message.channel.send("This user is already muted!");
  // if the mute author did not specify a time:
  if (isNaN(args[1])) {
    message.channel.send('You did not specify how long the user should be muted! use **!mute** to indefinitely mute a user.');
  } else {
    client.tempMutedUsers[muteTarget.id] = {
      guild: message.guild.id,
      // convert 'minutes' number to milliseconds
      time: Date.now() + parseInt(args[1]) * 60000
    }
    // after the target has been given the muted role, reply to confirm the action
    await muteTarget.addRole(role).catch(err => {console.log(err.stack); });
    // write the object to 'muted-users.json'
    fs.writeFile('./temp-muted-users.json', JSON.stringify(client.tempMutedUsers, null, 4), err => {
      if (err) throw err;
      message.channel.send(`${muteTarget.user.username} has been muted for ${args[1]} minutes! o7`);
    });
  }
}

module.exports.help = {
  name: 'tempmute'
}
