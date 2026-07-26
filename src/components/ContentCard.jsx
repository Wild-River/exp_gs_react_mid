import { Link } from 'react-router-dom';
import { PencilLine, Heart } from 'lucide-react';
import styles from './ContentCard.module.css';
import { STATUS_OPTION } from '../util/status';

function ContentCard({ id, name, body, status, isFavorite, tags, onToggleFavorite, onTagClick }) {
  let label;

  if (status === STATUS_OPTION[0]) {
    label = styles.draft;
  } else if (status === STATUS_OPTION[1]) {
    label = styles.complete;
  } else if (status === STATUS_OPTION[2]) {
    label = styles.published;
  }

  const filteredTag = (tag) => {
    onTagClick(tag);
  };

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div>
          <div className={styles.name}>
            <div>{name}</div>
            <span className={`${styles.status} ${label}`}>{status}</span>
          </div>
        </div>
        <div>
          <span onClick={onToggleFavorite} className={styles.favoriteIcon}>
            <Heart size={24} fill={isFavorite ? '#F91980' : 'none'} color={isFavorite ? '#F91980' : '#6b6375'} strokeWidth={1.5} />
          </span>
          <span className={styles.pencil}>
            <Link to={`/edit/${id}`}>
              <PencilLine size={24} color={'#6b6375'} strokeWidth={1.5} />
            </Link>
          </span>
        </div>
      </div>
      <p className={styles.body}>{body}</p>
      <div>
        {tags?.map((tag) => (
          <span key={tag} className={styles.tag} onClick={() => filteredTag(tag)}>{`#${tag}`}</span>
        ))}
      </div>
    </div>
  );
}

export default ContentCard;
