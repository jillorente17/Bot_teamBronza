
const TelegramBot = require('node-telegram-bot-api');
const { on } = require('nodemon');
const token = '1497336724:AAEA2iYXPqa_OW5aVJ0nft7Z2kIFzRfh8ts';
const bot = new TelegramBot(token, {polling:true});
var pool = require('./config/db_config');

bot.on('polling_error', function(error){
    console.log(error);
});

//Buenos días del bot
bot.on('text',(msg)=>{
    currentDate = new Date();
    cHour = currentDate.getHours();
    chatId = msg.chat.id;
    member = msg.from.first_name;
    GMMessage = ["Buenos días"];
    if(GMMessage.includes(msg.text)){
        if(member == "Jose"){}
        if(cHour == 8){
            bot.sendMessage(chatId,`Buenos días ${member}`);
        }};
})

var dataRegister = {};
function createRegister(chatId,action,info){
    switch(action){
        case "registrar":
            dataRegister[chatId][action] = info;
            break;
    }
}
bot.onText(/^\/registrar/, (msg)=>{
    chatId = msg.chat.id;
    member = msg.from.first_name;
registerButton(chatId);

})

let registerButton = async (chatId)=>{
    optRegister = {
        reply_markup:{
            inline_keyboard:[
                [{text: "Nombre", callback_data:"name"},{text:"Fecha Nacimiento",callback_data:"date"}],
                [{text:"Ciudad", callback_data:"city"},{text:"Nombre invocador",callback_data:"lolSum"}]
            ],
                resize_keyboard:true,
                one_time_keyboard:true,
                remove_replykeyboard:true
            
        }
    }
    bot.sendMessage(chatId,`Seleccione alguna de las opciones a continuación`,optRegister)
}

bot.on("callback_query", function onCallbackQuery(data){
    action = data.data;
    chatId = data.message.chat.id;
    switch(action){
        case "name":
            const nameMsg = `Después del comando */nombre*, escriba su nombre: `
            bot.sendMessage(chatId,nameMsg,{parse_mode: "Markdown"});
            break;
    }
});
bot.on('text',(msg)=>{
    chatId = msg.chat.id;
    commandTable = ["/registrar"];
    helpCommand = ["hola"];
    
    if(commandTable.includes(msg.text.toLocaleLowerCase())){
        
    }else if (helpCommand.includes(msg.text.toLocaleLowerCase())){
        bot.sendMessage(chatId,`Hola`);
    }
    else if (msg.text.substring(0,1).includes("/")){
        bot.sendMessage(chatId,`No disponible, sapo hpta`);
    }
})
function insertInventario(chatId){

    var id = chatId.toString();
    var numero = reg[id]["Numero"]; 
    var consecutivo = reg[id]["Consecutivo"]; 
    var direccion_puno = reg[id]["via"] + ' ' + reg[id]["Direccion"].split(' ')[1];
    var direccion_pdos = reg[id]["Direccion"].split(' ')[2] + ' ' + reg[id]["Direccion"].split(' ')[3] + ' ' + reg[id]["Direccion"].split(' ')[4];
    var lat = reg[id]["Ubicacion"]["Latitud"]; 
    var lon = reg[id]["Ubicacion"]["Longitud"]; 
    var or = '-1';
    var id_ubicacion = '';
    var activo = '1'; 
    var fila = '';
    var fechalimite = ''; 
    var direccion_consultada = '';
    var direccion_encontrada = reg[id]["Direccion"];
    var id_cruce = reg[id]["idCruce"]
    
    var insertInventarioQuery = `INSERT INTO inventario VALUES (uuid(), '${numero}', '${consecutivo}', '${direccion_puno}', '${direccion_pdos}', '${lat}', '${lon}', '${or}', '${id_ubicacion}', NOW(), NOW(), '${activo}', '${fila}', '${fechalimite}', '${direccion_consultada}', '${direccion_encontrada}', '${id_cruce}')`;
   
    pool.pool.query(insertInventarioQuery, (error,datos) => {
        if (error){
            console.log("Error con el pool de insertInventario: ",error)
			throw error; 
        } else {
            console.log("Actividad insertInventario registrada éxitosamente.")
        }
    });
};
