// // src/App.js

// import React, { useEffect, useState } from "react";
// import { db } from "./firebase";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// function App() {
//   const [clients, setClients] = useState([]);
//   const [clientName, setClientName] = useState("");
//   const [clientKana, setClientKana] = useState("");
//   const [editId, setEditId] = useState(null);
//   const [user, setUser] = useState(null);

//   const auth = getAuth();

//   // ログイン状態を監視？
//   useEffect(() => {
//     onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//   }, []);
//   // 顧客データ取得
//   const fetchClients = async () => {
//     const snapshot = await getDocs(collection(db, "test_client"));
//     const data = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setClients(data);
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!clientName || !clientKana || !user) return;

//     if (editId) {
//       const docRef = doc(db, "test_client", editId);
//       await updateDoc(docRef, {
//         client_name: clientName,
//         client_kana: clientKana,
//       });
//     } else {
//       await addDoc(collection(db, "test_client"), {
//         client_name: clientName,
//         client_kana: clientKana,
//         userId: user.uid,
//       });
//     }

//     setClientName("");
//     setClientKana("");
//     setEditId(null);
//     fetchClients();
//   };

//   const startEdit = (client) => {
//     setClientName(client.client_name);
//     setClientKana(client.client_kana);
//     setEditId(client.id);
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>顧客情報 登録・編集フォーム</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="氏名"
//           value={clientName}
//           onChange={(e) => setClientName(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="カナ"
//           value={clientKana}
//           onChange={(e) => setClientKana(e.target.value)}
//           required
//         />
//         <button type="submit">{editId ? "更新" : "追加"}</button>
//       </form>

//       <h2>顧客一覧</h2>
//       <table border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>カナ</th>
//             <th>氏名</th>
//             <th>操作</th>
//           </tr>
//         </thead>
//         <tbody>
//           {clients.map((client) => (
//             <tr key={client.id}>
//               <td>{client.id}</td>
//               <td>{client.client_kana}</td>
//               <td>{client.client_name}</td>
//               <td>
//                 <button onClick={() => startEdit(client)}>編集</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }



// src/App.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

function App() {
  const [clients, setClients] = useState([]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ログイン状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchClients();
      } else {
        setClients([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // 顧客データ取得
  const fetchClients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "test_client"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(data);
    } catch (err) {
      console.error("Firestoreの取得エラー:", err);
    }
  };

  // ログイン処理
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

  // ログアウト処理
  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    // 未ログイン時はログインフォームを表示
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

  // ログイン済み時は顧客一覧を表示
  return (
    <div style={{ padding: "2rem" }}>
      <h2>顧客一覧</h2>
      <button onClick={handleLogout}>ログアウト</button>
      <table border="1" cellPadding="10" style={{ marginTop: "1rem" }}>
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