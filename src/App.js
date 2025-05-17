// src/App.js
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import MainPage from "./MainPage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<MainPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// src/App.js
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db, auth } from "./firebase";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Paper,
  Typography
} from '@mui/material';

function App() {
// function MainPage() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [clientName, setClientName] = useState("");
  const [clientKana, setClientKana] = useState("");
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchClients();
      } else {
        setClients([]);
        setFilteredClients([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchClients = async () => {
    try {
      const snapshot = await getDocs(collection(db, "test_client"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(data);
      setFilteredClients(data);
    } catch (err) {
      console.error("Firestoreの取得エラー:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientKana || !user) return;

    try {
      if (editId) {
        const docRef = doc(db, "test_client", editId);
        await updateDoc(docRef, {
          client_name: clientName,
          client_kana: clientKana,
        });
      } else {
        await addDoc(collection(db, "test_client"), {
          client_name: clientName,
          client_kana: clientKana,
          // userId: user.uid,
        });
      }
      setClientName("");
      setClientKana("");
      setEditId(null);
      fetchClients();
    } catch (err) {
      console.error("追加・更新エラー:", err);
    }
  };

  const startEdit = (client) => {
    setClientName(client.client_name);
    setClientKana(client.client_kana);
    // setEditId(client.id);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("ログインに失敗しました。メールアドレス・パスワードを確認してください。");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    if (!keyword) {
      setFilteredClients(clients);
    } else {
      const lower = keyword.toLowerCase();
      const filtered = clients.filter((client) =>
        client.client_name.toLowerCase().includes(lower)
      );
      setFilteredClients(filtered);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>ログインしてください</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit">ログイン</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (

    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h5">顧客情報 登録・編集フォーム</Typography>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <TextField
            label="氏名"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
          <TextField
            label="カナ"
            value={clientKana}
            onChange={(e) => setClientKana(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            {editId ? "更新" : "追加"}
          </Button>
        </form>
      </Paper>

      <Paper elevation={3} style={{ padding: "2rem", marginTop: "2rem" }}>
        <Typography variant="h5">顧客一覧</Typography>
        <TextField
          fullWidth
          label="氏名で検索"
          value={searchKeyword}
          onChange={handleSearch}
          style={{ margin: "1rem 0" }}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>カナ</TableCell>
              <TableCell>氏名</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id}</TableCell>
                <TableCell>{client.client_kana}</TableCell>
                <TableCell>{client.client_name}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => startEdit(client)}>編集</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      {/* ログアウトボタン */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          className="btn"
          onClick={handleLogout}
          type="submit"
          variant="contained"
          color="primary"
          style={{ padding: "1rem", marginTop: "2rem" }}
        >
          ログアウト
        </Button>
      </div>

    </Container>

  );
}

export default App;
// export default MainPage;

    // <div style={{ padding: "2rem" }}>

    //   <h2 style={{ margin: 0 }}>顧客情報 登録・編集フォーム</h2>

    //   <form onSubmit={handleSubmit}>

    //     {/* 氏名テキスト */}
    //     <input
    //       type="text"
    //       placeholder="氏名"
    //       value={clientName}
    //       onChange={(e) => setClientName(e.target.value)}
    //       required
    //       style={{ marginRight: "4px" }}
    //     />

    //     {/* カナテキスト */}
    //     <input
    //       type="text"
    //       placeholder="カナ"
    //       value={clientKana}
    //       onChange={(e) => setClientKana(e.target.value)}
    //       required
    //       style={{ marginRight: "4px" }}
    //     />

    //     <button type="submit">{editId ? "更新" : "追加"}</button>

    //   </form>

    //   <h2 style={{ margin: 0, marginTop: "16px" }}>顧客一覧</h2>

    //   {/* 検索テキスト */}
    //   <input
    //     type="text"
    //     placeholder="氏名で検索"
    //     value={searchKeyword}
    //     onChange={handleSearch}
    //     style={{ marginBottom: "1rem", display: "block" }}
    //   />

    //   {/* 顧客リスト */}
    //   <table border="1" cellPadding="10" style={{ margin: 0, marginTop: "32px" }}>
    //     <thead>
    //       <tr>
    //         {/* <th>ID</th> */}
    //         <th>カナ</th>
    //         <th>氏名</th>
    //         <th>操作</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {filteredClients.map((client) => (
    //         <tr key={client.id}>
    //           {/* <td>{client.id}</td> */}
    //           <td>{client.client_kana}</td>
    //           <td>{client.client_name}</td>
    //           <td>
    //             <button onClick={() => startEdit(client)}>編集</button>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
