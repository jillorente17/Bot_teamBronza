
const token = '1497336724:AAGU79eMIcvvTUDeH1fSYFiTMxe7EKGofnc';// token de acceso al bot
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(token, { polling: true});

const User = require('./model/user.model');
const database = require('./app');
const emoji = require('node-emoji').emoji;


//revisar los errores del bot
bot.on('polling_error', (error)=>{
    console.log("error", error.stack);
});

// Objecto encargado de recolectar la información de registro.
var dataRegister={};
function createRegister(chatId,user,action,info){
    userId = user.toString();
    switch(action){
        case "chatting":
            dataRegister[userId][action]=info;
            break;
        case "consult":
            dataRegister[userId][action]=info
            break;
        case "register":
            dataRegister[userId][action]=info;
            break;
        case "name":
            dataRegister[userId][action]=info;
            break;
        case "date":
            dataRegister[userId][action]=info;
            break;
        case "city":
            dataRegister[userId][action]=info;
            break;
        case "summoner":
            dataRegister[userId][action]=info;
            break;
    }
    return(dataRegister);
}


//Despligue de funciones de comandos
bot.onText(/^\/opciones/, (msg)=>{
    chatId = msg.chat.id.toString();
    member = msg.from.first_name;
    dataRegister[member]={};
    registerButton(chatId,member);

});

bot.onText(/^\/recordatorio/,(msg)=>{
    chatId = msg.chat.id;
    currentDate = new Date();
    cMonth = currentDate.getMonth();
    cYear = currentDate.getFullYear();
    cDay = currentDate.getDate();
    consultationMonth = `0${cMonth+1}`;
    console.log(`${cYear}-0${cMonth+1}-0${cDay}`);
    birthdayConsultation(chatId,consultationMonth);
});

//Botones del bot
let registerButton = (chatId,member)=>{
    optRegister = {
        reply_markup:{
            inline_keyboard:[
                [{text: "Registrar", callback_data:"register"},{text:"Consultar",callback_data:"consult"}],
                [{text:"Modificar", callback_data:"modify"},{text:"Borrar",callback_data:"delete"}]
            ],  
            one_time_keyboard:true,
            resize_keyboard:true,
            remove_keyboard:true     
        }
    };
    bot.sendMessage(chatId,`Ok ${member}. Seleccione alguna de las opciones a continuación`,optRegister);
    
};

let finishButton = async (chatId,member) =>{
    optFinish = {
        reply_markup:{
            inline_keyboard:[[{text: "Corregir", callback_data:"yesContinue"},{text:"Finalizar",callback_data:"notContinue"}]
        ],
        one_time_keyboard:true,
        resize_keyboard:true,
        remove_keyboard:true
        }
   
    }
    bot.sendMessage(chatId,`¿${member} deseas continuar?`,optFinish);
    
};

let consultButtons = async (chatId,member) =>{
    optConsult = {
        reply_markup: {
            inline_keyboard: [[{text:"Nombre", callback_data:"name"},{text: "Nombre invocador", callback_data:"summoner"}],
        [{text: "Ciudad", callback_data:"city"},{text:"Cumpleaños",callback_data:"birthday"}],
        [{text:"Todos",callback_data:"allMembers"}]
    ],
        one_time_keyboard:true,
        resize_keyboard:true,
        remove_keyboard:true
        }
    }
    bot.sendMessage(chatId,`Ok ${member}. Seleccione el criterio de búsqueda`, optConsult)
};

