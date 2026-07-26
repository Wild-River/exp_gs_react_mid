import { useState } from 'react';
import { Link } from 'react-router-dom';
import ContentCard from '../components/ContentCard';

function DashboardPage({ contents, onDelete }) {
  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState('新しい順');
  const [statusFilter, setStatusFilter] = useState('すべて');

  // 状態ごとの件数（Day2 宿題②「件数表示」の答え）
  const countBy = (s) => contents.filter((c) => c.status === s).length;

  const filteredContents = contents
    .filter((c) => c.name.toLowerCase().includes(keyword.toLowerCase()))
    .filter((c) => statusFilter === 'すべて' || c.status === statusFilter)
    .sort((a, b) => (order === '新しい順' ? b.id - a.id : a.id - b.id));

  return (
    <div>
      <h2>生成したコンテンツ（{contents.length}件）</h2>
      <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 12px' }}>
        公開 {countBy('公開')} / 完成 {countBy('完成')} / 下書き {countBy('下書き')}
      </p>

      <label htmlFor='search' style={{ display: 'block', margin: '12px 0' }}>
        検索：
        <input type='text' id='search' value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder='商品名で絞り込む' style={{ marginLeft: 8 }} />
      </label>

      <label htmlFor='order' style={{ display: 'block', margin: '12px 0' }}>
        並び替え：
        <select id='order' value={order} onChange={(e) => setOrder(e.target.value)} style={{ marginLeft: 8 }}>
          <option value='新しい順'>新しい順</option>
          <option value='古い順'>古い順</option>
        </select>
      </label>

      <label htmlFor='statusFilter' style={{ display: 'block', margin: '12px 0' }}>
        状態で絞る：
        <select id='statusFilter' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ marginLeft: 8 }}>
          <option value='すべて'>すべて</option>
          <option value='下書き'>下書き</option>
          <option value='完成'>完成</option>
          <option value='公開'>公開</option>
        </select>
      </label>

      {contents.length === 0 ? (
        <p>まだありません。「生成する」から作ってみましょう。</p>
      ) : filteredContents.length === 0 ? (
        <p>該当するコンテンツが見つかりませんでした。</p>
      ) : (
        filteredContents.map((item) => (
          <Link key={item.id} to={`/edit/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ContentCard name={item.name} body={item.body} status={item.status} onDelete={() => onDelete(item.id)} />
          </Link>
        ))
      )}
    </div>
  );
}

export default DashboardPage;
