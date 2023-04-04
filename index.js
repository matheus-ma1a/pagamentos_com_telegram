"use strict";
require('dotenv').config()
const https = require('https')
const axios = require('axios')
const fs = require('fs')


const getToken = async () => {

  //Insira o caminho de seu certificado .p12 dentro de seu projeto
  let certificado = fs.readFileSync(process.env.CERTIFICADO_HOMO);

  //Insira os valores de suas credenciais em desenvolvimento do pix
  let credenciais = {
    client_id: process.env.CLIENT_ID_HOMO,
    client_secret: process.env.CHAVE_SECRET_HOMO,
  };

  let data = JSON.stringify({ grant_type: "client_credentials" });
  let data_credentials = credenciais.client_id + ":" + credenciais.client_secret;

  // Codificando as credenciais em base64
  let auth = Buffer.from(data_credentials).toString("base64");

  const agent = new https.Agent({
    pfx: certificado,
    passphrase: "",
  });
  //Consumo em desenvolvimento da rota post oauth/token
  let config = {
    method: "POST",
    url: "https://api-pix-h.gerencianet.com.br/oauth/token",
    headers: {
      Authorization: "Basic " + auth,
      "Content-Type": "application/json",
    },
    httpsAgent: agent,
    data: data,
  };

  const response = await axios(config)

  return response.data

}

const gerarCobranca = async (accessToken,dadosDaCobranca)=>{

  //Insira o caminho de seu certificado .p12 dentro de seu projeto
  let certificado = fs.readFileSync(process.env.CERTIFICADO_HOMO);
  
  let data = JSON.stringify(dadosDaCobranca);


  const agent = new https.Agent({
    pfx: certificado,
    passphrase: "",
  });
  //Consumo em desenvolvimento da rota post oauth/token
  let config = {
    method: "POST",
    url: "https://api-pix-h.gerencianet.com.br/v2/cob",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    httpsAgent: agent,
    data: data,
  };

  const response = await axios(config)
  return response.data

}

const run = async ()=>{
  const token = await getToken()
  const accessToken = token.access_token

  const cob = { 
    calendario: {
      expiracao: 36000
    },
    devedor:{
      cpf: '12345678909',
      nome: 'matheus maia'
    },
    valor: {
      original: '35.80'
    },
    chave: 'aaa',
   }
   const cobranca = await gerarCobranca( accessToken , cob)
   console.log(cobranca)
}

run()