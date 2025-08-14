import React, { useEffect, useState } from "react";
import "./index.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [quantityavailable, setQuantityavailable] = useState("");
  const [search, setSearch] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState("");

  // ✅ Load all data
  const loadData = async () => {
    try {
      const response = await fetch("https://ekarobarbackend-production.up.railway.app/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("❌ Fetch Error:", err.message);
      setError("Failed to load products");
    }
  };

  // ✅ Show products (table on button click)
  const loadProducts = async () => {
    await loadData();
    setShowTable(true);
  };

  // ✅ Add new product
  const addData = async () => {
    if (!name || !cost || !price || !quantityavailable) {
      setError("All fields are required");
      return;
    }
    if (isNaN(cost) || isNaN(price) || isNaN(quantityavailable)) {
      setError("Cost, Price, and Quantity must be valid numbers");
      return;
    }

    try {
      const response = await fetch("https://ekarobarbackend-production.up.railway.app/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cost, price, quantityavailable }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add product");
      }
      const newProduct = await response.json();
      console.log("✅ Added Product:", newProduct); // Debug log
      alert(`Product added: ${newProduct.name}`);
      clearForm();
      await loadData(); // Reload data to reflect the new product
    } catch (err) {
      console.error("❌ Add Error:", err.message);
      setError(err.message);
    }
  };

  // ✅ Delete product
  const deleteData = async (id) => {
    try {
      const response = await fetch(`https://ekarobarbackend-production.up.railway.app/product/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }
      alert("Product deleted successfully");
      await loadData();
    } catch (err) {
      console.error("❌ Delete Error:", err.message);
      setError(err.message);
    }
  };

  // ✅ Edit / Update product
  const edit = async () => {
    if (!name || !cost || !price || !quantityavailable) {
      setError("All fields are required");
      return;
    }
    if (isNaN(cost) || isNaN(price) || isNaN(quantityavailable)) {
      setError("Cost, Price, and Quantity must be valid numbers");
      return;
    }

    try {
      const response = await fetch(`https://ekarobarbackend-production.up.railway.app/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cost, price, quantityavailable }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }
      alert("Product updated successfully");
      clearForm();
      await loadData();
    } catch (err) {
      console.error("❌ Update Error:", err.message);
      setError(err.message);
    }
  };

  // ✅ Load product data for editing
  const loadEdit = async (id) => {
    try {
      const response = await fetch(`https://ekarobarbackend-production.up.railway.app/getProduct/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch product");
      }
      const data = await response.json();
      setId(data.id);
      setName(data.name);
      setCost(data.cost);
      setPrice(data.price);
      setQuantityavailable(data.quantityavailable);
      setError("");
    } catch (err) {
      console.error("❌ Edit Load Error:", err.message);
      setError(err.message);
    }
  };

  // ✅ Search product
  const searchKaro = async () => {
    try {
      if (search.trim() !== "") {
        const response = await fetch(
          `https://ekarobarbackend-production.up.railway.app/searchProduct/${encodeURIComponent(search.trim())}`
        );
        if (!response.ok) throw new Error("Failed to search products");
        const data = await response.json();
        setProducts(data);
      } else {
        await loadData();
      }
      setShowTable(true); // Ensure table is shown after search
      setSearch(""); // Clear search bar
      setError("");
    } catch (err) {
      console.error("❌ Search Error:", err.message);
      setError(err.message);
    }
  };

  // ✅ Clear form
  const clearForm = () => {
    setId("");
    setName("");
    setCost("");
    setPrice("");
    setQuantityavailable("");
    setError("");
  };

  // ✅ Clear search
  // const clearSearch = () => {
  //   setSearch("");
  //   loadData();
  // };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="app-container">
      <h1 className="text-center text-2xl font-bold mb-6">📦 Product Management</h1>

      {error && <p className="error-message">{error}</p>}

      {/* ✅ Main Form */}
      <div className="form-box">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Cost"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />
        <input
          type="number"
          value={quantityavailable}
          onChange={(e) => setQuantityavailable(e.target.value)}
          placeholder="Quantity Available"
        />

        <div className="flex gap-2 mt-4">
          <button className="bg-indigo-600" onClick={addData}>➕ Add</button>
          {id && (
            <button className="edit-button" onClick={edit}>✏️ Update</button>
          )}
          <button className="clear-button" onClick={clearForm}>🧹 Clear</button>
        </div>
      </div>

      {/* ✅ Search Section */}
      <div className="form-box mt-6">
        <div className="search-section">
          <label>🔍</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Here"
          />
          <button className="search-button" onClick={searchKaro}>Search</button>
        </div>

        <button className="show-products" onClick={loadProducts}>
          Show Products
        </button>
      </div>

      {showTable && (
        <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Cost</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.cost}</td>
                <td>{p.price}</td>
                <td>{p.quantityavailable}</td>
                <td>
                  <button onClick={() => loadEdit(p.id)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => deleteData(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}