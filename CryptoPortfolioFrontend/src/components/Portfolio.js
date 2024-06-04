import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Portfolio = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [data, setData] = useState([]);
  const [cryptoName, setCryptoName] = useState("");
  const [amount, setAmount] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
  const scope = "openid profile email read:current_user";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${audience}`,
          scope: `${scope}`,
        },
      });
      const response = await fetch(`${apiBaseUrl}/api/portfolio`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: `${audience}`,
        scope: `${scope}`,
      },
    });
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${apiBaseUrl}/api/portfolio/${editingId}`
      : `${apiBaseUrl}/api/portfolio`;
    const body = JSON.stringify({
      cryptoName,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice),
      userId: user.sub,
    });

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (response.ok) {
        fetchData();
        setCryptoName("");
        setAmount("");
        setPurchasePrice("");
        setEditingId(null);
      } else {
        console.error("Failed to submit data:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
  };

  const handleEdit = (item) => {
    setCryptoName(item.cryptoName);
    setAmount(item.amount);
    setPurchasePrice(item.purchasePrice);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: `${audience}`,
        scope: `${scope}`,
      },
    });
    try {
      const response = await fetch(`${apiBaseUrl}/api/portfolio/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchData();
      } else {
        console.error("Failed to delete item:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <div>
      <h1>Portfolio</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Crypto Name:</label>
          <input
            type="text"
            value={cryptoName}
            onChange={(e) => setCryptoName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Purchase Price:</label>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">{editingId ? "Update" : "Add"} Item</button>
      </form>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.cryptoName} - {item.amount} - ${item.purchasePrice}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Portfolio;
