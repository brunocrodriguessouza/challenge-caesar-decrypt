import React, { useState } from 'react';

import axios from 'axios';
import sha1 from 'js-sha1';

const TOKEN = "3fbee28411eeb76b99840247b4537c19c47ab5c1";
const BASE_URL = "https://api.codenation.dev/v1/challenge/dev-ps";

const App = () => {

  const [file, setFile] = useState();

  const getChallenge = () => {
    const data = axios.get(`${BASE_URL}/generate-data?token=${TOKEN}`);
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

  const getCookie = () => {
    const cookie = document.cookie;
    const indexOfCookie = cookie.indexOf("_cesar-algorithm");
    if (indexOfCookie === -1) {
      var now = new Date();
      var time = now.getTime();
      var expireTime = time + 10000;
      now.setTime(expireTime);
      document.cookie = '_cesar-algorithm=ok;expires=' + now.toGMTString() + ';path=/';
      return true;
    } else {
      return false;
    }
  }

  const sendResponse = () => {
    const data = new FormData()
    var objectFile = new File([file], "answer.json", { type: "text/plain" })
    data.append('answer', objectFile);
    if (!getCookie()) {
      axios.post(`${BASE_URL}/submit-solution?token=${TOKEN}`,
        data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).then(res => {
        getCookie();
        console.log('Arquivo enviado com sucesso!');
      })
    }
  }

  const geraSha1 = string => sha1(string);

  const saveResponse = (challengeCesar) => {
    setFile(JSON.stringify(challengeCesar, null, 2));
  };

  const renderChallenge = () => {
    getChallenge().then(challenge => {
      const { cifrado, numero_casas } = challenge.data;

      challenge.data.decifrado = decrypt(cifrado, numero_casas);
      challenge.data.resumo_criptografico = geraSha1(challenge.data.decifrado);

      saveResponse(challenge.data);
      challenge.data.resumo_criptografico && sendResponse();
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