import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import DashboardPage from './pages/DashboardPage';
import GeneratePage from './pages/GeneratePage';
import EditPage from './pages/EditPage';

function App() {
  const [contents, setContents] = useState([]);

  function addContent(newItem) {
    setContents([newItem, ...contents]);
  }

  // id の1件だけを、changes の内容で書き換える
  function updateContent(id, changes) {
    setContents(contents.map((c) => (c.id === id ? { ...c, ...changes } : c)));
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <h1>AI ショップ管理画面</h1>
      <NavBar />

      <Routes>
        <Route path='/' element={<DashboardPage contents={contents} />} />
        <Route path='/generate' element={<GeneratePage onAdd={addContent} />} />
        <Route path='/edit/:id' element={<EditPage contents={contents} onUpdate={updateContent} />} />
      </Routes>
    </div>
  );
}

export default App;
