import { useState } from 'react';

function GeneratePage({ onAdd }) {
  const [name, setName] = useState('');
  const [feature, setFeature] = useState('');
  const [tone, setTone] = useState('やさしい');
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);

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

    const data = await res.json();
    if (!res.ok) {
      // 生成に失敗（キー違い・レート制限など）。落とさず知らせて止める
      alert('生成に失敗しました。\n' + (data.error?.message || 'エラー ' + res.status));
      setLoading(false);
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
    setLoading(false);
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

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? '生成中…' : '生成する'}
      </button>

      <p style={{ color: '#6b7280', marginTop: 12 }}>生成すると「ダッシュボード」に追加されます。</p>
    </div>
  );
}

export default GeneratePage;
