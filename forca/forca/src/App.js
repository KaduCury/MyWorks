//incluir um botão para começar o jogo/recomeçar após o jogo acabar
//incluir funcionalidade de escolher o número de letras da palavra para adivinhar
//ainda tem bugs referentes a acentos gráficos e cedílha
//melhorar a responsividade em smartphones
//incluir o uso do teclado nativo em smartphones
//incluir imagens da forca conforme vai errando
//incluir contador de visitas na página

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const API_URL = 'https://api.dicionario-aberto.net/random';

const App = () => {
  const [word, setWord] = useState('');
  const [hiddenWord, setHiddenWord] = useState('');
  const [tries, setTries] = useState(6);
  const [usedLetters, setUsedLetters] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        const randomWord = res.data.word.toLowerCase();
        setWord(randomWord);
        setHiddenWord(randomWord.replace(/[^\W\d_]/gu, '_ '));
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const storedRanking = localStorage.getItem('ranking');
    if (storedRanking) {
      setRanking(JSON.parse(storedRanking));
    }
  }, []);

  const handleGuess = (letter) => {
    if (tries <= 0) {
      return; // não faz nada se não tiver mais tentativas
    }

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
          const name = prompt('Parabéns! Você acertou! A palavra era "' + word + '". Insira seu nome no ranking:');
          const newRanking = [...ranking, { name: name, tries: 6 - tries }];
          newRanking.sort((a, b) => a.tries - b.tries);
          setRanking(newRanking);
          localStorage.setItem('ranking', JSON.stringify(newRanking));
        }
      } else {
        setTries(tries - 1);
        if (tries === 1) {
          alert(`Você perdeu! A palavra era "${word}".`);
        }
      }
    }
  };

  const handleKeyDown = (event) => {
    const keyCode = event.keyCode;
    if (keyCode >= 65 && keyCode <= 90) {
    const letter = event.key.toLowerCase();
    handleGuess(letter);
    }
  };

  const handleTouch = (event) => {
    event.preventDefault();
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const guessArea = document.getElementById('guesses').getBoundingClientRect();
    if (touchX >= guessArea.left && touchX <= guessArea.right && touchY >= guessArea.top && touchY <= guessArea.bottom) {
      const letters = document.querySelectorAll('#guesses button');
      letters.forEach((letter) => {
        const letterArea = letter.getBoundingClientRect();
        if (touchX >= letterArea.left && touchX <= letterArea.right && touchY >= letterArea.top && touchY <= letterArea.bottom) {
          const chosenLetter = letter.innerHTML.toLowerCase();
          handleGuess(chosenLetter);
        }
      });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouch);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch);
    };
  });

  return (
    <div>
      <h1>Jogo da Forca</h1>
      <p id="word">{hiddenWord}</p>
      <p>Você tem {tries} tentativas restantes.</p>
      <p>Letras já utilizadas: {usedLetters.join(', ')}</p>
      {tries > 0 && hiddenWord.includes('_') && (
        <div id="guesses">
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
      <h2>Ranking</h2>
      <table>
        <thead>
          <tr>
            <th>Posição</th>
            <th>Nome</th>
            <th>Tentativas</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.tries}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
