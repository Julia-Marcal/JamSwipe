import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { ArrowLeft, Heart, X } from 'lucide-react';

function History({ token, onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/history', {
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        console.error('Erro ao buscar histórico');
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
          <h1 className="text-3xl font-bold text-white">Histórico</h1>
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
          <div className="grid gap-4 md:grid-cols-2">
            {history.map((item) => (
              <Card key={item._id} className="shadow-xl overflow-hidden">
                <div className="flex">
                  <img
                    src={item.music.albumCover}
                    alt={item.music.title}
                    className="w-24 h-24 object-cover"
                  />
                  <CardContent className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{item.music.title}</h3>
                      <p className="text-muted-foreground">{item.music.artist}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {item.liked ? (
                        <div className="flex items-center gap-1 text-green-500">
                          <Heart className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">Curtiu</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-500">
                          <X className="w-4 h-4" />
                          <span className="text-sm font-medium">Não curtiu</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;

