require('dotenv').config();

const { Client, WebhookClient } = require('discord.js');
const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN,
);

const PREFIX = "$";

client.on('ready', () => {
    console.log(`${client.user.username}`);
});

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
        // console.log(CMD_NAME);
        if (CMD_NAME === 'kick') {
            if (!message.member.hasPermission('KICK_MEMBERS'))
                return message.reply('You do not have permission to use this commannd');
            if (args.length === 0) return message.reply('Please provide an ID');
            const member = message.guild.members.cache.get(args[0]);
            if (member) {
                member.kick()
                    .then((member) => message.channel.send(`${member} was kicked from the server.`))
                    .catch((err) => message.channel.send('I do not have permissions'));
            }
        
            else
                message.channel.send('That member was not found!');
            // console.log(member);
        } else if (CMD_NAME === 'ban') {
            if (!message.member.hasPermission('KICK_MEMBERS'))
                return message.reply('You do not have permission to use this commannd');
            if (args.length === 0) return message.reply('Please provide an ID');
            try {
                const user = await message.guild.members.ban(args[0]);
                message.channel.send(`${user} was removed successfully`);
            } catch (err) {
                console.log(err);
                message.channel.send('An error occured');
            }
        } else if (CMD_NAME === 'announce') {
            console.log(args);
            const msg = args.join(' ');
            console.log(msg);
            webhookClient.send(msg);
        }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    console.log('Hello');
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '863094807886823454') {
        switch (name) {
            case '🥕':
                member.roles.add('863093669245747232');
                break;
            case '🍌':
                member.roles.add('863093777672306699');
                break;
            case '🍑':
                member.roles.add('863093741786234923');
                break;
            case '🍒':
                member.roles.add('863093832634728488');
                break;
        }
    }
});

client.on('messageReactionRemove', (reaction, user) => {
    console.log('Hello');
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '863094807886823454') {
        switch (name) {
            case '🥕':
                member.roles.remove('863093669245747232');
                break;
            case '🍌':
                member.roles.remove('863093777672306699');
                break;
            case '🍑':
                member.roles.remove('863093741786234923');
                break;
            case '🍒':
                member.roles.remove('863093832634728488');
                break;
        }
    }
})

client.login(process.env.DISCORDJS_BOT_TOKEN);