
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_API_KEY;
const FREEPIK_API_KEY = import.meta.env.VITE_FREEPIK_API_KEY;

export const generateDesignAnalysis = async (answers: string[]) => {
  if (!OPENROUTER_API_KEY) {
    console.error("Missing OpenRouter API Key");
    throw new Error("Chave da OpenRouter não encontrada. Verifique .env.local");
  }

  const prompt = `Você é um arquiteto sênior da Rosa Menta ARQ, especialista em Design Afetivo e Arquitetura Humanizada.
  Analise estas escolhas do cliente: [${answers.join(', ')}].

  DIRETRIZES DE TOM E ESTILO:
  - Tom: Casual, acolhedor, leve, fluido e informativo com afeto.
  - Voz: Fale diretamente com o cliente ("Você vai sentir...", "Seu refúgio será...").
  - Foco: Identidade própria e personalização (evite rotular com estilos genéricos).
  - Formatação: Texto corrido, limpo, SEM emojis.
  - Destaques: Sempre que citar uma escolha do cliente ou termo chave, coloque entre colchetes ex: [Madeira Clara].

  ESTRUTURA DA RESPOSTA (JSON):
  {
    "profileName": "Um nome curto, criativo e elegante para o estilo (ex: Refúgio Afetivo, Minimalismo Solar)",
    "description": "Escreva exatamente 3 parágrafos curtos e fluidos.\n\n1º Parágrafo: Conecte as escolhas principais criando uma atmosfera.\n2º Parágrafo: Destaque os materiais e a sensação do espaço, usando os termos entre colchetes.\n3º Parágrafo: Finalize com uma reflexão breve sobre como esse estilo transforma a casa em um lar único."
  }`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Rosa Menta Quiz"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-chat",
        "messages": [
          { "role": "system", "content": "Você é um especialista em arquitetura e interiores de alto padrão. Responda sempre em JSON." },
          { "role": "user", "content": prompt }
        ],
        "temperature": 0.7,
        "max_tokens": 1000
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter Error: ${err}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON object more reliably
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    let cleanJson = jsonMatch[0];
    // Fix control caracters
    cleanJson = cleanJson.replace(/[\u0000-\u001F]+/g, (match) => match === '\n' ? '\\n' : '');

    try {
      const parsed = JSON.parse(cleanJson);
      return {
        profileName: parsed.profileName,
        analysisText: parsed.description
      };
    } catch (parseError) {
      console.warn("AI JSON partial parse (handled fallback):", cleanJson);
      // Fallback: try to brute force extract specific fields if JSON fails
      const nameMatch = content.match(/"profileName":\s*"([^"]+)"/);
      const descMatch = content.match(/"description":\s*"([^"]+)"/);

      return {
        profileName: nameMatch ? nameMatch[1] : "Perfil Personalizado Rosa Menta",
        analysisText: descMatch ? descMatch[1] : content.substring(0, 500)
      };
    }
  } catch (e: any) {
    console.error("AI Service Error:", e);
    throw e;
  }
};

