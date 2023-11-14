import express from "express";
import ProductManager from "../controllers/productManager.js";

const productRouter = express.Router();

const managerProd = new ProductManager("./src/database/products.json")

productRouter.get("/", async (req, res) => {
        const { limit } = req.query

    try{
        const products = await managerProd.getProducts();
        if(limit) return res.status(200).json({message: "Limit OK", products: products.slice(0, limit)})
        return res.status(200).json({ message: "Ok", products })
    }catch(error){
        return res.status(400).json({ message: error.message })
    }
})

productRouter.get("/:pid", async(req,res) =>{
    const { pid } = req.params;

    try{
        const product = await managerProd.getProductById(Number(pid));
        return res.status(200).json({ message: "Product found", product })
    }catch(error){
        return res.status(404).json({ message: error.message })
    }
})

productRouter.post("/", async(req, res) =>{

    try{

        const data = req.body;
        const product = await managerProd.addProduct(data)
        const products = await managerProd.getProducts()

        socketServer.emit("newProduct", products)
        
        res.json(product.res)
        res.send(await managerProd.addProduct(data))

        //return res.status(200).json({ message: "New product added", newProduct})
        
    } catch(error){
        return res.status(400)//.json({ message: error.message })
    }
})

productRouter.put("/:pid", async(req, res) =>{

    try{
        let update = req.body;
        res.send(await managerProd.updateProduct(update))
        return res.status(200).json({ message: "Product updated", update})

    } catch(error){
        return res.status(400).json({ message: error.message })
    }
})

productRouter.delete("/:pid", async(req,res) =>{
    const { pid } = req.params;

    try{
        const product = await managerProd.deleteProduct(Number(pid))
        return res.status(200).json({ message: "Product deleted", product })
    } catch(error){
        return res.status(500).json({ message: error.message })
    }
})

export default productRouter;