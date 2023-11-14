import express from "express";
import { Server } from "socket.io";

import viewsRouter from "./routes/views.routes.js";
import cartRouter from "./routes/carts.routes.js";
import productRouter from "./routes/products.routes.js";
import ProductManager from "./controllers/productManager.js";

import { engine } from "express-handlebars";
import * as path from "path";
import __dirname from "./utils.js";

const managerProd = new ProductManager("./src/database/products.json")

// --------- SERVER

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(8080, () => { console.log("Server in port 8080")})

const socketServer = new Server(httpServer)

// ------- ROUTER

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter)

// ------- STATIC

app.use("/", express.static(__dirname + "/public"))

// -------- HANDLEBARS

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

// ------ WEBSOCKETS

socketServer.on('connection', socket => {
    console.log("Nuevo Cliente conectado")
    
    socket.on("newProduct", data =>{
        console.log(data)
        socketServer.emit("emitProds", data)
    })
})




