const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Nie znaleziono użytkownika!");
    let rreason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setAuthor("Nowe zgłoszenie!", "https://imgur.com/moaBQdN.png")
    .setColor("#99b3ff")
    .addField("Na:", `${rUser} z ID: ${rUser.id}`) 
    .addField("Zreportowany przez:", `${message.author} z ID: ${message.author.id}`)
    .addField("Kanał:", message.channel)
    .addField("Czas:", message.createdAt)
    .addField("Powód:", rreason);


    let reportschannel = message.guild.channels.find(`name`, "reporty");
    if(!reportschannel) return message.channel.send("Nie znaleziono kanału reportów!");

    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);
}

module.exports.help = {
    name: "report"
}