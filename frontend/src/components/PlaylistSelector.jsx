import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const mockPlaylists = [
  { id: 'random', name: 'Descoberta' },
  { id: 'liked', name: 'Curtidas' },
];

function PlaylistSelector({ currentPlaylistId, onSelectPlaylist }) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, mockPlaylists.findIndex(p => p.id === currentPlaylistId))
  );

  const currentPlaylist = mockPlaylists[currentIndex] ?? mockPlaylists[0];

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % mockPlaylists.length;
    setCurrentIndex(nextIndex);
    onSelectPlaylist(mockPlaylists[nextIndex].id);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + mockPlaylists.length) % mockPlaylists.length;
    setCurrentIndex(prevIndex);
    onSelectPlaylist(mockPlaylists[prevIndex].id);
  };

  return (
    <div className="flex items-center justify-center gap-4 p-3 bg-white/6 rounded-xl shadow-sm backdrop-blur-sm max-w-md mx-auto">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrev}
        className="text-white hover:bg-white/10"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="text-center flex-1">
        <p className="text-xs font-light text-white/80">Playlist Atual</p>
        <h2 className="text-lg font-semibold text-white truncate">{currentPlaylist.name}</h2>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        className="text-white hover:bg-white/10"
        aria-label="Próxima"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

export default PlaylistSelector;
