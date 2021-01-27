
const TelegramBot = require('node-telegram-bot-api');
const token = '1497336724:AAEA2iYXPqa_OW5aVJ0nft7Z2kIFzRfh8ts';
const bot = new TelegramBot(token, {polling:true});

bot.on('polling_error', function(error){
    console.log(error);
});

bot.onText(/^\/registrar/, (msg)=>{
    chatId = msg.chat.id;
    member = msg.from.first_name;
    let regisMsg = `Hola ${member}`
registerButton(chatId);

})

let registerButton = async (chatId)=>{
    optRegister = {
        reply_markup:{
            inline_keyboard:[
                [{text: "Nombre", callback_data:'boton'},{text:"Fecha Nacimiento",callback_data:"asda"}],
                [{text:"Ciudad", callback_data:"city"},{text:"Nombre invocador",callback_data:"lolSum"}]
            ],
                resize_keyboard:true,
                one_time_keyboard:true,
                remove_replykeyboard:true
            
        }
    }
    bot.sendMessage(chatId,`Estos es lo que sea`,optRegister)
}

bot.onText(/^\/borratodo/, (msg) => {
    var chatId = msg.chat.id;
    var messageId = msg.message_id;
    var replyMessage = msg.reply_to_message.message_id;
    
    if (msg.reply_to_message == undefined){
        return;
    }
    
    bot.deleteMessage(chatId, messageId);
    bot.deleteMessage(chatId, replyMessage);
});
bot.onText(/^\/getLocation/, (msg) => {
    const opts = {
      reply_markup: JSON.stringify({
        keyboard: [
          [{text: 'Location', request_location: true}],
          [{text: 'Contact', request_contact: true}],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }),
    };
    bot.sendMessage(msg.chat.id, 'Contact and Location request', opts);
  });
  
  // Obtenemos la ubicación que nos manda un usuario
  bot.on('location', (msg) => {
    console.log(msg.location.latitude);
    console.log(msg.location.longitude);
  });
  
  // Obtenemos la información de contacto que nos manda un usuario
  bot.on('contact', (msg) => {
      console.log("Nombre: " + msg.contact.first_name + "\nUserID:"  +  msg.contact.user_id + "\nNúmero Telf: " + msg.contact.phone_number);
  });
  bot.on(/^\/encuesta/, (msg)=>{
      
  })
  bot.onText(/^\/ping/, function(msg){
    var chatId = msg.chat.id;
    var tipoChat = msg.chat.type;
    
    // if (tipoChat == 'private'){
    //     bot.sendMessage(chatId, "Pong!")
    // } 
    
    // else if (tipoChat == 'supergroup') {
    //     bot.sendMessage(chatId, "Este comando solo funciona en privado")
    // }
    bot.sendMessage(chatId,"pong")
});
bot.on('message', function(msg){
    
    var chatId = msg.chat.id;
    var chatitle = msg.chat.title;
    
    if (msg.new_chat_members != undefined){
    
        var nameNewMember = msg.new_chat_member.first_name;
    
        bot.sendMessage(chatId, "Hola " + nameNewMember + ", bienvenido al grupo " + chatitle);
    }
    else if (msg.left_chat_member != undefined){
    
        var nameLeftMember = msg.left_chat_member.first_name;
        
        bot.sendMessage(chatId, nameLeftMember + " abandonó el grupo")
    }
});
bot.onText(/^\/mute (.+)/, function(msg, match){
    var chatId = msg.chat.id;
    var fromId = msg.from.id;
    var replyId = msg.reply_to_message.from.id;
    var replyName = msg.reply_to_message.from.first_name;
    var fromName = msg.from.first_name;
    
    // Recogerá en el comando el tiempo de baneo
    var tiempo = match[1];
    
    // Nos permitirá manejar el tiempo
    var ms = require('ms')
    
    // Se encargará de manejar los privilegios que el usuario tendrá restringidos.
    const perms = {};
    perms.can_send_message = false;
    perms.can_send_media_messages = false;
    perms.can_send_other_messages = false;
    perms.can_can_add_web_page_previews = false;
    
    if (msg.reply_to_message == undefined){
        return;
    }
    
    bot.getChatMember(chatId, fromId).then(function(data){
        if ((data.status == 'creator') || (data.status == 'administrator')){
            bot.restrictChatMember(chatId, replyId, {until_date: Math.round((Date.now() + ms(tiempo + "days")/1000))}, perms).then(function(result){
            bot.sendMessage(chatId, "El usuario " + replyName + " ha sido muteado durante " + tiempo + " días");
            }) // restrictChatMember
        } else {
            bot.sendMessage(chatId, "Lo siento " + fromName + " no eres administrador");
        }
    }) // getChatMember
}) // Comando
bot.onText(/^\/unmute/, function(msg){
    var chatId = msg.chat.id;
    var fromId = msg.from.id;
    var fromName = msg.from.first_name;
    var replyName = msg.reply_to_message.from.first_name;
    var replyId = msg.reply_to_message.from.id;
    const perms = {};
    
    perms.can_send_message = true;
    perms.can_send_media_messages = true;
    perms.can_send_other_messages = true;
    perms.can_can_add_web_page_previews = true;
    
    if (msg.reply_to_message == undefined){
        return;
    }
    
    bot.getChatMember(chatId, fromId).then(function(data){
        if ((data.status == 'creator') || (data.status == 'administrator')){
            bot.restrictChatMember(chatId, replyId, perms).then(function(result){
                bot.sendMessage(chatId, "El usuario " + replyName + " ha sido desmuteado");
            }) // restrictChatMember
        }
        else {
        bot.sendMessage(chatId, "Lo siento " + fromName + " no eres administrador");
        }
    }) // getChatMember
}) // Comando