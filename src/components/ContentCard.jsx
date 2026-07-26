import { Link } from 'react-router-dom';
import { PencilLine, Heart, Trash } from 'lucide-react';
import styles from './ContentCard.module.css';
import { STATUS_OPTION } from '../util/status';

function ContentCard({ id, name, body, status, isFavorite, tags, onToggleFavorite, onTagClick, onDelete }) {
  const statusClass = {
    [STATUS_OPTION[0]]: styles.draft,
    [STATUS_OPTION[1]]: styles.complete,
    [STATUS_OPTION[2]]: styles.published,
  };

  const filteredTag = (tag) => {
    onTagClick(tag);
  };

  function handleDelete() {
    if (window.confirm('このコンテンツを削除しますか？')) {
      onDelete();
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div>
          <div className={styles.name}>
            <div>{name}</div>
            <span className={`${styles.status} ${statusClass[status] || ''}`}>{status}</span>
          </div>
        </div>
        <div>
          <span onClick={onToggleFavorite} className={styles.favoriteIcon}>
            <Heart size={24} fill={isFavorite ? '#F91980' : 'none'} color={isFavorite ? '#F91980' : '#6b6375'} strokeWidth={1.5} />
          </span>
          <span className={styles.trashIcon}>
            <Trash onClick={handleDelete} size={24} color={'#6b6375'} strokeWidth={1.5} />
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
