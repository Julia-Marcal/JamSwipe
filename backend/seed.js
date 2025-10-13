require('dotenv').config();
const mongoose = require('mongoose');
const Music = require('./models/Music');

const sampleMusics = [
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumCover: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    albumCover: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    title: 'Dance Monkey',
    artist: 'Tones and I',
    albumCover: 'https://upload.wikimedia.org/wikipedia/en/f/f5/Tones_and_I_-_Dance_Monkey.png',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    albumCover: 'https://upload.wikimedia.org/wikipedia/en/4/47/Billie_Eilish_-_Bad_Guy.png',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    albumCover: 'https://upload.wikimedia.org/wikipedia/en/0/0f/Mark_Ronson_feat._Bruno_Mars_-_Uptown_Funk_%28Official_Single_Cover%29.png',
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
];

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/jamswipe';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', uri);

  await Music.deleteMany({});
  await Music.insertMany(sampleMusics);
  console.log('Inserted sample musics');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding error', err);
  process.exit(1);
});
