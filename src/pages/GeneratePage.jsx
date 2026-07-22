import { useState } from 'react';
import styles from './GeneratePage.module.css';

const TONE_OPTION = ['ていねい', '親しみやすい', '高級感'];
const TYPE_OPTION = ['商品説明', 'キャッチコピー', 'SNS投稿文', 'メール返信'];

// 入力から「お願い文」を組み立てる
const PROMPT_TEMPLATES = {
  商品説明: (name, feature, tone) => `あなたは購買意欲を高める文章作りが得意な、ECサイトのプロのコピーライターです。以下の商品について、魅力が伝わる説明文を100文字程度で考えてください。商品名:${name} 特徴: ${feature}トーン: ${tone}`,
  キャッチコピー: (name, feature, tone) => `あなたは数々のヒット商品を手がけてきた、プロのコピーライターです。以下の商品について、思わず目を引く印象的なキャッチコピーを10〜20文字程度で考えてください。商品名:${name} 特徴: ${feature}トーン: ${tone}`,
  SNS投稿文: (name, feature, tone) => `あなたはSNSマーケティングに精通した、プロの運用担当者です。以下の商品について、思わず読みたくなる、共感を呼ぶSNS投稿文を140文字以内で考えてください。商品名:${name} 特徴: ${feature}トーン: ${tone}`,
  メール返信: (name, feature, tone) => `あなたは丁寧な対応に定評のある、優秀な秘書です。以下の内容をふまえて、${tone}トーンのビジネスメール返信文を考えてください。件名・要件: ${name} 相手からのメール本文: ${feature}`,
};

function GeneratePage({ onAdd }) {
  const [name, setName] = useState('');
  const [feature, setFeature] = useState('');
  const [tone, setTones] = useState(TONE_OPTION[0]); //トーン
  const [type, setTypes] = useState(TYPE_OPTION[0]); //種類を選ぶ
  const [status, setStatus] = useState({ loading: false, error: null }); //ステータス

  async function handleGenerate() {
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const buildPrompt = PROMPT_TEMPLATES[type];
      if (!buildPrompt) {
        throw new Error('不明な値です。もう一度、選択してください。');
      }
      const prompt = buildPrompt(name, feature, tone);

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        // 生成に失敗（キー違い・レート制限など）。落とさず知らせて止める
        alert('生成に失敗しました。\n' + (data.error?.message || 'エラー ' + res.status));
        setStatus({ loading: false, error: 'エラー ' + res.status + '：' + (data.error?.message || '不明') });
        return;
      }
      const text = data.choices[0].message.content;

      const newItem = {
        id: Date.now(),
        name: name,
        body: text,
        status: '下書き',
      };

      onAdd(newItem); // ← App に「これを追加して」とお願いする
      setStatus({ loading: false, error: null });
    } catch (error) {
      console.error(error); // ブラウザの開発者コンソールに詳細が出る
      setStatus((prev) => ({ ...prev, error: '通信エラーが発生しました' }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }

  return (
    <>
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
            <span className={styles.label}>{type === 'メール返信' ? '件名' : '商品名'}：</span>
            <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} autoComplete='off' />
          </label>
        </p>
        {type !== 'メール返信' && (
          <>
            <p className={styles.my20}>
              <label htmlFor='country'>
                <span className={styles.label}>生産国：</span>
                <input type='text' id='country' autoComplete='off' />
              </label>
            </p>
            <p className={styles.my20}>
              <label htmlFor='area'>
                <span className={styles.label}>生産地：</span>
                <input type='text' id='area' autoComplete='off' />
              </label>
            </p>
          </>
        )}

        <p className={styles.my20}>
          <label htmlFor='feature' className={styles.fieldLabel}>
            <span className={styles.label}>{type === 'メール返信' ? '本文' : '特徴'}：</span>
            <textarea type='text' id='feature' rows={8} cols={50} value={feature} onChange={(e) => setFeature(e.target.value)} autoComplete='off' />
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

      <p style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>{status.error}</p>
      <p style={{ color: '#6b7280', marginTop: 12, fontSize: 16 }}>生成すると「ダッシュボード」に追加されます。</p>
    </>
  );
}

export default GeneratePage;
