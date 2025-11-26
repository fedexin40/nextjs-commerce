'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from '../ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '../ai-elements/message';
import { PromptInput, PromptInputSubmit, PromptInputTextarea } from '../ai-elements/prompt-input';

export function SaleorChat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === 'streaming' || status === 'submitted';

  return (
    <div className="flex h-full flex-col">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="Pregunta sobre la tienda"
              description="Escribe abajo para buscar productos, detalles de órdenes, o etc."
            />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.role === 'assistant' ? (
                    <MessageResponse>
                      {message.parts
                        ?.filter((part) => part.type === 'text')
                        .map((part) => part.text)
                        .join('')}
                    </MessageResponse>
                  ) : (
                    message.parts?.map((part) => part.type === 'text' && part.text)
                  )}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
      </Conversation>

      <div className="border-t p-3">
        <PromptInput
          onSubmit={(message, event) => {
            event.preventDefault();
            if (message.text) {
              sendMessage({ text: message.text });
              setInput('');
            }
          }}
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta por productos, colecciones o detalles de la tienda..."
            disabled={isLoading}
            rows={1}
            className="flex-1"
          />
          <PromptInputSubmit disabled={isLoading} />
        </PromptInput>
      </div>
    </div>
  );
}
