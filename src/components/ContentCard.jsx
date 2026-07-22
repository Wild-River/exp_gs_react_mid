import styles from './ContentCard.module.css';

function ContentCard({ name, body, status }) {
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
        <h3 className={styles.name}>{name}</h3>
        <span className={`${styles.status} ${label}`}>{status}</span>
      </div>
      <p className={styles.body}>{body}</p>
    </div>
  );
}

export default ContentCard;
