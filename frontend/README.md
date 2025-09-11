<div align="center">
  <img src="./src/assets/hero-vs2.png" alt="HabitHero Screenshot" width="800"/>
  <h1>HabitHero</h1>
  <p><strong>Transforme seus hábitos em uma aventura épica de RPG!</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  </p>
</div>

---

## 🏰 Sobre o Projeto

Este repositório demonstra a construção de uma aplicação full-stack completa, interativa e focada na experiência do usuário, utilizando um frontend moderno com React e um backend seguro e escalável com Node.js.

Esqueça as listas de tarefas monótonas. O **HabitHero** nasceu da ideia de que o autodesenvolvimento não precisa ser chato. Este projeto reimagina a construção de hábitos como uma aventura épica, onde cada objetivo se torna uma missão e cada dia de progresso é uma vitória.

Ao aplicar conceitos de gamificação, a aplicação busca resolver o problema da falta de motivação, transformando o processo de criar rotinas positivas em uma experiência divertida e recompensadora. O usuário não apenas marca uma tarefa como concluída, mas ganha XP, sobe de nível e enfrenta "chefões" que representam obstáculos da vida real, como a Procrastinação.

---

## ✨ Funcionalidades Principais

- **📜 Sistema de Missões Flexível:** Crie hábitos simples de um dia ou missões épicas de múltiplos dias.
- **⚔️ Gamificação Completa:** Ganhe XP, suba de nível, enfrente chefes e abra baús de recompensa.
- **🏆 Conquistas e Missões Diárias:** Desbloqueie medalhas e complete tarefas diárias para ganhar bônus.
- **🎨 Painel Interativo:** Acompanhe seu progresso com um mascote que reage às suas ações e um mapa de jornada visual.
- **🔐 Autenticação Segura:** Sistema completo de registro, login e recuperação de senha com JWT.
- **🦸 Perfil do Herói:** Personalize seu avatar, nome e visualize estatísticas detalhadas do seu progresso.

---

## 🚀 Tecnologias Utilizadas

<table width="100%">
  <tr>
    <td valign="top" width="50%">
      <h4 align="center">Frontend</h4>
      <ul>
        <li><strong>Framework:</strong> React</li>
        <li><strong>Linguagem:</strong> TypeScript</li>
        <li><strong>Estilização:</strong> Tailwind CSS</li>
        <li><strong>Animações:</strong> Framer Motion</li>
        <li><strong>Notificações:</strong> React Hot Toast</li>
        <li><strong>Ícones:</strong> Lucide React</li>
      </ul>
    </td>
    <td valign="top" width="50%">
      <h4 align="center">Backend</h4>
      <ul>
        <li><strong>Ambiente:</strong> Node.js</li>
        <li><strong>Framework:</strong> Express</li>
        <li><strong>Linguagem:</strong> TypeScript</li>
        <li><strong>ORM:</strong> Sequelize</li>
        <li><strong>Banco de Dados:</strong> PostgreSQL</li>
        <li><strong>Autenticação:</strong> JSON Web Tokens (JWT)</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🧠 Desafios e Aprendizados

Desenvolver o HabitHero foi uma jornada repleta de desafios técnicos e aprendizados valiosos. Alguns dos principais foram:

- **Gerenciamento de Estado Complexo:** A lógica de gamificação (XP, níveis, chefes, streaks) exigiu um gerenciamento de estado cuidadoso no frontend. A utilização de hooks customizados (`useGamification`, `useDashboardState`) e do Context API foi crucial para manter o código organizado e evitar inconsistências.

- **Sincronização Otimista (Optimistic UI):** Implementar atualizações que refletem imediatamente na interface do usuário (como completar uma missão) e depois sincronizam com o backend, com uma lógica de reversão em caso de falha, foi um desafio interessante para garantir uma experiência de usuário fluida e responsiva.

- **Estrutura do Backend e ORM:** Definir as associações corretas entre os modelos (`User`, `Habit`, `HabitLog`) com o Sequelize foi um ponto de aprendizado importante para garantir a integridade dos dados e a eficiência das consultas, especialmente ao lidar com eager loading (`include`).

- **Animações com Framer Motion:** Criar animações performáticas e visualmente agradáveis, como a barra de progresso, o pulo do mascote e as transições de página, exigiu um estudo aprofundado da biblioteca Framer Motion para criar uma interface mais viva e engajadora.

---

## ⚙️ Como Executar o Projeto

Para rodar o HabitHero em sua máquina local, siga os passos abaixo.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/download/)

### 1. Backend

```bash
# 1. Clone o repositório
git clone https://github.com/AnnyKaah/HabitHero.git
cd HabitHero/backend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
#    - Renomeie o arquivo .env.example para .env
#    - Preencha com a URL do seu banco de dados e um segredo para o JWT

# 4. Popule o banco de dados com dados iniciais (conquistas, missões, etc.)
npm run db:seed

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

O servidor backend estará rodando em `http://localhost:5000`.

### 2. Frontend

```bash
# Em um novo terminal, navegue até a pasta do frontend
cd ../frontend

# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará acessível em `http://localhost:5173`.
