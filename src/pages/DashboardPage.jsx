import styles from './DashboardPage.module.css';
import { useState } from 'react';
import ContentCard from '../components/ContentCard';
import { STATUS_OPTION } from '../util/status';

function DashboardPage({ contents, onUpdate, onDelete }) {
  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState('新しい順');
  const [statusFilter, setStatusFilter] = useState('すべて');

  const countBy = (s) => contents.filter((c) => c.status === s).length;

  const filteredContents = contents
    .filter((c) => c.name.toLowerCase().includes(keyword.toLowerCase()))
    .filter((c) => statusFilter === 'すべて' || c.status === statusFilter)
    // b.id - a.id は id の大きい順＝新しい順、 a.id - b.id なら小さい0順＝古い順
    .sort((a, b) => (order === '新しい順' ? b.id - a.id : a.id - b.id)); //filter()を通った後の配列なのでsortをしても元は無傷

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
            （{STATUS_OPTION[2]}：{countBy(STATUS_OPTION[2])}件 / {STATUS_OPTION[1]}：{countBy(STATUS_OPTION[1])}件 / {STATUS_OPTION[0]}：{countBy(STATUS_OPTION[0])}件）
          </div>
        </div>
        <div>
          {selectTag && (
            <button onClick={removeFilter} className='btnPrimary'>
              フィルター解除
            </button>
          )}
        </div>
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor='search'>
          検索：
          <input type='text' id='search' value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder='商品名を入力' />
        </label>

        <div className={styles.inputContainerChild}>
          <label htmlFor='order'>
            絞り込み：
            <select name='order' id='order' value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value='新しい順'>新しい順</option>
              <option value='古い順'>古い順</option>
            </select>
          </label>
          <label htmlFor='statusFilter'>
            ステータス：
            <select name='statusFilter' id='statusFilter' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option key={0} value='すべて'>
                すべて
              </option>
              {STATUS_OPTION.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {contents.length === 0 ? (
        <p style={{ marginTop: 30 }}>まだありません。「生成する」から作ってみましょう。</p>
      ) : filteredContents.length === 0 ? (
        <p>該当するコンテンツが見つかりませんでした。</p>
      ) : (
        filteredContents
          //tagの文字列がCardに含まれているか
          .filter((item) => {
            if (selectTag === '') {
              return true;
            } else if (item.tags) {
              return item.tags.includes(selectTag);
            }
            return false;
          })
          .map((item) => (
            // ContentCardにはスプレッド構文でまとめて渡す
            <ContentCard key={item.id} {...item} onToggleFavorite={() => handleToggleFavorite(item.id, item.isFavorite)} onTagClick={setSelectTag} onDelete={() => onDelete(item.id)} />
          ))
      )}
    </div>
  );
}

export default DashboardPage;
