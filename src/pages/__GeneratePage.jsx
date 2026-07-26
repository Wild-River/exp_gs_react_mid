import { useState } from 'react';

function GeneratePage({ onAdd }) {
  const [name, setName] = useState('');
  const [feature, setFeature] = useState('');
  const [tone, setTone] = useState('やさしい');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // ← エラーメッセージ用

  async function handleGenerate() {
    // 入力チェック：name.trim() は前後の空白を除く（"   "だけ→空とみなす）。空なら生成しない
    if (!name.trim()) {
      setError('商品名を入力してください。');
      return;
    }

    setLoading(true);
    setError(''); // 前回のエラーを消す

    try {
      const prompt = `あなたはECサイトのコピーライターです。
次の商品の説明文を、${tone}トーンで、100文字程度で書いてください。
商品名:${name}
特徴:${feature}`;

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

      // 200番台“以外”は失敗として扱う
      if (!res.ok) {
        throw new Error(`APIエラー（ステータス:${res.status}）`);
      }

      const data = await res.json();
      const text = data.choices[0].message.content;

      const newItem = {
        id: Date.now(),
        name: name,
        body: text,
        status: '下書き',
      };

      onAdd(newItem);
    } catch (e) {
      console.error(e); // 開発者向け：詳しい内容はコンソールへ
      setError('生成に失敗しました。少し時間をおいて、もう一度お試しください。');
    } finally {
      setLoading(false); // 成功でも失敗でも、必ずローディング解除
      // ここでAPIの処理をsetTimeoutを設定して連打できないようにする！！！
    }
  }

  return (
    <div>
      <h2>生成する</h2>

      <label>商品名</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder='例: Tシャツ' />

      <label>特徴（カンマ区切りでOK）</label>
      <input value={feature} onChange={(e) => setFeature(e.target.value)} placeholder='例: 夏用・軽い・白' />

      <label>トーン</label>
      <select value={tone} onChange={(e) => setTone(e.target.value)}>
        <option value='やさしい'>やさしい</option>
        <option value='かっこいい'>かっこいい</option>
        <option value='ていねい'>ていねい</option>
      </select>

      <button onClick={handleGenerate} disabled={loading || !name.trim()}>
        {loading ? '生成中…' : '生成する'}
      </button>

      {error && <p style={{ color: '#dc2626', marginTop: 12 }}>⚠️ {error}</p>}

      <p style={{ color: '#6b7280', marginTop: 12 }}>生成すると「ダッシュボード」に追加されます。</p>
    </div>
  );
}

export default GeneratePage;
