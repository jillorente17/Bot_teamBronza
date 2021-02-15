const token = '1497336724:AAHbidNd_h4IFe7jFQAws1xasIao6bTFSgU';// token de acceso al bot

const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(token, { polling: true});
const User = require('./model/user.model')



const database = require('./app')
const emoji = require('node-emoji').emoji;
//const userController = require('./controller/userController');

//revisar los errores del bot
bot.on('polling_error', (error)=>{
    console.log("error", error.stack);
});

//Buenos días del bot.

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
bot.onText(/^\/cerrar/, (msg)=>{
    bot.getUpdates(options).close();
})
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
    }
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
}
//Callbacks de los botones
bot.on("callback_query", function onCallbackQuery(data){
    action = data.data;
    member = data.from.first_name;
    chatId = data.message.chat.id;
    msgId = data.message.message_id;


    console.log(msgId)
    switch(action){
        case "register":
            const nameMsg = `Después del comando *nombre*, escriba su nombre: `
            createRegister(chatId,member,`register`,`activated`);
            bot.sendMessage(chatId,nameMsg,{parse_mode: "Markdown"});
            
            break;
        case "yesContinue":
            const yesContinueMsg = `Opcion en desarrollo`
            bot.sendMessage(chatId,yesContinueMsg,{parse_mode:"Markdown"});
            registerButton(chatId);
            break;
        case "notContinue":
            insertInventario(chatId,member);
            break;
        case "consult":
            consultButtons(chatId,member);
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
        bot.sendMessage(chatId,`Escriba *mes* más el mes de la persona a buscar`,{parse_mode:"Markdown"});
            break;
        case "allMembers":
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
    

    currentDate = new Date();
    cHour = currentDate.getHours();

    GMessage = ["Buenos días"];
    checkMsg(chatId,member,msg.text);
    
    
    if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('mauro') && member=="Gisell"|| 
       msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('mario') && member=="Gisell"){
            bot.sendMessage(chatId,"Jose dice: Duren");
            bot.sendMessage(chatId,`${emoji.thumbsup}`);
        }
    else if(GMessage.includes(msg.text.substring(0,11))){
        if(member.toString() == "Jose" && cHour>6 && cHour<12){
            bot.sendMessage(chatId,`Buenos días, Señor`);
        }
        else if(cHour>6 && cHour<12){
            bot.sendMessage(chatId,`Buenos días ${member}`);
        } 
        else if(cHour> 12 && cHour<18){
            bot.sendMessage(chatId, `Buenas tardes, querrás decir`)
        }
    }
else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('test')){
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
            bot.sendMessage(chatId,`Bien. 
    Ahora, seguido de *fecha* ingresa tu fecha de nacimiento de esta forma: aaaa-mm-dd` , {parse_mode: "Markdown"});
            }
            
        }
    else if(dataRegister[member]["consult"]=="activated"){

            let name =  msg.text.substring(7, msg.text.length);
            findName(chatId,name);

    }
}
    else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('fecha')){

        if(dataRegister[member]["register"] ==="activated"){
            memberDate = msg.text.substring(5, msg.text.length);
            if(memberDate == ""){
                bot.sendMessage(chatId,`No has asignado una fecha válida`)
            }
            createRegister(chatId,member,'date',memberDate);
            bot.sendMessage(chatId,`Bien.\nAhora seguido de la palabra *ciudad* ingresa el nombre de la ciudad: `, {parse_mode:"Markdown"});

        }
    }
    else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('mes')){

            console.log(`aquí`);
            if(dataRegister[member]["consult"]==="activated"){
             dateMonth = msg.text.substring(3,msg.text.length);
             findBirthday(chatId,dateMonth);

            }
        }
    else if(msg.text.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('ciudad')){
        
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
function findBirthday(chatId,date){
    let tempDate= date;
    if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('ene')){
        date = 'jan'
    }else if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('feb')){
        date = 'feb'
    }else if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('mar')){
        date = 'mar'
    }else if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('abr')){
        date = 'apr'
    }else if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('may')){
        date = 'may'
    }else if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('jun')){
        date = 'jun'
    }else if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('jul')){
        date = 'jul'
    }else if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('ago')){
        date = 'aug'
    }else if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('sep')){
        date = 'sep'
    }else if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('oct')){
        date = 'oct'
    }else if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('nov')){
        date = 'nov'
    }else if(date.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes('dic')){
        date = 'dec'
    }
    let memberName=[];
    let findBirthday =`SELECT date_birth,name from db_b.registro`;
    pool.pool.query(findBirthday, (error,data) => {
        if(error){
            console.log("Error con el pool de insertInventario: ",error);
			throw error; 
        } else {
            for(i=0;i<data.length;i++){
                dates = data[i]["date_birth"].toString();
                tempMonth = dates.substring(3,7).toLowerCase().replace(' ','');
                if(tempMonth === date){
                    memberName.push(data[i]["name"]);
                }
                
            }
            if(memberName.length==0){
                bot.sendMessage(chatId,`No hay nadie que cumpla en este mes ${emoji.fearful}`)
            }else{
            bot.sendMessage(chatId,`Los miembros que cumplen en el mes de ${tempDate}, son: ${memberName.toString().replace(/,/g,'\n')}`);
            }
        }
    });
}
function findName(chatId,name1){

    console.log(name1)
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


function insertInventario(chatId, user){

    const user1 = new User.User()

    user1.date = dataRegister[user]["date"];
    user1.name = dataRegister[user]["name"];
    user1.city = dataRegister[user]["city"];
    user1.summoner = dataRegister[user]["summoner"];

    user1.save((err, result) =>{
        if(err) return err;
        bot.sendMessage(chatId,`Se ha registrado correctamente: \n *Datos: ${user1.name}\n${user1.city}\n${user1.date}\n${user1.summoner}*`,{parse_mode:"Markdown"});
        return result;
    })
  
};

function birthdayConsultation(chatId,month){
    let member 
    let birthdayConsultation = `SELECT date_birth,name FROM db_b.registro`
    pool.pool.query(birthdayConsultation, (error,data) => {
        if (error){
            console.log("Error con el pool de insertInventario: ",error);
			throw error; 
        } else {
            for(i=0;i<data.length;i++){
                cDateAn = data[i]["date_birth"];
                member = data[i]["name"];
                monthBD = cDateAn.toString().substring(4,7);
                dayBD = cDateAn.toString().substring(8,10);
                if(month==1){
                    month = "Jan"
                }else if(month==2){
                    month = "Feb"
                }else if(month==3){
                    month = "Mar"
                }else if(month==4){
                    month = "Apr"
                }else if(month==5){
                    month = "May"
                }else if(month==6){
                    month = "Jun"
                }else if(month==7){
                    month = "Jul"
                }else if(month==8){
                    month = "Aug"
                }else if(month==9){
                    month = "Sep"
                }else if(month==10){
                    month = "Oct"
                }else if(month==11){
                    month = "Nov"
                }else if(month==12){
                    month = "Dec"
                }
                if(month == monthBD){
                    bot.sendMessage(chatId,`Chicos, recuerden que este mes cumple ${member}, el día ${dayBD} de ${month}`);
                }
            }
            
        }
    });
};