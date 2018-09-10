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

  await muteTarget.addRole(role).catch(err => {console.log(err.stack); });
  message.reply(`${muteTarget.user.username} has been muted! o7`);
}

module.exports.help = {
  name: 'mute'
}
