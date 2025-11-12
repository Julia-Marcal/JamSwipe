import React from 'react';
import PlaylistSelector, { mockPlaylists } from './PlaylistSelector.jsx';
import { Button } from '@/components/ui/button.jsx';
import { X } from 'lucide-react';

function PlaylistPage({ currentPlaylistId, onSelectPlaylist, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold">Playlists</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <p className="mb-4 text-sm text-muted-foreground">Escolha uma playlist para navegar ou pular músicas.</p>

          <div className="max-h-72 overflow-y-auto">
            <div className="grid gap-3">
              {mockPlaylists.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPlaylist(p.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 ${p.id === currentPlaylistId ? 'bg-gray-100 ring-1 ring-primary/30' : ''}`}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {p.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-sm text-muted-foreground">id: {p.id}</div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Selecionar</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistPage;
