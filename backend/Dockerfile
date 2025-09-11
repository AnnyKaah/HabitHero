# Dockerfile para o backend do HabitHero (Node.js/TypeScript)

# --- Estágio 1: Build ---
# Usamos uma imagem Node completa para ter acesso ao TypeScript e outras devDependencies.
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de manifesto de pacotes
COPY package.json package-lock.json ./

# Instala TODAS as dependências, incluindo as de desenvolvimento para compilar o TS
RUN npm install

# Copia o restante do código-fonte da aplicação
COPY . .

# Compila o código TypeScript para JavaScript
RUN npm run build

# --- Estágio 2: Produção ---
# Usamos uma imagem Node "slim" para a versão final, que é menor e mais segura.
FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de manifesto novamente
COPY package.json package-lock.json ./

# Instala APENAS as dependências de produção
RUN npm install --omit=dev

# Copia o código compilado do estágio de 'build' para a imagem final
COPY --from=builder /app/dist ./dist

# Expõe a porta em que a aplicação irá rodar
EXPOSE 5000

# Comando para iniciar a aplicação quando o contêiner for executado
CMD [ "node", "dist/server.js" ]