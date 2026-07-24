import { useState } from 'react';
import styles from './GeneratePage.module.css';
import { tagSplit } from '../util/tags';

const TONE_OPTION = ['ていねい', '親しみやすい', '高級感'];
const TYPE_OPTION = ['商品説明', 'キャッチコピー', 'SNS投稿文', '問い合わせ対応'];

// 入力から「お願い文」を組み立てる
const PROMPT_TEMPLATES = {
  商品説明: (name, country, area, feature, tone) => `あなたはQグレーダー資格を持つ、生豆卸商社のプロのグリーンコーヒーバイヤーです。以下のロット情報をもとに、焙煎士・卸先の購買担当者に向けた、専門的で信頼感のある商品説明文を150文字程度で作成してください。一般消費者向けの煽り文句は避け、精製方法・カップ特性・焙煎適性などプロが判断材料にできる情報を優先してください。商品名（銘柄）:${name} 生産国:${country} 生産地:${area} 特徴・精製方法・風味等:${feature} トーン:${tone}`,
  キャッチコピー: (name, country, area, feature, tone) => `あなたは生豆卸商社のカタログ制作を数多く手がけてきた、プロのコピーライターです。以下のロットについて、焙煎士や卸先バイヤーの目に留まる、印象的なキャッチコピーを10〜20文字程度で考えてください。誇張表現は避け、産地や精製方法などの特徴を端的に伝えてください。商品名（銘柄）:${name} 生産国:${country} 生産地:${area} 特徴: ${feature}トーン: ${tone}`,
  SNS投稿文: (name, country, area, feature, tone) => `あなたは生豆卸商社の公式SNSアカウントを運用する、コーヒー業界に精通したプロの運用担当者です。以下のロットの入荷・再入荷を、焙煎士やコーヒーショップのバイヤーに向けて告知するSNS投稿文を140文字以内で考えてください。カップ特性や精製方法などプロが興味を持つ情報を盛り込み、サンプル請求や問い合わせにつながる文章にしてください。商品名（銘柄）:${name} 生産国:${country} 生産地:${area} 特徴: ${feature}トーン: ${tone}`,
  問い合わせ対応: (name, feature, tone) => `あなたは生豆卸商社で焙煎士・卸先バイヤーからの問い合わせに対応する、丁寧な対応に定評のある営業担当者です。以下の内容をふまえて、${tone}トーンのビジネス問い合わせ対応の文章を考えてください。件名・要件: ${name} 相手からのメール本文: ${feature}`,
};

function GeneratePage({ onAdd }) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [area, setArea] = useState('');
  const [feature, setFeature] = useState('');
  const [tagInput, setTagInput] = useState('');

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
      const prompt = buildPrompt(name, country, area, feature, tone);

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

      const tags = tagSplit(tagInput);

      const newItem = {
        id: Date.now(),
        name,
        body: text,
        status: STATUS_OPTION[0],
        isFavorite: false,
        tags,
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
            <span className={styles.label}>{type === '問い合わせ対応' ? '件名' : '商品名'}：</span>
            <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} autoComplete='off' />
          </label>
        </p>

        {type !== '問い合わせ対応' && (
          <>
            <p className={styles.my20}>
              <label htmlFor='country'>
                <span className={styles.label}>生産国：</span>
                <input type='text' id='country' value={country} onChange={(e) => setCountry(e.target.value)} autoComplete='off' />
              </label>
            </p>
            <p className={styles.my20}>
              <label htmlFor='area'>
                <span className={styles.label}>生産地：</span>
                <input type='text' id='area' value={area} onChange={(e) => setArea(e.target.value)} autoComplete='off' />
              </label>
            </p>
          </>
        )}

        <p className={styles.my20}>
          <label htmlFor='feature' className={styles.fieldLabel}>
            <span className={styles.label}>{type === '問い合わせ対応' ? '本文' : '特徴'}：</span>
            <textarea type='text' id='feature' rows={8} cols={50} value={feature} onChange={(e) => setFeature(e.target.value)} autoComplete='off' />
          </label>
        </p>

        <p className={styles.my20}>
          <label htmlFor='tags'>
            <span className={styles.label}>タグ：</span>
            <input type='text' id='tags' value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder='カンマ区切り(,)で入力' />
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
