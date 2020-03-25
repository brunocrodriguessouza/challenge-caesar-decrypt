import React, { useState } from 'react';

import axios from 'axios';
import sha1 from 'js-sha1';

const TOKEN = "3fbee28411eeb76b99840247b4537c19c47ab5c1";
const BASE_URL = "https://api.codenation.dev/v1/challenge/dev-ps";

const App = () => {

  const [file, setFile] = useState();

  const getChallenge = async () => {
    const { data } = await axios.get(`${BASE_URL}/generate-data?token=${TOKEN}`);
    return data;
  }

  const decrypt = (str, num) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let newStr = '';

    str.toLowerCase().split('').forEach(letter => {
      const currentIndex = alphabet.indexOf(letter);
      const subtractedIndex = currentIndex - num;

      const newIndex = (subtractedIndex < 0)
        ? subtractedIndex + 26
        : subtractedIndex;

      newStr += (letter === ' ' || letter === '.')
        ? letter
        : alphabet[newIndex];
    });

    return newStr;
  }

  const sendReponse = async () => {
    const data = new FormData()
    var ObjFile = new File([file], "answer.json", { type: "text/plain" })
    data.append('answer', ObjFile);

    await axios.post("https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=3fbee28411eeb76b99840247b4537c19c47ab5c1",
      data, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(res => {
      console.log('Arquivo enviado com sucesso!');
    })
  }

  const geraSha1 = string => sha1(string);

  const saveReponse = (challengeCesar) => {
    setFile(JSON.stringify(challengeCesar, null, 2));
  };

  const renderChallenge = () => {
    getChallenge().then(challenge => {
      const { cifrado, numero_casas } = challenge;

      challenge.decifrado = decrypt(cifrado, numero_casas);
      challenge.resumo_criptografico = geraSha1(challenge.decifrado);

      saveReponse(challenge);
      challenge.resumo_criptografico && sendReponse();
    })
  }

  return (
    <div>
      <div>Ceaser Challenge</div>
      <div>{renderChallenge()}</div>
    </div>
  );
};

export default App;