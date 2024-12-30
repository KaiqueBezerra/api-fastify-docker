Antes de continuar, garanta que o Docker está instalado

1. Apague o .example do arquivo .env.example

2. Rode o comando - npx prisma generate

3. Rode o comando - docker-compose up --build

4. Rode o comando - docker-compose exec api npx prisma migrate dev

O projeto já deve estar pronto para uso.

- Caso queira fazer alterações no código, siga os passos abaixo após fazer os passos anteriores:

1. Rode o comando - npm install

2. Após ter feito todas as alterações, no terminal linux rode o comando - chmod +x update.sh para dar permissão de execução do script

3. Rode o comando - ./update.sh - isso vai parar os containers, remover as imagens antigas, rebuildar imagens e subir os containers novamente

4. Caso o schma.prisma seja alterado, após executar o arquivo update.sh, rode o seguinte comando para atualizar o banco - docker-compose exec api npx prisma migrate dev

5. Caso queira visualizar o banco, rode o seguinte comando - docker-compose exec api npx prisma studio

- Caso queira testar outro banco local sem ser o do docker, descomente o datasource db do arquivo schema.prisma e comente o atual.
- Rode o seguinte comando para rodar o banco de dados - npx prisma migrate dev
- Depois rode o seguinte comando para rodar o servidor - npm run dev