//Callbacks de los botones
bot.on("callback_query", function onCallbackQuery(data){
    action = data.data;
    member = data.from.first_name;
    chatId = data.message.chat.id;
    msgId = data.message.message_id;

    switch(action){
        case "register":
            const nameMsg = `Después del comando *nombre*, escriba su nombre: `;
            createRegister(chatId,member,`register`,`activated`);
            bot.sendMessage(chatId,nameMsg,{parse_mode: "Markdown"});
            bot.deleteMessage(chatId,msgId);
            break;
        case "yesContinue":
            const yesContinueMsg = `Opcion en desarrollo`;
            bot.sendMessage(chatId,yesContinueMsg,{parse_mode:"Markdown"});
            registerButton(chatId);
            break;
        case "notContinue":
            insertInventario(chatId,member);
            break;
        case "consult":
            consultButtons(chatId,member);
            bot.deleteMessage(chatId,msgId);
            createRegister(chatId,member,`consult`,`activated`);
            break;
        case "name":
            bot.sendMessage(chatId,`Escriba *nombre* más el nombre de la persona a buscar`,{parse_mode:"Markdown"});
            break;
        case "summoner":
            bot.sendMessage(chatId,`Escriba *invocador* más el nombre de invocador de la persona a buscar`,{parse_mode:"Markdown"});
            break;
        case "city":
            bot.sendMessage(chatId,`Escriba *ciudad* más el nombre de la ciudad de la persona a buscar`,{parse_mode:"Markdown"});
            break;
        case "birthday":
            bot.deleteMessage(chatId,msgId);
            bot.sendMessage(chatId,`Escriba *mes* más el mes de la persona a buscar`,{parse_mode:"Markdown"});
            break;
        case "allMembers":
            bot.deleteMessage(chatId,msgId);
            findAll(chatId);
            break;
        case "modify":
            const modifyMsg = `Opción en desarrollo`
            bot.sendMessage(chatId,modifyMsg);
            registerButton(chatId);
            break;
        case "delete":
            const deleteMsg = `Opción en desarrollo`
            bot.sendMessage(chatId,deleteMsg);
            registerButton(chatId);
            break;
    }
});


//Activación de comandos por texto

bot.on('text', (msg)=>{

    chatId = msg.chat.id;
    member = msg.from.first_name;
    msgId = msg.message_id;
    
    var currentDate = new Date();
    var dateNoOffset = currentDate.toISOString()[11]+currentDate.toISOString()[12];
    var cHour = 0;
    if((dateNoOffset)<5){
        dateNoOffset = dateNoOffset - 5;
        console.log(dateNoOffset)
        cHour = parseInt((dateNoOffset),10);
        cHourTemp = cHour+24
        console.log(cHourTemp)
    
    }else{
        cHour = dateNoOffset-5;
    }
    
    //console.log(dateNoOffset)
    GMessage = ["buenos dias"];
    AMessage = ["buenas tardes"];
    EMessage = ["buenas noches"];

    
    checkMsg(chatId,member,msg.text);
 
    if(GMessage.includes(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().substring(0,11))){
        if(member.toString() == "Jose" && cHour>=6 && cHour<12){
            bot.sendMessage(chatId,`Buenos días, Señor`);
        }else if(cHour>6 && cHour<12){
            bot.sendMessage(chatId,`Buenos días ${member}`);
        }
    }else if(AMessage.includes(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().substring(0,11))){
        if(member.toString() == "Jose" && cHour>=12 && cHour<18){
            bot.sendMessage(chatId,`Buenos tardes, Señor`);
        }else if(cHour>12 && cHour<18){
            bot.sendMessage(chatId,`Buenos tardes ${member}`);
        }
    }else if(EMessage.includes(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().substring(0,11))){
        if(member.toString() == "Jose" && cHour>=18 && cHour<23 || cHour>0 && cHour<6){
            bot.sendMessage(chatId,`Buenos noches, Señor`);
        }else if(cHour>18 && cHour<23 || cHour>0 && cHour<6){
            bot.sendMessage(chatId,`Buenos noches ${member}`);
        }
    }else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('test')){
        if(msg.text.substring(5, msg.text.length) == "on"){
            bot.sendMessage(chatId, `Hola, esta opción la usa mi creador para pruebas`);  
        }

//registro de los miembros
    }else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('nombre')){
    
        if(dataRegister[member]["register"] ==="activated"){

            memberName = msg.text.substring(7, msg.text.length);
            if(memberName == ""){
                bot.sendMessage(chatId,`No has asignado un nombre`);
            }else{
            createRegister(chatId,member,'name',memberName);
            bot.deleteMessage(chatId, msgId);
            bot.sendMessage(chatId,`Bien. \n Ahora, seguido de *fecha* ingresa tu fecha de nacimiento de esta forma: aaaa-mm-dd` , {parse_mode: "Markdown"});
            }    
        }else if(dataRegister[member]["consult"]=="activated"){
                bot.deleteMessage(chatId,msgId);
                let name =  msg.text.substring(7, msg.text.length);
                findName(chatId,name);

        }
    }else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('fecha')){

        if(dataRegister[member]["register"] ==="activated"){
            memberDate = msg.text.substring(5, msg.text.length);
            if(memberDate == ""){
                bot.sendMessage(chatId,`No has asignado una fecha válida`)
            }
            createRegister(chatId,member,'date',memberDate);
            bot.sendMessage(chatId,`Bien.\nAhora seguido de la palabra *ciudad* ingresa el nombre de la ciudad: `, {parse_mode:"Markdown"});

        }
    }else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('mes')){


            if(dataRegister[member]["consult"]==="activated"){
             dateMonth = msg.text.substring(3,msg.text.length);
             findBirthday(chatId,dateMonth);
            }
    }else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('ciudad')){
        
        if(dataRegister[member]["register"] ==="activated"){
            memberCity = msg.text.substring(6, msg.text.length)
            createRegister(chatId,member,'city',memberCity);
            bot.sendMessage(chatId,`Bien.\nSeguido de la palabra *invocador* digite el nombre de invocador`,{parse_mode:"Markdown"});
        }
    }else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('invocador')){
        
        if(dataRegister[member]["register"] ==="activated"){

            memberSummoner = msg.text.substring(10, msg.text.length)
            createRegister(chatId,member,'summoner',memberSummoner);
            finishButton(chatId,member);
            dataRegister[member]["register"]="deactivated"

        }
    }

});

