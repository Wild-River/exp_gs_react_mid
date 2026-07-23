import { Link } from 'react-router-dom';
import ContentCard from '../components/ContentCard';

function DashboardPage({ contents }) {
  const publishedCount = contents.filter((c) => c.status === '公開').length;
  const completeCount = contents.filter((c) => c.status === '完成').length;
  const draftCount = contents.filter((c) => c.status === '下書き').length;
  return (
    <div>
      <h2>生成したコンテンツ</h2>
      <div style={{ marginBottom: 30, fontSize: 16 }}>
        （公開：{publishedCount}件 / 完成：{completeCount}件 / 下書き{draftCount}件）
      </div>
      {contents.length === 0 ? (
        <p>まだありません。「生成する」から作ってみましょう。</p>
      ) : (
        contents.map((item) => (
          <Link key={item.id} to={`/edit/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {/* ContentCardにはスプレッド構文でまとめて渡す */}
            <ContentCard {...item} />
          </Link>
        ))
      )}
    </div>
  );
}

export default DashboardPage;
