import { useState } from 'react';
import ContentCard from './components/ContentCard';
import styles from './App.module.css';

const TONE_OPTION = ['やさしい', 'ていねい', 'かっこいい'];
const TYPE_OPTION = ['商品説明', 'キャッチコピー', 'SNS投稿文', 'メール返信'];

// 入力から「お願い文」を組み立てる
const PROMPT_TEMPLATES = {
  商品説明: (name, feature, tone) => `あなたは購買意欲を高める文章作りが得意な、ECサイトのプロのコピーライターです。以下の商品について、魅力が伝わる説明文を100文字程度で考えてください。商品名: ${name}特徴: ${feature}トーン: ${tone}`,
  キャッチコピー: (name, feature, tone) => `あなたは数々のヒット商品を手がけてきた、プロのコピーライターです。以下の商品について、思わず目を引く印象的なキャッチコピーを10〜20文字程度で考えてください。商品名: ${name}特徴: ${feature}トーン: ${tone}`,
  SNS投稿文: (name, feature, tone) => `あなたはSNSマーケティングに精通した、プロの運用担当者です。以下の商品について、思わず読みたくなる、共感を呼ぶSNS投稿文を考えてください。商品名: ${name}特徴: ${feature}トーン: ${tone}`,
  メール返信: (name, feature, tone) => `あなたは丁寧な対応に定評のある、優秀な秘書です。以下の内容をふまえて、${tone}トーンのビジネスメール返信文を考えてください。件名・要件: ${name}返信で伝えたい内容: ${feature}`,
};

function App() {
  // それぞれの値をstateに設定
  const [name, setName] = useState(''); // 商品名
  const [feature, setFeature] = useState(''); //特徴
  const [tone, setTones] = useState(TONE_OPTION[0]); //トーン
  const [type, setTypes] = useState(TYPE_OPTION[0]); //種類を選ぶ
  const [status, setStatus] = useState({ loading: false, error: null }); //ステータス
  const [contents, setContents] = useState([]); //コンテンツの配列

  async function handleGenerate() {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const buildPrompt = PROMPT_TEMPLATES[type];
      if (!buildPrompt) {
        throw new Error('不明な値です。もう一度、選択してください。');
      }
      const prompt = buildPrompt(name, feature, tone);

      const key = import.meta.env.VITE_GROQ_API_KEY;
      // console.log('KEYある?', !!key, '／ gsk_で始まる?', key?.startsWith('gsk_'));

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

      // エラーを表示させる
      if (!res.ok) {
        setStatus({ loading: false, error: 'エラー ' + res.status + '：' + (data.error?.message || '不明') });
        return;
      }

      const text = data.choices[0].message.content;
      const newItem = {
        id: Date.now(), // 重複しないid（ミリ秒の数）
        name,
        body: text,
        status: '下書き',
        type,
      };

      setContents([newItem, ...contents]);
      setStatus({ loading: false, error: null });
    } catch (error) {
      setStatus((prev) => ({ ...prev, error: '通信エラーが発生しました' }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }

  return (
    <>
      <h1 className={styles.my80}>
        <span className={styles.title}>AI文章作成ツール</span>
      </h1>
      <div className={styles.aiContainer}>
        <p className={styles.my20}>
          <label htmlFor='type'>
            <span className={styles.label}>種類を選ぶ：</span>
            <select name='type' id='type' onChange={(e) => setTypes(e.target.value)} value={type}>
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
            <span className={styles.label}>名前：</span>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </p>
        <p className={styles.my20}>
          <label htmlFor='feature' className={styles.fieldLabel}>
            <span className={styles.label}>内容：</span>
            <textarea type='text' rows={8} cols={50} value={feature} onChange={(e) => setFeature(e.target.value)} />
          </label>
        </p>
        <p className={styles.my20}>
          <label htmlFor='tone'>
            <span className={styles.label}>トーン：</span>
            <select name='tone' id='tone' onChange={(e) => setTones(e.target.value)} value={tone}>
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
        <div className={styles.textCenter}>
          <button onClick={handleGenerate} disabled={status.loading} className={`${styles.btnPrimary} ${styles.my30}`}>
            {/* 本来ならinputに入力しないとボタンクリックできないようにエラーハンドリングする！API従量課金への対応 */}
            {status.loading ? '生成中…' : '生成する'}
          </button>
        </div>
      </div>

      {contents.length === 0 && <p className={styles.textCenter}>まだコンテンツがありません。フォームから生成してみましょう！</p>}
      <p style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>{status.error}</p>
      <div className={styles.contentsGrid}>
        {contents.map((item) => (
          <ContentCard key={item.id} {...item} />
        ))}
      </div>
    </>
  );
}

export default App;
