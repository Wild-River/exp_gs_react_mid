import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STATUS_OPTION } from '../util/status';
import { tagSplit } from '../util/tags';

function EditPage({ contents, onUpdate }) {
  const { id } = useParams(); // URL の :id（文字列）
  const navigate = useNavigate(); // ページ移動の道具

  // URLのidは文字列。item.idは数値なので Number() でそろえて探す
  const item = contents.find((c) => c.id === Number(id));

  // 入力用の state（見つかった値を初期値に。無ければ空）
  const [body, setBody] = useState(item ? item.body : '');
  const [status, setStatus] = useState(item ? item.status : STATUS_OPTION[0]);
  const [tagInput, setTagInput] = useState(item ? item.tags?.join(',') : '');

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
    const tags = tagSplit(tagInput);
    onUpdate(item.id, { body, status, tags }); // App にお願いして更新
    navigate('/'); // 保存したら一覧へ
  }

  return (
    <div>
      <div>
        <div style={{ marginBlock: 10, fontSize: 16.2, color: '#1e293b' }}>商品名</div>
        <div style={{ marginBottom: 16 }}>{item.name}</div>
      </div>

      <label htmlFor='body'>
        本文
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} style={{ width: '100%', display: 'block', marginBlock: 12 }} id='body' />
      </label>

      <label htmlFor='status'>
        ステータス
        <select value={status} onChange={(e) => setStatus(e.target.value)} id='status' style={{ marginLeft: 16 }}>
          {STATUS_OPTION.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor='tag'>
        タグ
        <input type='text' id='tag' value={tagInput} onChange={(e) => setTagInput(e.target.value)} style={{ marginLeft: 16 }} />
      </label>

      <div style={{ marginTop: 46 }}>
        <button onClick={handleSave}>保存する</button>
        <button onClick={() => navigate('/')} style={{ marginLeft: 8 }}>
          キャンセル
        </button>
      </div>
    </div>
  );
}

export default EditPage;
