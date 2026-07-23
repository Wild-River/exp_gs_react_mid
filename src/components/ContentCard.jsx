import styles from './ContentCard.module.css';

function ContentCard({ name, body, status, isFavorite, tags }) {
  let label;

  if (status === '下書き') {
    label = styles.draft;
  } else if (status === '完成') {
    label = styles.complete;
  } else if (status === '公開') {
    label = styles.published;
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div>
          <div className={styles.name}>
            <div>{name}</div>
            <span className={`${styles.status} ${label}`}>{status}</span>
          </div>
        </div>
        {isFavorite ? <span>⭐️</span> : <span>☆</span>}
      </div>
      <p className={styles.body}>{body}</p>
      <div>{tags.map((tag) => tag)}</div>
    </div>
  );
}

export default ContentCard;
