import React, { useState, useEffect, useCallback } from 'react';

export default function App() {

  // Product 
  const [product, setProduct] = useState([]);
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantityAvailable, setQuantityAvailable] = useState(0);
  const [search, setSearch] = useState("");
  


  const loadData = async () => {
    var data = await (await fetch("http://localhost:5000/product")).json();
    setProduct(data);
    
  };

  const  addData = async () => {
    await fetch("http://localhost:5000/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product, id, name, cost, price, quantityAvailable }),
    });
    setProduct([]);
    setId(null);
    setName("");
    setCost(0);
    setPrice(0);
    setQuantityAvailable(0);
    setSearch("");
    loadData(); // Refresh the data after adding a new teacher
    };
  

  const loadEdit = async (id)=> {
    setId(id);
    var data = await fetch(`http://localhost:5000/getProduct/${id}`);
    data = await data.json();  
    setName(data[0].name);
    setCost(data[0].cost);
    setPrice(data[0].price);
    setQuantityAvailable(data[0].quantityAvailable);
  }
  
  const deleteData  = async (id) => {
    await fetch(`http://localhost:5000/product/${id}`, {
      method: "DELETE",
    });
    loadData(); // Refresh the data after deleting
  };
  
  const edit = async () => {
    await fetch(`http://localhost:5000/product/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, cost, price, quantityAvailable }),
    });
    setName("");
    setCost(0);
    setPrice(0);
    setQuantityAvailable(0);
    setId(null);
    loadData(); // Refresh the data after editing
  }
  
  const searchKaro = async () => {
    if (search != ''){
    var data = await fetch(`http://localhost:5000/searchProduct/${search}`);
    data = await data.json();
    setProduct(data);
  } else {
    loadData();}
  }
  
  
  useEffect(() => {
    loadData(); // Fetch data when the component mounts
  }, []);
  
    return (
      <div>
      <div>
        <h1>Add Products</h1>
        <br/>
        <input type="text" value={name} onChange={(e)=>{setName(e.target.value)}} placeholder="Name" />
        <br/>
        <input type="number" value={cost} onChange={(e)=>{setCost(e.target.value)}} placeholder="Cost" />
        <br/>
        <input type="number" value={price} onChange={(e)=>{setPrice(e.target.value)}} placeholder="Price" />
        <br/>
        <input type="number" value={quantityAvailable} onChange={(e)=>{setQuantityAvailable(e.target.value)}} placeholder="Quantity Available" />
        <br/>
        <button onClick={addData}>Add Product</button>
        <button style={{display: id ? "block" : "none"}} onClick={edit}>Update</button>
      </div>
      <br/>
      <br/>
  
      
  
      <br/>
      <label>Search:</label>
      <input placeholder="search karo" onChange={(e) => {setSearch(e.target.value)}}/>
      <button onClick={searchKaro}>Search</button>
      <table className="table-auto border border-gray-400 w-full text-left">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Cost</th>
          <th>Price</th>
          <th>Quantity Available</th>
          <th>Edit</th>
          <th>Delete</th>
         
        </tr>
        {product.map((product) => (
        <tr>
          <td>{product.id}</td>
          <td>{product.name}</td>
          <td>{product.cost}</td>
          <td>{product.price}</td>
          <td>{product.quantityavailable}</td>
          <td><button onClick={()=>{loadEdit(product.id)}}>Edit</button></td>
          <td><button onClick={()=>{deleteData(product.id)}}>Delete</button></td>
        </tr>
  
        ))}
      </table>
      <br/><br/>
  

        
    </div>
    );
  }
  