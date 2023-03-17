import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://api.dicionario-aberto.net/random';

const App = () => {
  const [word, setWord] = useState('');
  const [hiddenWord, setHiddenWord] = useState('');
  const [tries, setTries] = useState(6);
  const [usedLetters, setUsedLetters] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        const randomWord = res.data.word.toLowerCase();
        setWord(randomWord);
        setHiddenWord(randomWord.replace(/[a-z]/gi, '_ '));
      })
      .catch(err => console.log(err));
  }, []);

  const handleGuess = (letter) => {
    if (usedLetters.includes(letter)) {
      alert('Essa letra já foi utilizada, tente outra!');
    } else {
      const newUsedLetters = [...usedLetters, letter];
      setUsedLetters(newUsedLetters);
      if (word.includes(letter)) {
        let newHiddenWord = '';
        for (let i = 0; i < word.length; i++) {
          if (word[i] === letter) {
            newHiddenWord += letter + ' ';
          } else {
            newHiddenWord += hiddenWord[i * 2] + ' ';
          }
        }
        setHiddenWord(newHiddenWord);
        if (!newHiddenWord.includes('_')) {
          alert(`Parabéns! Você acertou! A palavra era "${word}".`);
        }
      } else {
        setTries(tries - 1);
        if (tries === 1) {
          alert(`Você perdeu! A palavra era "${word}".`);
        }
      }
    }
  };

  return (
    <div>
      <h1>Jogo da Forca</h1>
      <p>{hiddenWord}</p>
      <p>Você tem {tries} tentativas restantes.</p>
      <p>Letras já utilizadas: {usedLetters.join(', ')}</p>
      {tries > 0 && hiddenWord.includes('_') && (
        <div>
          <p>Chute uma letra:</p>
          {[...Array(26)].map((_, i) => {
            const letter = String.fromCharCode(97 + i);
            return (
              <button key={i} onClick={() => handleGuess(letter)} disabled={!hiddenWord.includes('_')}>
                {letter}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
