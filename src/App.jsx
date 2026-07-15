import { useState } from 'react';
import ContentCard from './components/ContentCard';

function App() {
  const TONE_OPTION = ['やさしい', 'ていねい', 'かっこいい'];

  // 「商品名」「特徴」「トーン」を、それぞれ stateに
  const [name, setName] = useState('');
  const [feature, setFeature] = useState('');
  const [tone, setTone] = useState(TONE_OPTION);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState([]);

  async function handleGenerate() {
    setLoading(true);

    // 入力から「お願い文」を組み立てる
    const prompt = `あなたはECサイトのコピーライターです。次の商品の説明文を、${tone}トーンで、100文字程度で書いてください。商品名:${name}
特徴:${feature}`;

    const key = import.meta.env.VITE_GROQ_API_KEY;
    console.log('KEYある?', !!key, '／ gsk_で始まる?', key?.startsWith('gsk_'));

    // fetch で送り、await で「返事が来るまで待つ」バトンを受け取る
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`, //ここで認証情報を確認 半角スペースを必ず入れる！
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

    // setResult(data.choices[0].message.content);
    const newItem = {
      id: Date.now(), // 重複しないid（ミリ秒の数）
      name,
      body: text,
      status: '下書き',
    };

    // エラーを表示させる
    if (!res.ok) {
      setResult('エラー ' + res.status + '：' + (data.error?.message || '不明'));
      setLoading(false);
      return;
    }

    setContents([newItem, ...contents]);
    setLoading(false);
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>AI文章作成ツール</h1>
      <p>
        <label htmlFor='name'>
          名前：
          <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </p>
      <p>
        <label htmlFor='feature'>
          特徴：
          <input type='text' value={feature} onChange={(e) => setFeature(e.target.value)} />
        </label>
      </p>
      <p>
        <label htmlFor='tone'>
          トーン：
          <select name='tone' id='tone' onChange={(e) => setTone(e.target.value)}>
            {tone.map((opt) => {
              return (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              );
            })}
          </select>
        </label>
      </p>

      <button onClick={handleGenerate} disabled={loading}>
        {/* 本来ならinputに入力しないとボタンクリックできないようにエラーハンドリングする！API従量課金への対応 */}
        {loading ? '生成中…' : '生成する'}
      </button>
      <p style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>{result}</p>
      {contents.length === 0 ? <p>まだありません。上のフォームから生成してみましょう。</p> : contents.map((item) => <ContentCard key={item.id} {...item} />)}
    </div>
  );
}

export default App;
