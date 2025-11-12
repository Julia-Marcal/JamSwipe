import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { ArrowLeft, Heart, X } from 'lucide-react';

function History({ token, onBack }) {
  const [viewMode, setViewMode] = useState('liked'); // 'history' ou 'liked'
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    // A API de histórico atual retorna todas as interações (curtidas e descartadas).
    // Para o requisito de "músicas curtidas", vamos filtrar no frontend por enquanto.
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/history', {
        headers: {
          'x-auth-token': token,
        },
        // Evita que o browser envie If-None-Match / use cache e receba 304 sem corpo
        // Isso faz o fetch sempre buscar uma versão atual do servidor.
        cache: 'no-store',
      });

      if (response.status === 304) {
        // Not modified: manter o estado atual (não sobrescrever) e encerrar
        console.log('Histórico não modificado (304). Mantendo dados em cache.');
      } else if (response.ok) {
        // Só tenta parsear JSON se o Content-Type indicar JSON
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          setHistory(data);
        } else {
          console.warn('Resposta de histórico sem JSON.');
          setHistory([]);
        }
      } else {
        console.error('Erro ao buscar histórico', response.status);
      }
    } catch (err) {
      console.error('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="text-white text-2xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="secondary"
            size="icon"
            onClick={onBack}
            className="shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Músicas Curtidas</h1>
        </div>

        {history.length === 0 ? (
          <Card className="shadow-xl">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground text-lg">
                Você ainda não interagiu com nenhuma música.
              </p>
            </CardContent>
          </Card>
        ) : (
          <LikedMusicList history={history} />
        )}
      </div>
    </div>
  );
}

function LikedMusicList({ history }) {
  // Filtra apenas interações com música válida para evitar erros quando `music` for null
  const likedMusic = useMemo(() => {
    return history
      .filter((item) => item.liked && item.music)
      .map((item) => item.music);
  }, [history]);

  if (likedMusic.length === 0) {
    return (
      <Card className="shadow-xl">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground text-lg">
            Você ainda não curtiu nenhuma música.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {likedMusic.map((music, idx) => (
        <Card key={music?._id ?? `liked-${idx}`} className="shadow-xl overflow-hidden">
          <div className="flex">
            {music?.albumCover ? (
              <img
                src={music.albumCover}
                alt={music.title ?? 'Capa'}
                className="w-24 h-24 object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Sem capa</span>
              </div>
            )}
            <CardContent className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg">{music?.title ?? 'Título desconhecido'}</h3>
                <p className="text-muted-foreground">{music?.artist ?? 'Artista desconhecido'}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-green-500">
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">Curtiu</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default History;


