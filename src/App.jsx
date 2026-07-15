import { useState } from 'react';
import ContentCard from './components/ContentCard';
import styles from './App.module.css';

function App() {
  const TONE_OPTION = ['やさしい', 'ていねい', 'かっこいい'];
  const TYPE_OPTION = ['商品説明', 'キャッチコピー', 'SNS投稿文', 'メール返信'];

  // それぞれの値をstateに設定
  const [name, setName] = useState(''); // 商品名
  const [feature, setFeature] = useState(''); //特徴
  const [tone, setTones] = useState(TONE_OPTION[0]); //トーン
  const [type, setTypes] = useState(TYPE_OPTION[0]); //種類を選ぶ
  const [loading, setLoading] = useState(false); //読み込み中かどうか
  const [contents, setContents] = useState([]); //コンテンツの配列

  async function handleGenerate() {
    setLoading(true);

    // 入力から「お願い文」を組み立てる
    let prompt;
    switch (type) {
      case '商品説明':
        prompt = `あなたは購買意欲を高める文章作りが得意な、ECサイトのプロのコピーライターです。以下の商品について、魅力が伝わる説明文を100文字程度で考えてください。商品名: ${name}特徴: ${feature}トーン: ${tone}`;
        break;
      case 'キャッチコピー':
        prompt = `あなたは数々のヒット商品を手がけてきた、プロのコピーライターです。以下の商品について、思わず目を引く印象的なキャッチコピーを10〜20文字程度で考えてください。商品名: ${name}特徴: ${feature}トーン: ${tone}`;
        break;
      case 'SNS投稿文':
        prompt = `あなたはSNSマーケティングに精通した、プロの運用担当者です。以下の商品について、思わず読みたくなる、共感を呼ぶSNS投稿文を考えてください。商品名: ${name}特徴: ${feature}トーン: ${tone}`;
        break;
      case 'メール返信':
        prompt = `あなたは丁寧な対応に定評のある、優秀な秘書です。以下の内容をふまえて、${tone}トーンのビジネスメール返信文を考えてください。件名・要件: ${name}返信で伝えたい内容: ${feature}`;
        break;
      default:
        throw new Error('不明な値です。もう一度、選択してください。');
    }

    const key = import.meta.env.VITE_GROQ_API_KEY;
    console.log('KEYある?', !!key, '／ gsk_で始まる?', key?.startsWith('gsk_'));

    // fetch で送り、await で「返事が来るまで待つ」バトンを受け取る
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`, //ここで認証情報を確認[ベアラー] 半角スペースを必ず入れる！
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', //使うAIモデルの名前
        messages: [
          {
            role: 'user', //「会話の中で誰の発言か」を表すフィールド
            content: prompt, //「実際に送る文章（＝お願い）」
          },
        ],
      }),
    }); //返事が来るまで待つ

    const data = await res.json(); //返事をJSONとして読む（APIの返事は大抵JSON）
    const text = data.choices[0].message.content;

    const newItem = {
      id: Date.now(), // 重複しないid（ミリ秒の数）
      name,
      body: text,
      status: '下書き',
      type,
    };

    // エラーを表示させる
    if (!res.ok) {
      console.error('エラー ' + res.status + '：' + (data.error?.message || '不明'));
      setLoading(false);
      return;
    }

    setContents([newItem, ...contents]);
    setLoading(false);
  }

  return (
    <>
      <h1>AI文章作成ツール</h1>
      <p className={styles.my20}>
        <label htmlFor='type'>
          種類を選ぶ：
          <select name='type' id='type' onChange={(e) => setTypes(e.target.value)}>
            {TYPE_OPTION.map((type) => {
              return (
                <option key={type} value={type}>
                  {type}
                </option>
              );
            })}
          </select>
        </label>
      </p>
      <p className={styles.my20}>
        <label htmlFor='name'>
          名前：
          <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </p>
      <p className={styles.my20}>
        <label htmlFor='feature' className={styles.fieldLabel}>
          内容：
          <textarea type='text' rows={8} cols={50} value={feature} onChange={(e) => setFeature(e.target.value)} />
        </label>
      </p>
      <p className={styles.my20}>
        <label htmlFor='tone'>
          トーン：
          <select name='tone' id='tone' onChange={(e) => setTones(e.target.value)}>
            {TONE_OPTION.map((tone) => {
              return (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              );
            })}
          </select>
        </label>
      </p>

      <button onClick={handleGenerate} disabled={loading} className={`${styles.btnPrimary} ${styles.my30}`}>
        {/* 本来ならinputに入力しないとボタンクリックできないようにエラーハンドリングする！API従量課金への対応 */}
        {loading ? '生成中…' : '生成する'}
      </button>
      {contents.length === 0 && (
        <p>
          まだコンテンツがありません。
          <br />
          上のフォームから生成してみましょう！
        </p>
      )}
      <div className={styles.contentsGrid}>
        {contents.map((item) => (
          <ContentCard key={item.id} {...item} />
        ))}
      </div>
    </>
  );
}

export default App;
