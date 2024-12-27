# Use uma imagem base do Node.js
FROM node:22.0.0

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo de dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Compile o código TypeScript
RUN npm run build

# Exponha a porta usada pela aplicação
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start:prod"]
