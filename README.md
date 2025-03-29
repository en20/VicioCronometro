# Cronômetro Vicio


Cronômetro Vício é uma aplicação web para ajudar estudantes a gerenciar e acompanhar seu tempo de estudo. Com uma interface moderna e intuitiva, permite cronometrar sessões, categorizá-las por disciplina e tópico, e visualizar estatísticas detalhadas do seu progresso.

## Instalação


Use o gerenciador de pacotes npm ou yarn para instalar o Cronômetro Vicio.

```bash
# Clone o repositório
git clone https://github.com/en20/VicioCronometro.git

# Navegue até o diretório
cd VicioCronometro

# Instale as dependências
npm install
# ou
yarn installx
```

## Usage

```bash
# Executar em modo de desenvolvimento
npm run dev
# ou
yarn dev

# Construir para produção
npm run build
# ou
yarn build

# Iniciar versão de produção
npm start
# ou
yarn start
```
O aplicativo estará acessível em http://localhost:3000

## Funcionalidades

```bash
// Cronometrar seu tempo de estudo
startTimer(); // Inicia o cronômetro
pauseTimer(); // Pausa o cronômetro
resetTimer(); // Zera o cronômetro

// Categorizar por disciplina e tópico
setDiscipline('Matemática');
setTopic('Cálculo');

// Salvar sessões de estudo
saveStudySession({
  discipline: 'Matemática',
  topic: 'Cálculo',
  duration: 3600, // em segundos
  date: '2025-03-28'
});

// Visualizar estatísticas detalhadas
viewTopDisciplines();
viewTopTopics();
viewProgressCharts();
```
## Componentes Principais
## Timer
O componente central do aplicativo que gerencia o cronômetro e permite:
- **Selecionar disciplinas e tópicos**
- **Iniciar, pausar e resetar o cronômetro**
- **Salvar sessões de estudo concluídas**
- **Validar entradas do usuário com feedback visual**
## Board
Exibe estatísticas de estudo em um formato visual atraente:
- **Lista de disciplinas mais estudadas**
- **Lista de tópicos mais estudados**
- **Gráficos interativos de progresso**
## Navbar
Barra de navegação responsiva com:
- **Navegação entre as páginas do aplicativo**
- **Menu mobile com animação suave**
- **Links para recursos externos**
## SaveSessionModal
Modal para confirmar o salvamento de uma sessão de estudo:
- **Exibe detalhes da sessão para confirmação**
- **Interface animada e intuitiva**
- **Validação de dados antes do salvamento**
## Escolhas Técnicas

- **Next.js**: Framework React para renderização do lado do servidor, otimização de SEO e rotas simplificadas.
- **TypeScript**: Tipagem estática para reduzir erros e melhorar a manutenibilidade do código
Gerenciamento de Estado.
- **Redux Toolkit**: Gerenciamento centralizado de estado com configuração simplificada
- **Redux Persist**: Persistência de estado para manter dados entre sessões
Estilização.
- **TailwindCSS**: Framework CSS utilitário para desenvolvimento rápido e consistente
Poppins (Google Fonts): Tipografia moderna e legível em toda a aplicação
Animações.
- **Framer Motion**: Biblioteca de animações para React que cria uma experiência de usuário fluida e agradável
Armazenamento.
- **localStorage**: Armazenamento local dos dados de estudo para persistência sem necessidade de backend.
## Estrutura do Projeto
```bash
my-app/
├── app/               # Diretório principal do Next.js 13+ (App Router)
│   ├── components/    # Componentes reutilizáveis
│   │   ├── Board.tsx          # Exibe estatísticas de estudo
│   │   ├── Navbar.tsx         # Barra de navegação
│   │   ├── SaveSessionModal.tsx # Modal de salvamento
│   │   ├── StudyCharts.tsx    # Visualizações gráficas
│   │   └── Timer.tsx          # Componente principal do cronômetro
│   ├── store/         # Configuração e slices do Redux
│   │   ├── hooks.ts           # Hooks personalizados do Redux
│   │   ├── store.ts           # Configuração do store
│   │   └── timerSlice.ts      # Slice para o cronômetro
│   ├── about/         # Página de informações sobre o app
│   ├── globals.css    # Estilos globais
│   ├── layout.tsx     # Layout compartilhado
│   ├── page.tsx       # Página inicial
│   └── providers.tsx  # Provedores de contexto (Redux)
├── public/            # Arquivos estáticos
├── tailwind.config.js # Configuração do Tailwind
└── package.json       # Dependências e scripts
```


## License

[MIT](https://choosealicense.com/licenses/mit/)

**Enzo Lozano Abreu**# VicioCronometro
