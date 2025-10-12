import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Heart, X, Play, Pause, History as HistoryIcon, LogOut } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

function SwipeCard({ token, onLogout, onViewHistory }) {
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  useEffect(() => {
    fetchRandomMusic();
  }, []);

  const fetchRandomMusic = async () => {
    setLoading(true);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      const response = await fetch('http://localhost:5000/api/music/random', {
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMusic(data);
      } else {
        console.error('Erro ao buscar música');
      }
    } catch (err) {
      console.error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

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

      fetchRandomMusic();
    } catch (err) {
      console.error('Erro ao registrar interação');
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="text-white text-2xl">Nenhuma música disponível</div>
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
        >
          <X className="w-8 h-8" />
        </Button>
        <Button
          variant="default"
          size="icon"
          className="w-16 h-16 rounded-full shadow-lg bg-green-500 hover:bg-green-600"
          onClick={() => handleSwipe(true)}
        >
          <Heart className="w-8 h-8" />
        </Button>
      </div>

      <audio ref={audioRef} src={music.previewUrl} />
    </div>
  );
}

export default SwipeCard;

