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
bot.login(process.env.TOKEN)