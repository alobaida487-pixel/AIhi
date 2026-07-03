const fs = require('fs');
const path = require('path');

function generateTranscriptHTML(messages, channelName, guildIcon) {
    const templatePath = path.join(process.cwd(), 'templates', 'transcript.html');

    let template = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>سجل التذكرة - {{CHANNEL_NAME}}</title><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet"><style>body{background-color:#313338;color:#dbdee1;font-family:'Cairo',sans-serif;margin:0;padding:0;line-height:1.5}.container{max-width:900px;margin:0 auto;padding:20px}.header{background:#2b2d31;border-radius:12px;padding:25px;display:flex;align-items:center;box-shadow:0 4px 15px rgba(0,0,0,0.2);margin-bottom:30px;border-bottom:3px solid #5865f2}.server-img{width:70px;height:70px;border-radius:50%;margin-left:20px;border:2px solid #5865f2;padding:2px}.header-info h1{margin:0;font-size:26px;color:#fff;font-weight:700}.header-info p{margin:5px 0 0 0;color:#949ba4;font-size:14px}.message{display:flex;padding:10px 15px;margin-bottom:10px;border-radius:8px;transition:background 0.2s}.message:hover{background-color:#2b2d31}.avatar{width:45px;height:45px;border-radius:50%;margin-left:15px;object-fit:cover}.message-content{flex:1;display:flex;flex-direction:column}.message-header{display:flex;align-items:center;margin-bottom:4px}.author-name{font-weight:600;font-size:16px;color:#fff;margin-left:10px}.message-time{font-size:12px;color:#949ba4}.text{font-size:15px;color:#dbdee1;white-space:pre-wrap;word-wrap:break-word}.embed{background-color:#2b2d31;border-right:4px solid #5865f2;border-radius:4px;padding:12px 16px;margin-top:10px;max-width:500px}.embed-title{font-weight:700;color:#fff;margin-bottom:6px}.embed-description{font-size:14px;color:#dbdee1;white-space:pre-wrap}hr{border:0;height:1px;background:#3f4147;margin:30px 0}.footer{text-align:center;color:#949ba4;font-size:13px;padding:30px 0;font-weight:600}.system-badge{background:#5865f2;color:white;font-size:10px;padding:2px 6px;border-radius:4px;margin-right:8px;margin-left:8px}</style></head><body><div class="container"><div class="header"><!-- SERVER_ICON_CONTENT --><div class="header-info"><h1>تذكرة الدعم: {{CHANNEL_NAME}}</h1><p>نسخة محفوظة من المحادثة • حصرياً لسيرفرك</p></div></div><div class="messages-container"><!-- MESSAGES_CONTENT --></div><hr><div class="footer">تمت العملية بواسطة أنظمة متطورة • Thailand Codes &copy; {{YEAR}} All Rights Reserved.</div></div></body></html>`;

    if (fs.existsSync(templatePath)) {
        template = fs.readFileSync(templatePath, 'utf8');
    }

    template = template.replace(/{{CHANNEL_NAME}}/g, channelName)
                       .replace(/{{YEAR}}/g, new Date().getFullYear());

    if (guildIcon) {
        template = template.replace('<!-- SERVER_ICON_CONTENT -->', `<img src="${guildIcon}" class="server-img" alt="Server">`);
    } else {
        template = template.replace('<!-- SERVER_ICON_CONTENT -->', '');
    }

    let messagesHtml = '';
    const sortedMessages = Array.from(messages.values()).sort((a, b) => a.createdTimestamp - b.createdTimestamp);

    for (const msg of sortedMessages) {
        if (!msg.author) continue;

        const avatarUrl = msg.author.displayAvatarURL({ extension: 'png', size: 64 }) || 'https://cdn.discordapp.com/embed/avatars/0.png';
        const date = new Date(msg.createdTimestamp).toLocaleString('ar-EG');
        let content = msg.content ? msg.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>') : '';
        const isBot = msg.author.bot ? '<span class="system-badge">SYSTEM</span>' : '';

        messagesHtml += `
        <div class="message">
            <img src="${avatarUrl}" class="avatar" alt="Avatar">
            <div class="message-content">
                <div class="message-header">
                    <span class="author-name">${msg.author.username}</span>
                    ${isBot}
                    <span class="message-time">${date}</span>
                </div>
        `;

        if (content) {
            messagesHtml += `<div class="text">${content}</div>`;
        }

        if (msg.embeds && msg.embeds.length > 0) {
            for (const embed of msg.embeds) {
                messagesHtml += `<div class="embed">`;
                if (embed.title) {
                    messagesHtml += `<div class="embed-title">${embed.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
                }
                if (embed.description) {
                    const desc = embed.description.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
                    messagesHtml += `<div class="embed-description">${desc}</div>`;
                }
                messagesHtml += `</div>`;
            }
        }

        messagesHtml += `
            </div>
        </div>
        `;
    }

    template = template.replace('<!-- MESSAGES_CONTENT -->', messagesHtml);
    return template;
}

module.exports = { generateTranscriptHTML };
