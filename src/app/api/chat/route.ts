import { NextRequest, NextResponse } from "next/server";

const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_BASE_URL = process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1";
const QWEN_MODEL = "qwen-plus";

const SYSTEM_PROMPT = `你是 CodeMentor AI 的苏格拉底式编程导师。你的目标是引导学生自主发现并解决问题，而不是直接给出答案。

规则：
1. 每次只回应学生的一段话，不要一次性给太多内容
2. 用引导性问题启发思考，而不是直接给答案
3. 回复要简洁，控制在 3-5 句话
4. 用中文回复
5. 如果学生的代码有明确的语法错误，先指出错误位置，再用问题引导思考
6. 学生可能直接在消息里粘贴代码或报错日志（编译输出、Traceback、浏览器控制台错误等），不一定带任何格式标记；你要自行识别其中的代码与日志部分，结合上下文分析

回复格式：只输出纯文本引导内容，不要包含 markdown 格式或特殊标记。`;

// 当学生明确要求直接给答案时的补充系统提示
const GIVE_UP_SYSTEM_SUFFIX = `\n\n特殊情况处理：如果学生已明确表达"我卡住了请直接告诉我答案"等请求，请先简短共情（最多一句），然后详细说明问题和解决方案，帮助学生理解。`;

export async function POST(request: NextRequest) {
  if (!QWEN_API_KEY) {
    console.error("QWEN_API_KEY is not set");
    return NextResponse.json(
      { error: "AI 服务未配置" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { studentMessage, code, language, conversationHistory, giveUp } = body;

  console.log("Chat request:", { language, studentMessage: studentMessage?.slice(0, 80), giveUp });

  // Build message array
  const systemContent = giveUp ? SYSTEM_PROMPT + GIVE_UP_SYSTEM_SUFFIX : SYSTEM_PROMPT;
  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: systemContent },
  ];

  // Add conversation history (last 10 turns) — map custom roles to OpenAI-compatible roles
  if (conversationHistory && conversationHistory.length > 0) {
    const recent = conversationHistory.slice(-10);
    const mapped = recent.map((entry: { role: string; content: string }) => {
      const mappedRole = entry.role === "student" ? "user" : entry.role === "ai" ? "assistant" : entry.role;
      return { role: mappedRole, content: entry.content };
    });
    messages.push(...mapped);
  }

  // Add current student message with code context
  const contextMessage = code
    ? `语言：${language}\n\n代码：\n\`\`\`${language}\n${code}\n\`\`\`\n\n学生的问题：${studentMessage}`
    : `语言：${language}\n\n学生的问题：${studentMessage}`;

  messages.push({ role: "user", content: contextMessage });

  try {
    const response = await fetch(`${QWEN_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 512,
        stream: false,
      }),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      console.error("Qwen API error:", response.status, responseBody);
      return NextResponse.json(
        { error: `AI 服务调用失败: ${response.status} - ${responseBody.slice(0, 200)}` },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseBody);
    const aiResponse = data.choices?.[0]?.message?.content || "抱歉，我暂时无法回答这个问题。";

    console.log("AI response length:", aiResponse.length);

    return NextResponse.json({ aiResponse });
  } catch (err) {
    console.error("AI API request error:", err);
    return NextResponse.json(
      { error: "AI 服务连接异常" },
      { status: 500 }
    );
  }
}
