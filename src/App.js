// src/App.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "test_client"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>顧客一覧</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>カナ</th>
            <th>氏名</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.client_kana}</td>
              <td>{client.client_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
