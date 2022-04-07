import { useState } from 'react';
import { FaSearchLocation } from 'react-icons/fa';
import './styles.css';
import api from './Services/api.js';

function App() {

  const[input, setInput] = useState('');
  const[cep, setCep] = useState({});

  async function handleSearch(){
    
    while(input === ''){
      alert("CEP em branco!")
      return;
    }

    try{
      const response = await api.get(`${input}/json`);
      setCep(response.data)
      setInput("");

    }catch{
      alert("CEP inválido!");
      setInput("")
    }

  }

  return (
    <div className="container">
      <h1 className='title'>Buscador CEP</h1>
      
      <div className="containerInput">
        <input type="text" 
        placeholder="Insira o CEP para pesquisa" 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        />
        <button className="buttonSearch" onClick={handleSearch}>
          <FaSearchLocation size={20} color="#000"/>
        </button>
      </div>


      {Object.keys(cep).length > 0 && (
        <main className='main'>
          <h2>{cep.logradouro}</h2>
          {Object.keys(cep.complemento).length > 0 && (
          <span className='compl'>{cep.complemento}</span>)}
          <div className='underBar'>
            <span className='bairro'>{cep.bairro}</span>
            <span className='city'>{cep.localidade} - {cep.uf}</span>
            <span className='sep'>CEP: {cep.cep}</span>
          </div>
        </main>
      )}

    </div>
  );
}

export default App;
