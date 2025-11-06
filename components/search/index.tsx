'use client';

import SearchIcon from '@mui/icons-material/Search';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Configure,
  Highlight,
  InstantSearch,
  PoweredBy,
  useHits,
  useRefinementList,
  useSearchBox,
} from 'react-instantsearch';

type SearchModalProps = {
  appId?: string;
  apiKey?: string;
  indexName?: string;
  placeholder?: string;
  maxResults?: number;
  recentLimit?: number;
  recentStorageKey?: string;
  categoryAttribute?: string; // p.ej. "category" o "categories"
  hotkey?: string; // p.ej. "/" para abrir con teclado (opcional)
};

const DEFAULT_RECENT_KEY = 'recentSearches';

// Usa variables de entorno por defecto (Vite/Next con process.env si prefieres)
const baseClient = algoliasearch('4TDY33EUO7', '608f21be431aafe3420db1888c073a93');

/* --------------------------------- Util Icons ------------------------------ */
function LupaIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 21l-4.3-4.3" />
      <circle cx="10" cy="10" r="7" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-xs font-semibold uppercase text-gray-500">{children}</div>;
}

export default function SearchModal({
  appId,
  apiKey,
  indexName = 'feed',
  placeholder = 'Buscar productos…',
  maxResults = 8,
  recentLimit = 8,
  recentStorageKey = DEFAULT_RECENT_KEY,
  categoryAttribute = 'category',
  hotkey, // e.g. "/"
}: SearchModalProps) {
  const [open, setOpen] = useState(false);

  // Abrir con hotkey opcional
  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      // ignora si está escribiendo en un input/textarea/contenteditable
      const target = e.target as HTMLElement;
      const typing =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if (!typing && e.key === hotkey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  const searchClient = useMemo(
    () => (appId && apiKey ? algoliasearch(appId, apiKey) : baseClient),
    [appId, apiKey],
  );

  return (
    <div>
      {/* Botón de lupa (barra oculta hasta abrir modal) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center"
        aria-label="Abrir búsqueda"
      >
        <SearchIcon fontSize="large" />
        {hotkey && (
          <kbd className="ml-1 rounded border bg-gray-50 px-1 text-xs text-gray-500">{hotkey}</kbd>
        )}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-modal-title"
          onMouseDown={(e) => {
            // cerrar si clic en overlay fuera del panel
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <InstantSearch searchClient={searchClient} indexName={indexName}>
            <Configure hitsPerPage={maxResults} />

            <SearchPanel
              placeholder={placeholder}
              onClose={() => setOpen(false)}
              recentLimit={recentLimit}
              recentStorageKey={recentStorageKey}
              categoryAttribute={categoryAttribute}
            />
          </InstantSearch>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- UI: Panel -------------------------------- */

function SearchPanel({
  placeholder,
  onClose,
  recentLimit,
  recentStorageKey,
  categoryAttribute,
}: {
  placeholder?: string;
  onClose: () => void;
  recentLimit: number;
  recentStorageKey: string;
  categoryAttribute: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus inicial en el input & ESC para cerrar
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="mx-auto w-full max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-2xl"
    >
      {/* Header con input */}
      <div className="flex items-center gap-2 border-b p-3">
        <LupaIcon className="h-5 w-5 opacity-70" />
        <SearchBoxLine
          inputRef={inputRef}
          placeholder={placeholder}
          recentLimit={recentLimit}
          recentStorageKey={recentStorageKey}
        />
        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Cerrar búsqueda"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Cuerpo en 3 columnas */}
      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-3">
        <div>
          <SectionTitle> Categorías </SectionTitle>
          <CategoriesList attribute={categoryAttribute} />
        </div>

        <div>
          <SectionTitle> Resultados </SectionTitle>
          <ResultsList />
        </div>

        <div>
          <SectionTitle> Búsquedas recientes </SectionTitle>
          <RecentSearches storageKey={recentStorageKey} limit={recentLimit} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t p-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <kbd className="rounded border bg-gray-50 px-1.5">Esc</kbd>
          <span>para cerrar</span>
        </div>
        <PoweredBy className="text-gray-400" />
      </div>
    </div>
  );
}

/* --------------------------- Input controlado AIS -------------------------- */

function SearchBoxLine({
  inputRef,
  placeholder,
  recentLimit,
  recentStorageKey,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  placeholder?: string;
  recentLimit: number;
  recentStorageKey: string;
}) {
  const { query, refine } = useSearchBox();

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addRecent(recentStorageKey, query, recentLimit);
    }
  };

  return (
    <div className="flex w-full items-center gap-2">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => refine(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Buscar"
        className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
      />
      {query && (
        <button
          type="button"
          onClick={() => refine('')}
          className="rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          aria-label="Limpiar búsqueda"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}

/* -------------------------------- Resultados ------------------------------- */

function ResultsList() {
  const { hits } = useHits<any>();
  if (!hits || hits.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-gray-500">
        Empieza a escribir o selecciona una búsqueda/categoría…
      </div>
    );
  }

  return (
    <ul className="max-h-[60vh] divide-y divide-gray-100 overflow-auto">
      {hits.map((hit) => (
        <li key={hit.objectID}>
          <ResultItem hit={hit} />
        </li>
      ))}
    </ul>
  );
}

function ResultItem({ hit }: { hit: any }) {
  const href = hit.url || (hit.slug ? `/productos/${hit.slug}` : `#${hit.objectID}`);

  return (
    <Link href={href} className="flex flex-row gap-3 px-2 py-2 hover:bg-gray-50">
      <div className="relative h-[30px] w-[30px]">
        <Image
          className="object-contain"
          src={hit.image_link}
          alt={hit.name || hit.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-col">
        <div className="">
          <div className="truncate text-sm font-medium capitalize text-gray-900">
            <Highlight attribute={hit.name ? 'name' : 'title'} hit={hit} />
          </div>
          {hit.category && <div className="truncate text-xs text-gray-500">{hit.category}</div>}
        </div>

        <div className="whitespace-nowrap text-[10px] font-semibold text-gray-900">
          ${hit.price}
        </div>
      </div>
    </Link>
  );
}

/* --------------------------------- Categorías ------------------------------ */

function CategoriesList({ attribute }: { attribute: string }) {
  // Cambia limit si deseas más chips
  const { items, refine, canRefine } = useRefinementList({
    attribute,
    limit: 12,
  });

  if (!canRefine) {
    return <div className="text-sm text-gray-400">No hay categorías</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <button
          key={it.label}
          onClick={() => refine(it.value)}
          className={`rounded-full border px-3 py-1 text-xs transition ${
            it.isRefined
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          aria-pressed={it.isRefined}
        >
          {it.label} {typeof it.count === 'number' ? `(${it.count})` : ''}
        </button>
      ))}
    </div>
  );
}

/* --------------------------- Búsquedas recientes --------------------------- */

function getRecent(storageKey: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setRecent(storageKey: string, items: string[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {}
}

function addRecent(storageKey: string, q: string, limit: number) {
  const val = q.trim();
  if (!val) return;
  const current = getRecent(storageKey).filter((x) => x.toLowerCase() !== val.toLowerCase());
  current.unshift(val);
  setRecent(storageKey, current.slice(0, limit));
}

function RecentSearches({ storageKey, limit }: { storageKey: string; limit: number }) {
  const { refine } = useSearchBox();
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(getRecent(storageKey).slice(0, limit));
  }, [storageKey, limit]);

  const clearAll = () => {
    setRecent(storageKey, []);
    setItems([]);
  };

  if (items.length === 0) {
    return <div className="text-sm text-gray-400">Sin búsquedas aún</div>;
  }

  return (
    <div>
      <ul className="space-y-1">
        {items.map((q) => (
          <li key={q}>
            <button
              className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm hover:bg-gray-50"
              onClick={() => refine(q)}
            >
              <span className="truncate">🔎 {q}</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={clearAll}
        className="mt-2 text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700"
      >
        Limpiar historial
      </button>
    </div>
  );
}
