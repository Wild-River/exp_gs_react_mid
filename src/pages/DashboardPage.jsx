import styles from './DashboardPage.module.css';
import { useState } from 'react';
import ContentCard from '../components/ContentCard';
import { STATUS_OPTION } from '../util/status';

function DashboardPage({ contents, onUpdate }) {
  const publishedCount = contents.filter((c) => c.status === STATUS_OPTION[2]).length;
  const completeCount = contents.filter((c) => c.status === STATUS_OPTION[1]).length;
  const draftCount = contents.filter((c) => c.status === STATUS_OPTION[0]).length;

  const [selectTag, setSelectTag] = useState('');

  function handleToggleFavorite(id, isFavorite) {
    onUpdate(id, { isFavorite: !isFavorite }); // App にお願いして更新
  }

  const removeFilter = () => {
    setSelectTag('');
  };

  return (
    <div>
      <div className={styles.buttonContainer}>
        <div>
          <h2>生成したコンテンツ</h2>
          <div className={styles.contentStatus}>
            （{STATUS_OPTION[2]}：{publishedCount}件 / {STATUS_OPTION[1]}：{completeCount}件 / {STATUS_OPTION[0]}：{draftCount}件）
          </div>
        </div>
        <div>{selectTag && <button onClick={removeFilter}>フィルター解除</button>}</div>
      </div>

      {contents.length === 0 ? (
        <p style={{ marginTop: 30 }}>まだありません。「生成する」から作ってみましょう。</p>
      ) : (
        contents
          //tagの文字列がCardに含まれているか
          .filter((item) => {
            if (selectTag === '') {
              return item;
            } else if (item.tags) {
              return item.tags.includes(selectTag);
            }
            return false;
          })
          .map((item) => (
            // ContentCardにはスプレッド構文でまとめて渡す
            <ContentCard key={item.id} {...item} onToggleFavorite={() => handleToggleFavorite(item.id, item.isFavorite)} onTagClick={setSelectTag} />
          ))
      )}
    </div>
  );
}

export default DashboardPage;