function checkMsg(chatId,member,msg){

    if (Object.keys(dataRegister).length == 0){
        dataRegister[member] = {}
    }
    
}

//Funciones de llamados de los CallbackQueries
function insertInventario(chatId, user){

    const user1 = new User.User()

    user1.date = dataRegister[user]["date"];
    user1.name = dataRegister[user]["name"];
    user1.city = dataRegister[user]["city"];
    user1.summoner = dataRegister[user]["summoner"];

    user1.save((err, result) =>{
        if(err) return err;
        bot.sendMessage(chatId,`Se ha registrado correctamente: \n *Datos: \n *Nombre: *${user1.name}\n *Ciudad: *${user1.city}\n *Fecha: *${user1.date.toString().substring(3,16)}\n*Invocador: *${user1.summoner}*`,{parse_mode:"Markdown"});
        return result;
    })
  
};
function findBirthday(chatId,reqDate){
    let tempreqDate= reqDate;
    if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('ene')){
        reqDate = 'jan'
    }else if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('feb')){
        reqDate = 'feb'
    }else if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('mar')){
        reqDate = 'mar'
    }else if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('abr')){
        reqDate = 'apr'
    }else if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('may')){
        reqDate = 'may'
    }else if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('jun')){
        reqDate = 'jun'
    }else if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('jul')){
        reqDate = 'jul'
    }else if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('ago')){
        reqDate = 'aug'
    }else if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('sep')){
        reqDate = 'sep'
    }else if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('oct')){
        reqDate = 'oct'
    }else if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('nov')){
        reqDate = 'nov'
    }else if(reqDate.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('dic')){
        reqDate = 'dec'
    }
    let memberName=[];
    let dayBD = [];
    var outputMsg = ""
    User.User.find({}).then(res =>{
        res.forEach(result=>{
            tempreqDate = result["date"].toString();
            dateSplited = tempreqDate.split(" ");
            month = dateSplited[1];
            day = dateSplited[2];
            if(month.toLowerCase() == reqDate){
                memberName.push(result["name"]);
                dayBD.push(day);
            }
        })

        for(i=0;i<memberName.length;i++){
            outputMsgTemp = `*\n ${memberName[i]}, día ${dayBD[i]}*`
            outputMsg = outputMsg + outputMsgTemp;

        }

        bot.sendMessage(chatId, `En el mes de ${reqDate} cumple(n): ${outputMsg}`, {parse_mode: "Markdown"});
    }).catch(err =>{
        console.log(err)
    });
   
};
function findName(chatId,name1){


    User.User.find({name: name1}).then(res =>{

        if(res.length == 0)bot.sendMessage(chatId,`No encontramos nada sobre esta persona.`);
        res.forEach(result=>{
            bot.sendMessage(chatId,`Esto encontramos de: ${result.name}, que vive en ${result.city} y lo encuentras en lol como: ${result.summoner}`);

        })
    }).catch(err =>{
        console.log(err);
    })
};

function findAll(chatId){

    let names = [];
    let dataParser = "";

    User.User.find({}).then(res=>{
        bot.sendMessage(chatId,`hay ${res.length} miembros registrados`);
        
        res.forEach(datos=>{
            names.push(datos.name);
            dataParser = names.toString();
        })
        bot.sendMessage(chatId,`*Miembros registrados:* \n${dataParser.replace(/,/g,'\n')}`,{parse_mode:"Markdown"});


    })
        .catch(err=>{
        console.log(err);
    });

 
};

function birthdayConsultation(chatId,month){
    
};