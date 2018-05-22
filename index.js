const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./commands", (err,files) =>{

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Nie znaleziono komendy");
        return;
    }

    jsfile.forEach((f, i)=>{
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    })

})



bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);

    bot.user.setActivity("sa-rp.pl", {type: "STREAMING"});

   // bot.user.setGame("sa-rp.pl");
});

bot.on("message", async message =>{
    if(message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd =  messageArray[0];
    let args =  messageArray.slice(1);

    let commandFile = bot.commands.get(cmd.slice(prefix.length));
    if(commandFile) commandFile.run(bot, message, args);
    // Kickowanie z serwera
    if(cmd === `${prefix}kick`){


        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!kUser) return message.channel.user("Nie znaleziono użytkownika!");
        let kReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Nie masz uprawnień!");
        if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Tej osoby nie możesz wyrzucić!");
        let kickEmbed = new Discord.RichEmbed()
        .setDescription("KICK")
        .setColor("#99b3ff")
        .addField("Wyrzucony", `${kUser} z ID: ${kUser.id}`)
        .addField("Wyrzucony przez:", `<@${message.author.id}> z ID ${message.author.id}`)
        .addField("Wyrzucony w:", message.channel)
        .addField("Czas:", message.createdAt)
        .addField("Powód:", kReason);
        let kickChannel = message.guild.channels.find(`name`, "logi");
        if(!kickChannel) return message.channel.send("Nie znaleziono kanału reportów");

        message.guild.member(kUser).kick(kReason);
        kickChannel.send(kickEmbed);
        return;
    }
    
    // Banowanie
    if(cmd===`${prefix}ban`)
    {
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) return message.channel.send("Nie znaleziono użytkownika!");
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("Nie masz uprawnień!");
        if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Tej osoby nie możesz zbanować");
    
        let banEmbed = new Discord.RichEmbed()
        .setAuthor("BAN", "https://imgur.com/Q8zWlKi.png")
        .setColor("#bc0000")
        .addField("Zbanowany:", `${bUser} with ID ${bUser.id}`)
        .addField("Zbanowany przez:", `<@${message.author.id}> with ID ${message.author.id}`)
        .addField("Zbanowany w:", message.channel)
        .addField("Czas", message.createdAt)
        .addField("Powód:", bReason);
    
        let incidentchannel = message.guild.channels.find(`name`, "logi");
        if(!incidentchannel) return message.channel.send("Nie znaleziono kanału reportów");
    
        message.guild.member(bUser).ban(bReason);
        incidentchannel.send(banEmbed);
        return;
    }


    //Wysyłanie reportów
    if(cmd === `${prefix}report`){
        return;
    }


    // Informacje o serwerze
    if(cmd === `${prefix}serverinfo`){
        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
        
        .setDescription("Informacje o serwerze")
        .setColor("#99b3ff")
        .setThumbnail(sicon)
        .addField("Nazwa serwera:", message.guild.name)
        .addField("Wszystkich użytkowników:", message.guild.memberCount)
        .addField("Zrobiony w:", message.guild.createdAt)
        .addField("Dolączyłeś w:", message.member.joinedAt);

        return message.channel.send(serverembed);
    }
    // Informacje o bocie
    if(cmd === `${prefix}botinfo`){

        let bicon = bot.user.displayAvatarURL;
        let botembed = new Discord.RichEmbed()
        .setDescription("Info:")
        .setColor("#99b3ff")
        .setThumbnail(bicon)
        .addField("Nazwa", bot.user.username)
        .addField ("Zrobiony w", bot.user.createdAt);

        return message.channel.send(botembed);
    }

    //Propozycje
    if(cmd === `${prefix}propozycja`){

        let prIcon = user.displayAvatarURL;
        let prop = args.join(" ").slice(22);
        let propEmbed = new Discord.RichEmbed()
        .setAuthor("Nowa propozycja!", "https://imgur.com/nDkfdpn.png")
        .setColor("#ffff66")
        .setThumbnail(prIcon)
        .addField("Wysłał:", `${message.author} z ID: ${message.author.id}`)
        .addField("Treść:", prop);

        let propChannel = message.guild.channels.find(`name`, "propozycje");
        if(!propChannel) return message.channel.send("Nie znaleziono kanału propozycji!");
        message.delete().catch(O_o=>{});
        return propChannel.send(propEmbed);
    }

    //Clever bot
    bot.on("message", (message) => {
        if(message.content.startsWith("kiedy start?")){
            message.channel.send("Jeżeli wszystko zostanie dokończone w skrypcie.");
        }
    });

});

bot.login(tokenfile.token);