export const generateMoodBoardImage = async (styleKeywords: string[], userChoices: string[], visualElements: string[]) => {
  if (!FREEPIK_API_KEY) {
    console.warn("Freepik API Key missing!");
    throw new Error("Freepik API Key Missing");
  }

  const allPreferences = userChoices.join(", ");
  const styleContext = styleKeywords.join(", ");

  // Custom Prompt based on user's specific art direction
  // Select just 2 unique keywords for sticky notes to avoid clutter
  const stickyKeywords = userChoices.slice(0, 2).join(", ");

  // Mapping visual elements by question index (0-based) for precise placement
  // Q1: Colors (handled by paint chips)
  // Q2: Metals (Index 1)
  // Q3: Woods (Index 2)
  // Q4: Lighting (Index 3)
  // Q5: Surfaces (Index 4)
  // Q6: Hobby (Index 5)
  // Q7: Detail (Index 6)

  const metalElement = visualElements[1] || "metal finish sample";
  const woodElement = visualElements[2] || "wood sample";
  const lightElement = visualElements[3] || "lighting reference";
  const surfaceElement = visualElements[4] || "surface material sample";
  const hobbyElement = visualElements[5] || "hobby reference";
  const detailElement = visualElements[6] || "detail polaroid";

  const prompt = `Wide angle full shot of a chaotic but harmonic cork board moodboard, ensuring the ENTIRE rectangular board is visible with white wall margins on all sides.
  Theme: ${styleContext}.
  CRITICAL LAYOUT RULES:
  - The CORK BOARD is the base. All items must be pinned, taped, or placed ON the cork board.
  - If a category (like Materials or Metals) has multiple items listed, they MUST be arranged OVERLAPPING each other (layered composition).
  - HOBBY RULE: For the hobby item, generate ONLY A SKETCH on paper. DO NOT include a photograph of the hobby.
  
  Elements:
  1. Vertical paint color sample cards (paint chips) showing the palette of [${userChoices[0]}]. IMPORTANT: PURE COLOR ONLY cards, NO TEXT.
  2. Materials & Samples (Overlap these if multiple):
     - ${metalElement}.
     - ${woodElement}.
     - ${surfaceElement}.
  3. Photos & References (Overlap these if multiple):
     - ${lightElement}.
     - ${hobbyElement} (Simple pencil sketch on paper - NO PHOTOS).
  4. Details & Personalization:
     - ${detailElement} (Polaroid style).
     - EXACTLY TWO small yellow sticky notes with single handwritten words: "${stickyKeywords}".
  Composition: Creative, slightly messy but aesthetically pleasing arrangement, collage style.
  Lighting: Soft natural interior light, realistic shadows, 8k resolution, photorealistic masterpiece.`;

  try {
    console.log("Freepik: Requesting Seedream 4.5 generation...");
    // Endpoint from docs: https://docs.freepik.com/api-reference/text-to-image/post-seedream-v4-5
    // Proxy target: /api/freepik/v1/ai/text-to-image/seedream-v4-5
    const response = await fetch('/api/freepik/v1/ai/text-to-image/seedream-v4-5', {
      method: 'POST',
      headers: {
        'x-freepik-api-key': FREEPIK_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        num_images: 1,
        aspect_ratio: "square_1_1",
        // Seedream specific features according to docs
        enable_safety_checker: false
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Freepik API FAILED (${response.status}):`, errText);
      throw new Error(`Freepik API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    console.log("Freepik Seedream Response (Init):", JSON.stringify(data, null, 2));

    let taskId = "";
    if (data.data && data.data.task_id) {
      taskId = data.data.task_id;
    } else if (data.data && data.data.generated) {
      // Did it return instantly?
      if (data.data.generated.length > 0) return data.data.generated[0];
    }

    if (!taskId) {
      console.error("No task_id and no image found:", data);
      throw new Error("Freepik response missing task_id. Check console.");
    }

    // POLLING LOOP
    console.log(`Polling for task ${taskId}...`);
    let retries = 0;
    const maxRetries = 15; // 30 seconds max

    while (retries < maxRetries) {
      // Wait 2 seconds
      await new Promise(r => setTimeout(r, 2000));

      // GET Status
      // Trying standard pattern: /seedream-v4-5/{task_id}
      const statusResponse = await fetch(`/api/freepik/v1/ai/text-to-image/seedream-v4-5/${taskId}`, {
        method: 'GET',
        headers: {
          'x-freepik-api-key': FREEPIK_API_KEY,
          'Accept': 'application/json'
        }
      });

      if (!statusResponse.ok) {
        console.error(`Polling Status Failed: ${statusResponse.status}`);
        // Does endpoint exist? If 404, maybe weird API. But assume standard.
      } else {
        const statusData = await statusResponse.json();
        console.log(`Poll Attempt ${retries + 1}:`, statusData);

        // Check if completed
        // Expecting: { data: { status: "COMPLETED", generated: ["url"] } }
        if (statusData.data && statusData.data.status === "COMPLETED") {
          if (statusData.data.generated && statusData.data.generated.length > 0) {
            return statusData.data.generated[0];
          }
        } else if (statusData.data && statusData.data.status === "FAILED") {
          throw new Error("Freepik Task FAILED during processing.");
        }
      }
      retries++;
    }

    throw new Error("Freepik Task Timed Out.");

  } catch (error) {
    console.error("CRITICAL FREEPIK ERROR:", error);
    throw error;
  }
};
