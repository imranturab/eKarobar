import React, { useState, useEffect, useCallback } from 'react';

export default function App() {
  // Product state
  const [products, setProducts] = useState([]);
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/product');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addData = async () => {
    try {
      await fetch('http://localhost:5000/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          cost: parseFloat(cost),
          price: parseFloat(price),
          quantityAvailable: parseInt(quantityAvailable),
        }),
      });
      setName('');
      setCost('');
      setPrice('');
      setQuantityAvailable('');
      setSearch('');
      await loadData(); // Refresh the data after adding
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const loadEdit = async (id) => {
    setId(id);
    try {
      const response = await fetch(`http://localhost:5000/getProduct/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setName(data[0].name);
      setCost(data[0].cost.toString());
      setPrice(data[0].price.toString());
      setQuantityAvailable(data[0].quantityAvailable.toString());
    } catch (err) {
      setError('Failed to load product for editing');
    }
  };

  const deleteData = async (id) => {
    try {
      await fetch(`http://localhost:5000/product/${id}`, {
        method: 'DELETE',
      });
      await loadData(); // Refresh the data after deleting
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const edit = async () => {
    try {
      await fetch(`http://localhost:5000/product/${id}`, {
        method: 'PUT', // Changed to PUT for updating
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          cost: parseFloat(cost),
          price: parseFloat(price),
          quantityAvailable: parseInt(quantityAvailable),
        }),
      });
      setName('');
      setCost('');
      setPrice('');
      setQuantityAvailable('');
      setId(null);
      await loadData(); // Refresh the data after editing
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const searchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      if (search) {
        const response = await fetch(`http://localhost:5000/searchProduct/${search}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setProducts(data);
      } else {
        await loadData();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(); // Fetch data when the component mounts
  }, [loadData]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Products</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 w-full"
        />
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Cost"
          className="border p-2 w-full"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="border p-2 w-full"
        />
        <input
          type="number"
          value={quantityAvailable}
          onChange={(e) => setQuantityAvailable(e.target.value)}
          placeholder="Quantity Available"
          className="border p-2 w-full"
        />
        <div className="space-x-2">
          <button
            onClick={addData}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Add Product
          </button>
          <button
            onClick={edit}
            style={{ display: id ? 'inline-block' : 'none' }}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Update
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="mr-2">Search:</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="border p-2 mr-2"
        />
        <button
          onClick={searchProducts}
          className="bg-gray-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto border border-gray-400 w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Cost</th>
              <th className="p-2">Price</th>
              <th className="p-2">Quantity Available</th>
              <th className="p-2">Edit</th>
              <th className="p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-2">{product.id}</td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.cost}</td>
                <td className="p-2">{product.price}</td>
                <td className="p-2">{product.quantityAvailable}</td>
                <td className="p-2">
                  <button
                    onClick={() => loadEdit(product.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    disabled={loading}
                  >
                    Edit
                  </button>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => deleteData(product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}