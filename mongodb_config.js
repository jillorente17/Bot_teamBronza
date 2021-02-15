var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb+srv://admin:7912312jose@cluster0.2nwfn.mongodb.net/teamBronza_db?retryWrites=true&w=majority",{useUnifiedTopology: true, useNewUrlParser: true}, function (err,client){

    if(err){
        console.log("ocurrió un error",err)


    }else{
    var db = client.db("teamBronza_db");
    module.exports.insertData = function(date,name,city,summoner){
           if(err){
               console.log(`Error en mongo db: ${err}`)
           }else{
                console.log("connected");
                db.collection("teamBronza").insertOne({
                "Date": date,
                "Name": name,
                "City": city,
                "Summoner": summoner
            })
            console.log(`Datos insertados: ${name},${date},${city},${summoner}`);
        }
        }
    
        
    
    
    module.exports.findAll = function (){
        let results="";
            p = db.collection('teamBronza').find({},function(err,result){
                console.log(result)
            });

        };

    }
    });
    





