import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import DashboardPage from './pages/DashboardPage';
import GeneratePage from './pages/GeneratePage';
import EditPage from './pages/EditPage';

function App() {
  const [contents, setContents] = useState(() => {
    const saved = localStorage.getItem('contents');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('contents', JSON.stringify(contents));
  }, [contents]);

  function addContent(newItem) {
    setContents([newItem, ...contents]);
  }

  function updateContent(id, changes) {
    setContents(contents.map((c) => (c.id === id ? { ...c, ...changes } : c)));
  }

  function deleteContent(id) {
    setContents(contents.filter((c) => c.id !== id));
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <h1>AI ショップ管理画面</h1>
      <NavBar />

      <Routes>
        <Route path='/' element={<DashboardPage contents={contents} onDelete={deleteContent} />} />
        <Route path='/generate' element={<GeneratePage onAdd={addContent} />} />
        <Route path='/edit/:id' element={<EditPage contents={contents} onUpdate={updateContent} />} />
      </Routes>
    </div>
  );
}

export default App;
