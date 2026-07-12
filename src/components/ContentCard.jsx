import styles from './ContentCard.module.css';

function ContentCard({ name, body, status }) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.status}>{status}</span>
      </div>
      <p className={styles.body}>{body}</p>
    </div>
  );
}

export default ContentCard;
