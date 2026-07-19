import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditPage({ contents, onUpdate }) {
  const { id } = useParams(); // URL の :id（文字列）
  const navigate = useNavigate(); // ページ移動の道具

  // URLのidは文字列。item.idは数値なので Number() でそろえて探す
  const item = contents.find((c) => c.id === Number(id));

  // 入力用の state（見つかった値を初期値に。無ければ空）
  const [body, setBody] = useState(item ? item.body : '');
  const [status, setStatus] = useState(item ? item.status : '下書き');

  // 該当データが無いとき（直接URLを開いた等）
  if (!item) {
    return (
      <div>
        <p>データが見つかりませんでした。</p>
        <button onClick={() => navigate('/')}>ダッシュボードへ戻る</button>
      </div>
    );
  }

  function handleSave() {
    onUpdate(item.id, { body: body, status: status }); // App にお願いして更新
    navigate('/'); // 保存したら一覧へ
  }

  return (
    <div>
      <h2>コンテンツを編集</h2>
      <p style={{ color: '#6b7280' }}>商品名: {item.name}</p>

      <label>本文</label>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} style={{ width: '100%', display: 'block', marginBottom: 12 }} />

      <label>ステータス</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value='下書き'>下書き</option>
        <option value='完成'>完成</option>
        <option value='公開'>公開</option>
      </select>

      <div style={{ marginTop: 16 }}>
        <button onClick={handleSave}>保存する</button>
        <button onClick={() => navigate('/')} style={{ marginLeft: 8 }}>
          キャンセル
        </button>
      </div>
    </div>
  );
}

export default EditPage;
