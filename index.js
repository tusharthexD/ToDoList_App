import bodyParser from 'body-parser';
import express from 'express';
const app = express()
const port = 3000
const date = new Date();

var year = new Date;

app.use(bodyParser.urlencoded({extended: true}))
var addlist = [];
var worklist = [];

app.use(express.static('public'))
app.get('/', (req, res) => res.render('index.ejs', ({date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }), list: addlist})))

app.post("/", (req, res)=>{
    addlist.push(req.body['List'])
    res.render("index.ejs", ({date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }), list: addlist }))
})

app.get("/work", (req, res)=>{
    res.render("work.ejs", ({list: worklist }))
})

app.post("/work", (req, res)=>{
    worklist.push(req.body['List'])
    res.render("work.ejs", ({list: worklist }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))