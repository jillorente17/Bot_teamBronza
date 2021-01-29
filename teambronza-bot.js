
const TelegramBot = require('node-telegram-bot-api'); //Api del bot
const { on } = require('nodemon');//proceso nodemon
const token = '1497336724:AAEA2iYXPqa_OW5aVJ0nft7Z2kIFzRfh8ts';// token de acceso al bot
const bot = new TelegramBot(token, {polling:true});//consultar los textos y escritos del chat
var pool = require('./config/db_config');//configuración de la base de datos

//revisar los errores del bot
bot.on('polling_error', function(error){
    console.log(error);
});

//Buenos días del bot.
bot.on('text',(msg)=>{
    currentDate = new Date();
    cHour = currentDate.getHours();
    chatId = msg.chat.id;
    member = msg.from.first_name;
    GMessage = ["Buenos días"];
    if(GMessage.includes(msg.text.substring(0,11))){
        if(member.toString() == "Jose" && cHour>6 && cHour<12){
            bot.sendMessage(chatId,`Buenos días, Señor`);
        }
        else if(cHour>6 && cHour<12){
            bot.sendMessage(chatId,`Buenos días ${member}`);
        }
        else if(cHour> 12 && cHour<18){
            bot.sendMessage(chatId, `Buenas tardes, querrás decir`)
        }

    };
})

var dataRegister = {};
function createRegister(chatId,user,action,info){
    id = chatId.toString();
    console.log(action)
    console.log(id)
    console.log(info)
    switch(action){
        case "register":
            dataRegister[id][action] = info;
            break;
        case "name":
            dataRegister[id][action]= info;
            break;
        case "date":
            dataRegister[id][action]=info;
            break;
        case "city":
            dataRegister[id][action]=info;
            break;
        case "summoner":
            dataRegister[id][action]=info;
            break;
    }
    return(dataRegister);
}

      
bot.onText(/^\/opciones/, (msg)=>{
    chatId = msg.chat.id.toString();
    member = msg.from.first_name;
    dataRegister[chatId]={};
    createRegister(chatId,member,`register`,`activated`);
    console.log(dataRegister);
    registerButton(chatId);
    

})

let registerButton = async (chatId)=>{
    optRegister = {
        reply_markup:{
            inline_keyboard:[
                [{text: "Registrar", callback_data:"register"},{text:"Consultar",callback_data:"date"}],
                [{text:"Modificar", callback_data:"city"},{text:"Borrar",callback_data:"lolSum"}]
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
        case "register":
            const nameMsg = `Después del comando *nombre*, escriba su nombre: `
            bot.sendMessage(chatId,nameMsg,{parse_mode: "Markdown"});
            break;
    }
});
bot.on('text', (msg)=>{
    chatId = msg.chat.id;
    if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('nombre')){
    console.log(`Después del on: ${dataRegister[chatId]["register"]}`);

    if(dataRegister[chatId]["register"]==="activated"){


        memberName = msg.text.substring(7, msg.text.length)
        createRegister(chatId,'','name',memberName);
        bot.sendMessage(chatId,`Bien. 
        Ahora, seguido de *fecha* ingresa tu fecha de nacimiento de esta forma: dd-mm-aaaa`, {parse_mode: "Markdown"})
        
        
    }
    }else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('fecha')){

        if(dataRegister[chatId]["register"]=="activated"){
            memberDate = msg.text.substring(5, msg.text.length);
            createRegister(chatId,'','date',memberDate);
            bot.sendMessage(chatId,`Bien.
            Ahora seguido de la palabra *ciudad* ingresa el nombre de la ciudad: `, {parse_mode:"Markdown"});

        }
    }else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('ciudad')){
        
        if(dataRegister[chatId]["register"]=="activated"){
            memberCity = msg.text.substring(7, msg.text.length)
            createRegister(chatId,'date',memberCity);
            bot.sendMessage(chatId,`Bien.
            Seguido de la palabra *invocador* digite el nombre de invocador`,{parse_mode:"Markdown"});
        }
    }else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('invocador')){
        
        if(dataRegister[chatId]["register"]=="activated"){
            memberSummoner = msg.text.substring(10, msg.text.length)
            createRegister(chatId,'','summoner',memberSummoner);
            bot.sendMessage(chatId,`Registro finalizado`);
            dataRegister[chatId]["register"]="deactivated"
        }
    }
})
function insertInventario(chatId){


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
