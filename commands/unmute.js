module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(" you do not have this permission.");
  // get user or if none, end func
  var muteTarget = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  console.log(`//------> AUTHOR HIGHEST ROLE: ${message.member.highestRole.calculatedPosition}`);
  console.log(`//------> TARGET HIGHEST ROLE: ${muteTarget.highestRole.calculatedPosition}`);
  if (!muteTarget) return message.channel.send("Oops! You didn't specify a user to mute.");
  // check if target is the same as author
  if (muteTarget.id === message.author.id) return message.channel.send("You cannot unmute yourself.");
  // if target is higher role than author(message.member), end func
  if (muteTarget.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition) return message.channel.send("You cannot unmute someone with a higher role than you!");
  // Check for muted role
  var role = message.guild.roles.find(r => r.name === "Aqua Muted");
  // if muted role does not exist, create muted role
  if (!role || !muteTarget.roles.has(role.id)) return message.channel.send("This user is not muted!");

  await muteTarget.removeRole(role).catch(err => {console.log(err.stack); });
  message.reply(`${muteTarget.user.username} has been unmuted! o7`);
}

module.exports.help = {
  name: 'unmute'
}
