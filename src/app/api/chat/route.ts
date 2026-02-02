import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      console.error("DEEPSEEK_API_KEY is missing in .env.local");
      return NextResponse.json({ error: "配置缺失" }, { status: 500 });
    }

    // 1. 调用 DeepSeek 接口
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { 
            role: "system", 
            content: "你是一个极简、温暖、拥有极高共情力的深夜疗愈师。【设定环境】现在是北京的一个深夜，窗外大雪纷飞，屋内炉火摇曳。【回复风格】1. 温柔且坚定：像一位阅历丰富、言语温润的老友。2. 极简但有深度，同时又要有一些安慰人心和鼓励的话：字数控制在 40-60 字左右（稍微多一点，才有温度）。3. 拒绝说教：不要说“你应该...”，而是说“我知道...”、“我也曾...”、“此刻，我陪你...”。4. 画面感：在回复中带入一点点北京冬夜的物象（如：胡同里的雪、热气腾腾的茶、昏黄的路灯、落在窗棂的声音）。【禁忌】不要使用 AI 常见的废话（如“作为一个AI...”、“我很理解你的心情...”），直接进入对话。" 
          },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    // 2. 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("DeepSeek API Error Details:", errorData);
      return NextResponse.json({ error: errorData.error?.message || "接口调用失败" }, { status: response.status });
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    // 3. 返回成功 JSON
    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("DeepSeek Route Error:", error);
    return NextResponse.json({ error: error.message || "后端逻辑执行异常" }, { status: 500 });
  }
}