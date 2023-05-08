//import express from "express";

const express = require ("express");
const fs = require("fs")
const path = require("path")

const dirPath = path.join(__dirname,"timestamps");
console.log("dirpath",dirPath)

const app = express()

app.use(express.static("timestamps"))
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("hey there i'm working fine")
})

app.get("/static",(req,res)=>{
    let time = new Date();
    let dateString = time.toUTCString().slice(0, -3);
    let content = `Last updated stamp is ${dateString}`
    res.send(content);

    fs.writeFile(`${dirPath}/date-time.txt`, content, (err)=>{
        if(err){
            console.log(err)
        } else {
            console.log("file created successfully...")
        }
    })
    res.sendFile(path.join(__dirname,"timestamps/date-time.txt"))
})

const data = [
    {
        id: "1",
        numberOfSeats: 100,
        amenities: ["Ac","chairs","chandliers"],
        price: 5000,
        ifBooked: "true",
        customerName: "saraaa",
        date: "05-feb-2022 at 12pm",
        startTime: "11-feb-2020 at 11am",
        endTime: "",
        RoomId: 201,
        RoomName: "Duplex",
    },
    {
        id: "2",
        numberOfSeats: 100,
        amenities: ["Ac","chairs","discolights"],
        price: 5000,
        ifBooked: "false",
        customerName: "saravanan",
        date: "",
        startTime: "",
        RoomId: 202,
        RoomName: "Duplex",
    }
]



// app.post("/createRoom", function (req, res) {
//     let room = {};
//     room.id = uniqid();
//     room.roomNo = roomNo;
//     room.bookings = [];
//     if(req.body.noSeats){room.noSeats = req.body.noSeats} else{res.status(400).json({ output: 'Please specify No of seats for Room'})};
//     if(req.body.amenities){room.amenities = req.body.amenities} else{res.status(400).json({ output: 'Please specify all Amenities for Room in Array format'})};
//     if(req.body.price){room.price = req.body.price} else{res.status(400).json({ output: 'Please specify price per hour for Room'})};
//     rooms.push(room);
//     roomNo++;
//     res.status(200).json({ output: 'Room Created Successfully'}) 
// });

app.get("/hall/details",(req,res)=>{
    if(req.query){
        const{ifBooked} = req.query;
        console.log("ifbooked...")
        console.log("ifbooked..."+ifBooked)
        let filteredHall = data;
        if(ifBooked == "true"){
            filteredHall = filteredHall.filter((halls)=>halls.ifBooked === ifBooked)
        }
        
        res.send(filteredHall)
    }else{
        res.send("dei..."+data)
    }
})




app.get("/getAllBookings", function (req, res) {
    res.json({
       roomname : req.body.RoomName,
       booked_status : req.body.ifBooked,
       customername : req.body.customerName,
       date : req.body.date,
       starttime:req.body.startTime,
       endtime : req.body.endTime
    });
});



app.get("/hall/details/:id",(req,res)=>{
    const{id} = req.params;
    console.log(id)
    const specificHall = data.find(hall => hall.id === id);
    res.send(specificHall)
})


app.post("hall/bookaroom",(req,res)=>{
    const newBook = {
        id : data.length-1,
        customerName : req.body.customerName,
        date : req.body.date,
        startTime : req.body.startTime,
        endTime : req.body.endTime,
    }
    data.push(req.body)
    res.send(data)
})

app.post("/hall/details/",(req,res)=>{
    const newHall = {
        id : data.length-1,
        numberOfSeats : req.body.numberOfSeats,
        amenities : req.body.amenities,
        price : req.body.price,
        RoomId : req.body.RoomId,
        customerName : req.body.customerName,
        date : req.body.date,
        startTime : req.body.startTime,
        endTime : req.body.endTime,
        RoomName : req.body.RoomName,
    }
    console.log(req.body)
    data.push(newHall);
    res.send(data)
})



app.put("/hall/details/:id",(req,res)=>{
    const{id} = req.params;
    const halls = data.find(hall=>hall.id === id);
    console.log(halls)

    if(halls.ifBooked === "true") {
        return res.status(400).send("hey the hall is already booked")
    }
    halls.date = req.body.date;
    halls.startTime = req.body.startTime;
    halls.endTime = req.body.endTime;
    halls.customerName = req.body.customerName;
    halls.ifBooked = "true"
    return res.status(200).send(data)
})

app.listen(9000,()=>console.log(`server started in localhost:9000`))