import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Heart, X, Play, Pause, History as HistoryIcon, LogOut, ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import PlaylistSelector, { mockPlaylists } from './PlaylistSelector.jsx';

function SwipeCard({ token, onLogout, onViewHistory }) {
  const defaultPlaylistId = mockPlaylists[0].id;
  const [currentPlaylistId, setCurrentPlaylistId] = useState(defaultPlaylistId);
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  useEffect(() => {
    fetchRandomMusic(defaultPlaylistId);
  }, []);

  useEffect(() => {
    if (music && music.previewUrl && audioRef.current) {
      // Inicia a reprodução automaticamente (TC-001)
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          // Autoplay nem sempre é permitido pelo navegador sem interação do usuário.
          // Registrar em debug para não poluir o console com erros que são esperados.
          console.debug('Autoplay bloqueado ou não permitido:', error?.name || error);
          // Se a reprodução automática falhar (restrições do navegador), mantém isPlaying como false
          setIsPlaying(false);
        });
    }
  }, [music]);

  const fetchRandomMusic = useCallback(async (playlistId) => {
    const playlist = mockPlaylists.find(p => p.id === playlistId);
    if (!playlist) return;

    setLoading(true);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reinicia o áudio ao buscar nova música
    }

    try {
      let data;
      if (playlistId === 'liked') {
        // Lógica para playlist "Curtidas"
        const historyResponse = await fetch('http://localhost:5000/api/history', {
          headers: {
            'x-auth-token': token,
          },
          // Evita que o browser envie If-None-Match / receba 304 sem corpo
          cache: 'no-store',
        });

        if (historyResponse.ok) {
          const contentType = historyResponse.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const historyData = await historyResponse.json();
            const likedSongs = historyData.filter(item => item.liked && item.music).map(item => item.music);
            console.debug('SwipeCard: likedSongs count =', likedSongs.length);
            if (likedSongs.length > 0) {
              // Seleciona uma música aleatória das curtidas
              data = likedSongs[Math.floor(Math.random() * likedSongs.length)];
            }
          } else if (historyResponse.status === 304) {
            // Não deveria ocorrer com cache: 'no-store', mas caso ocorra, deixa data indefinido
            console.debug('SwipeCard: history endpoint retornou 304 Not Modified');
          } else {
            console.warn('SwipeCard: resposta de histórico sem JSON');
          }
        }
      } else {
        // Lógica para playlists normais (random)
        const response = await fetch('http://localhost:5000/api/music/random', {
          headers: {
            'x-auth-token': token,
          },
        });

        if (response.ok) {
          data = await response.json();
        } else {
          console.error('Erro ao buscar música');
        }
      }

      if (data) {
        setMusic(data);
      } else {
        setMusic(null); // Nenhuma música disponível na playlist
      }
    } catch (err) {
      console.error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRandomMusic(currentPlaylistId);
  }, [currentPlaylistId, fetchRandomMusic]);

  const handleSelectPlaylist = (playlistId) => {
    setCurrentPlaylistId(playlistId);
  };

  // NOTE: fetchRandomMusic foi implementado acima (useCallback) e já trata playlists "liked" e normais.
  // Removida a declaração duplicada para evitar sobrescrita e erros de redefinição.

  const handleSwipe = async (liked) => {
    if (!music) return;

    try {
      await fetch('http://localhost:5000/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          musicId: music._id,
          liked,
        }),
      });

      fetchRandomMusic(currentPlaylistId);
    } catch (err) {
      console.error('Erro ao registrar interação');
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        // Interrupção manual da reprodução (TC-002)
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      const liked = info.offset.x > 0;
      handleSwipe(liked);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="text-white text-2xl">Carregando...</div>
      </div>
    );
  }

  if (!music) {
    const playlistName = mockPlaylists.find(p => p.id === currentPlaylistId)?.name || 'Playlist';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={onViewHistory}
            className="shadow-lg"
          >
            <HistoryIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={onLogout}
            className="shadow-lg"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
        <PlaylistSelector
          currentPlaylistId={currentPlaylistId}
          onSelectPlaylist={handleSelectPlaylist}
        />
        <div className="text-white text-2xl mt-8">Nenhuma música disponível em "{playlistName}"</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={onViewHistory}
          className="shadow-lg"
        >
          <HistoryIcon className="w-5 h-5" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={onLogout}
          className="shadow-lg"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <div className="mb-4">
        <PlaylistSelector
          currentPlaylistId={currentPlaylistId}
          onSelectPlaylist={handleSelectPlaylist}
        />
      </div>

      <motion.div
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="cursor-grab active:cursor-grabbing"
      >
        <Card className="w-80 sm:w-96 shadow-2xl overflow-hidden">
          <div className="relative">
            <img
              src={music.albumCover}
              alt={music.title}
              className="w-full h-80 object-cover"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-4 right-4 rounded-full w-16 h-16 shadow-lg"
              onClick={togglePlayPause}
              disabled={!music || !music.previewUrl} // Desabilita se não houver preview
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </Button>
          </div>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{music.title}</h2>
            <p className="text-muted-foreground text-lg">{music.artist}</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex gap-4 mt-8">
        <Button
          variant="destructive"
          size="icon"
          className="w-16 h-16 rounded-full shadow-lg"
          onClick={() => handleSwipe(false)}
          aria-label="Descartar"
          title="Descartar"
        >
          <X className="w-8 h-8" />
        </Button>

        {/* Se a playlist atual for 'random' (Descoberta) permitimos curtir; caso contrário
            mostramos uma seta para pular para a próxima música sem registrar curtida. */}
        {currentPlaylistId === 'random' ? (
          <Button
            variant="default"
            size="icon"
            className="w-16 h-16 rounded-full shadow-lg bg-green-500 hover:bg-green-600"
            onClick={() => handleSwipe(true)}
            aria-label="Curtir"
            title="Curtir"
          >
            <Heart className="w-8 h-8" />
          </Button>
        ) : (
          <Button
            variant="default"
            size="icon"
            className="w-16 h-16 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600"
            onClick={() => fetchRandomMusic(currentPlaylistId)}
            aria-label="Pular"
            title="Pular"
          >
            <ArrowRight className="w-8 h-8" />
          </Button>
        )}
      </div>

      <audio ref={audioRef} src={music.previewUrl} />
    </div>
  );
}

export default SwipeCard;

