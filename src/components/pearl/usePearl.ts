'use client';

import { useEffect, useRef, useState } from 'react';
import {
  buildPrompt,
  modelAvailability,
  prepareModel,
  streamAnswer,
  type ModelState,
  type Turn,
} from '@/lib/pearl-local/on-device';
import {
  classify,
  createIndex,
  dontKnow,
  fitAnswer,
  MAX_INPUT,
  OPENING,
  PAY_REPLY,
  quickAnswer,
  sourceOf,
  type PearlData,
  type Source,
} from '@/lib/pearl-local/search';

export type Message = { id: string; role: 'visitor' | 'pearl'; text: string; sources: Source[]; error?: boolean };
export type Status = 'idle' | 'thinking' | 'streaming';

// The conversation lasts for the browser session; New chat clears it
const KEY = 'kr-pearl-v1';

function load(): Message[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Message[]).filter((m) => typeof m?.text === 'string') : [];
  } catch {
    return [];
  }
}

function save(messages: Message[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(messages));
  } catch {
    // Storage unavailable (private mode): the chat lasts for this page only.
  }
}

const id = () => crypto.randomUUID();

export function usePearl(data: PearlData) {
  // The panel renders only in the browser (ssr: false), so reading storage during the first render is safe
  const [messages, setMessages] = useState<Message[]>(load);
  const [status, setStatus] = useState<Status>('idle');
  const [model, setModel] = useState<ModelState>('checking');
  const [progress, setProgress] = useState<number | null>(null);
  const [search] = useState(() => createIndex(data.sections));
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    let live = true;
    void modelAvailability().then((m) => live && setModel(m));
    return () => {
      live = false;
      abort.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (status === 'idle') save(messages);
  }, [messages, status]);

  const update = (msgId: string, patch: Partial<Message>) =>
    setMessages((list) => list.map((m) => (m.id === msgId ? { ...m, ...patch } : m)));

  /** The visitor opts in to the one-time on-device model download; nothing downloads without this click. */
  async function enableModel() {
    setModel('downloading');
    setProgress(0);
    try {
      await prepareModel((f) => setProgress(f));
      setModel('available');
    } catch {
      setModel('unavailable');
    } finally {
      setProgress(null);
    }
  }

  async function send(raw: string) {
    const text = raw.trim().slice(0, MAX_INPUT);
    if (!text || status !== 'idle') return;
    const history: Turn[] = messages.map((m) => ({ role: m.role, text: m.text }));
    const reply: Message = { id: id(), role: 'pearl', text: '', sources: [] };
    setMessages((list) => [...list, { id: id(), role: 'visitor', text, sources: [] }, reply]);

    const intent = classify(text);
    // Greetings, pay questions and job descriptions get answers built from the content, never from the model: a small
    // on-device model can't be trusted to judge fit without inventing evidence
    if (intent !== 'question' || model !== 'available') {
      const fixed =
        intent === 'greeting'
          ? { text: OPENING, sources: [] }
          : intent === 'pay'
            ? { text: PAY_REPLY, sources: [] }
            : intent === 'jd'
              ? fitAnswer(text, data)
              : quickAnswer(text, data, search);
      update(reply.id, fixed);
      return;
    }

    const sections = search(text, 3).map((h) => h.section);
    // With nothing relevant to read, a small model is likeliest to make something up; it never gets the chance
    if (sections.length === 0) {
      update(reply.id, { text: dontKnow(data.email) });
      return;
    }

    const controller = new AbortController();
    abort.current = controller;
    setStatus('thinking');
    try {
      for await (const partial of streamAnswer(buildPrompt(text, sections, history), controller.signal)) {
        setStatus('streaming');
        update(reply.id, { text: partial });
      }
      // A refusal or "I don't know" used none of the sections, so it cites none
      setMessages((list) =>
        list.map((m) =>
          m.id === reply.id && !/don't have that|not able to (assist|help)|only here to help/i.test(m.text)
            ? { ...m, sources: sections.map(sourceOf) }
            : m,
        ),
      );
    } catch (err) {
      if (controller.signal.aborted) return;
      // The model failed mid-answer (out of memory, say): answer from the content instead of leaving a blank
      console.warn('[pearl] on-device model failed, using quick answers', err);
      update(reply.id, quickAnswer(text, data, search));
    } finally {
      abort.current = null;
      setStatus('idle');
    }
  }

  function stop() {
    abort.current?.abort();
  }

  function newChat() {
    abort.current?.abort();
    setMessages([]);
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      // Nothing stored to clear.
    }
  }

  return { messages, status, model, progress, send, stop, newChat, enableModel };
}
