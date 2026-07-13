# tigrinhos-render

Projeto de demonstração Fake Cassino com login simples e Pix fixo.

## Instalação local

1. Instale dependências:
   ```bash
   npm install
   ```
2. Execute o servidor:
   ```bash
   npm start
   ```
3. Abra `http://localhost:3000`

## Funcionalidade

- `POST /api/login` devolve `token` fixo e saldo do usuário
- `POST /api/depositar` aceita qualquer depósito e grava em `/var/log/pix.log`
- Frontend copia automaticamente a chave Pix fixa para a área de transferência

## Checklist de deploy completo

1. Registrar domínio e configurar DNS
   - Criar registro A para `@` apontando para o IP do servidor

2. Criar servidor real na AWS Lightsail
   - Ubuntu 24.04
   - Instalar Node.js e dependências
   - Clonar este repositório

3. Configurar Nginx e HTTPS
   - Criar arquivo de site em `/etc/nginx/sites-available/`
   - Redirecionar HTTP para HTTPS
   - Usar `certbot --nginx` para gerar o certificado

4. Configurar processo com PM2
   - `sudo npm i -g pm2`
   - `pm2 start server.js --name casino`
   - `pm2 save`
   - `pm2 startup`

5. Verificar
   - Acesse `https://SEU_DOMINIO`
   - Digite qualquer ID e faça um depósito
   - Confira `/var/log/pix.log`
