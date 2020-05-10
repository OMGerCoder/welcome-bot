const { Client } = require('discord.js');
const bot = new Client();
const Sequelize = require('sequelize');
const dotenv = require('dotenv')
dotenv.config();
const db = new Sequelize('db', 'user', 'password', {
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
})

const guildWelcomeChannels = db.define('guild_welcome_channels', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    guild_id: Sequelize.STRING,
    channel_id: Sequelize.STRING
})
bot.on('ready', () =>{
    console.log('Ready');
    guildWelcomeChannels.sync();
})
bot.on('message', msg =>{
    if(!msg.content.startsWith('+') || msg.author.bot) return;
    const args = msg.content.slice(1).split(' ');
    const cmd = args.shift().toLowerCase()
    if(cmd === 'linkwelcomechannel') {
        const channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0]);
        if(!channel) return msg.channel.send('Invalid channel.')
        
        guildWelcomeChannels.findOne({where: {guild_id: msg.guild.id}}).then((obj) =>{
            if(obj) return msg.channel.send('You can only have one welcome channel in the database!')
            guildWelcomeChannels.create({ guild_id: msg.guild.id, channel_id: channel.id })
            return msg.channel.send('Done!');
        })
    }
})
bot.login(process.env.TOKEN)