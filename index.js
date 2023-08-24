import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import _ from "lodash"


const app = express()
const port = 3000
const date = new Date();
const day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
var year = new Date;



mongoose.connect("mongodb+srv://tusharsutharr:nV9kB5KmUnD7oGUe@cluster0.gsrruna.mongodb.net/?retryWrites=true&w=majority")

const itemSchema ={
    text: String
}
const Item = mongoose.model("Item", itemSchema)


const item3 = new Item({
    text: "Welcome to our ToDo List App"
})
const item2 = new Item({
    text: "Hit + Button to add items"
})
const item1 = new Item({
    text: "<== Hit this to remove item"
})
var addlist = [item1,item2,item3];

const listSchema = {
    name: String,
    text: [itemSchema]
}

const List = mongoose.model("List", listSchema)


app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('public'))

app.get('/', async(req, res) => {

      const items = await Item.find()
    if(items.length === 0){  
    Item.insertMany(addlist)
    res.render('index.ejs', ({date: day, list: items, actreplace: "/"}))
    
      }

   else{
    res.render('index.ejs', ({date: day, list: items}))
     }
})

app.post("/", async (req, res)=>{
    const newItem = req.body.List
    if(newItem){
    const item = new Item({
        text: newItem
    }) 
    item.save()
   
    }else{
    const deleteItem = req.body.checkbox
    await Item.findByIdAndRemove(deleteItem)}
    res.redirect("/")
})



app.get("/:post", async(req, res)=>{
const title = _.capitalize(req.params.post);
const items = await List.find({name: title})

if(items[0]){
res.render('index.ejs', ({date: title, list: items[0].text, actreplace: title}));
}

else{
    const list = new List({
        name: title,
        text: addlist
    })
    list.save()
    res.redirect("/"+title)}})
    

app.post("/:post", async (req, res)=>{
    const title = _.capitalize(req.params.post)
    const newItem = req.body.List
    if(newItem){
       const doc = await List.find({name: title})
    
           doc[0].text.push({text: newItem})
      doc[0].save()
   
    }else{

        const deleteItem = req.body.checkbox
        const hello = await List.findOneAndUpdate({name: title}, {$pull:{text:{_id: deleteItem}}})
        
    }
    res.redirect("/"+title)
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))