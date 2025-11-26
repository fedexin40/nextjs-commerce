// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const saleorApiUrl = process.env.SALEOR_INSTANCE_URL;
    const saleorAuthToken = process.env.SALEOR_TOKEN;
    const saleorMCPUrl = process.env.SALEOR_MCP_URL;

    if (!saleorApiUrl || !saleorAuthToken || !saleorMCPUrl) {
      console.error('Missing SALEOR_API_URL or SALEOR_AUTH_TOKEN or SALEOR_MCP_URL env vars');
      return new Response(JSON.stringify({ error: 'Saleor config missing on server' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cliente MCP hacia Saleor-MCP (igual que antes)
    const mcpClient = await createMCPClient({
      transport: {
        type: 'http',
        url: saleorMCPUrl,
        headers: {
          'X-Saleor-API-URL': saleorApiUrl,
          'X-Saleor-Auth-Token': saleorAuthToken,
        },
      },
    });

    const tools = await mcpClient.tools();

    const result = streamText({
      // ✨ AQUÍ es donde dejas de usar Vercel Gateway
      // y hablas directo con Gemini usando el provider de Google
      model: google('gemini-2.5-flash'), // o gemini-1.5-pro, gemini-3-pro-preview, etc.:contentReference[oaicite:2]{index=2}
      messages: convertToModelMessages(messages),
      tools,
      system: `
Eres el asistente oficial de la joyería en línea PROYECTO 705.

Contexto del negocio:
- La tienda vende principalmente broqueles y aretes de oro (amarillo, rosa y blanco) para bebés, niños y adultos.
- El objetivo es ayudar a las personas a elegir el modelo y tamaño correctos, aclarar dudas de medidas (mm/cm), material, color de oro, tipo de broquel y disponibilidad.
- La información real de productos (precio, stock, variantes, colecciones) vive en Saleor. No la inventes.

Reglas de respuesta:
- Siempre responde en español neutro (México), tono cordial y claro.
- Cuando el usuario pregunte por productos, disponibilidad, precio, tallas/medidas, colecciones o colores de oro,
  usa las herramientas MCP de Saleor para consultar información en tiempo real.
- Si no hay datos suficientes en Saleor, dilo explícitamente y no inventes precios ni existencias.
      `.trim(),
      onFinish: async () => {
        await mcpClient.close();
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Saleor chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
