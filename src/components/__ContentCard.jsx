import styles from './ContentCard.module.css';

// ステータス → 色クラス（Day2 宿題①「色分け」の答え）
const statusClass = {
  下書き: styles.draft,
  完成: styles.done,
  公開: styles.open,
};

function ContentCard({ name, body, status, onDelete }) {
  function handleDelete(e) {
    e.preventDefault(); // Link への遷移を止める
    e.stopPropagation();
    if (window.confirm('このコンテンツを削除しますか？')) {
      onDelete();
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.name}>{name}</h3>
        <span className={`${styles.status}${statusClass[status] || ''}`}>{status}</span>
      </div>
      <p className={styles.body}>{body}</p>
      <button onClick={handleDelete} className={styles.deleteBtn}>
        削除
      </button>
    </div>
  );
}

export default ContentCard;
