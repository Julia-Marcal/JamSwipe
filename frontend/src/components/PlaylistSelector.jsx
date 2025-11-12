import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const mockPlaylists = [
  { id: 'random', name: 'Descoberta' },
  { id: 'liked', name: 'Curtidas' },
];

function PlaylistSelector({ currentPlaylistId, onSelectPlaylist }) {
  const [currentIndex, setCurrentIndex] = useState(
    mockPlaylists.findIndex(p => p.id === currentPlaylistId)
  );

  const currentPlaylist = mockPlaylists[currentIndex];

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
    <div className="flex items-center justify-center gap-4 p-4 bg-white/10 rounded-xl shadow-xl backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrev}
        className="text-white hover:bg-white/20"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <div className="text-center">
        <p className="text-sm font-light text-white/80">Playlist Atual:</p>
        <h2 className="text-xl font-bold text-white">{currentPlaylist.name}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        className="text-white hover:bg-white/20"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
}

export default PlaylistSelector;
