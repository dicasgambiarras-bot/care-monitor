# 🏥 Care Monitor

> **Plataforma inteligente de monitoramento de pacientes com análise de IA**

Uma aplicação completa para gerenciamento de saúde de pacientes, oferecendo autenticação segura, rastreamento de métricas vitais, agendamento de compromissos, análises de IA e relatórios detalhados.

---

## ✨ Características

### 🔐 **Autenticação & Segurança**
- ✅ Autenticação segura com Firebase Auth
- ✅ Email/senha com validação de força
- ✅ Criação automática de perfil na primeira autenticação
- ✅ Suporte a emulador local para desenvolvimento

### 👥 **Gerenciamento de Pacientes**
- ✅ Perfil detalhado com histórico médico
- ✅ Gerenciamento de equipe de cuidadores
- ✅ Definição de contatos urgentes
- ✅ Sincronização em tempo real com Firestore

### 📊 **Monitoramento de Saúde**
- ✅ Rastreamento de métricas vitais (pressão arterial, glicose, temperatura, etc)
- ✅ Histórico de medições com timestamps
- ✅ Visualização em cards com design intuitivo
- ✅ Dados sincronizados em nuvem

### 📅 **Agendamento Inteligente**
- ✅ Múltiplos tipos de itens: medicamentos, consultas, cuidados
- ✅ Separação visual: "Hoje" vs "Próximos Dias"
- ✅ Marcar como concluído com checkbox
- ✅ Edição e exclusão de compromissos

### 📝 **Notas Diárias**
- ✅ Registro de observações por dia
- ✅ Auto-salvamento
- ✅ Feedback visual de confirmação

### 🤖 **Análise de IA (Gemini)**
- ✅ Resumo automático de saúde
- ✅ Detecção de alertas (crítico, aviso, info)
- ✅ Recomendações personalizadas
- ✅ Atualização em tempo real após nova métrica

### 📱 **Responsividade Mobile**
- ✅ Mobile-first design com Tailwind CSS
- ✅ Totalmente responsivo (320px a 2560px)
- ✅ Navegação intuitiva em telas pequenas
- ✅ Touch-friendly interface

### 📈 **Histórico & Relatórios**
- ✅ Timeline de eventos com ícones
- ✅ Filtro por tipo de evento
- ✅ Exportação de dados
- ✅ Visualização de tendências

---

## 🛠 **Stack Técnico**

| Tecnologia | Versão | Propósito |
|---|---|---|
| **React** | 19.2.0 | Framework UI |
| **TypeScript** | 5.7.2 | Type-safety |
| **Vite** | 6.2.0 | Build tool & dev server |
| **Tailwind CSS** | CDN | Styling responsivo |
| **Firebase Auth** | 12.6.0 | Autenticação |
| **Firebase Firestore** | 12.6.0 | Database realtime |
| **Google Gemini API** | v1 | Análise de IA |

---

## 📦 **Requisitos**

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Firebase Account** (ou emulador local)
- **Google Gemini API Key** (opcional para dev)

---

## 🚀 **Instalação & Setup**

### 1️⃣ **Clone e Instale**
```bash
git clone https://github.com/seu-usuario/care-monitor.git
cd care-monitor
npm install
```

### 2️⃣ **Configure Variáveis de Ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Gemini API (opcional, só precisa em produção)
VITE_GEMINI_API_KEY=sua_chave_aqui

# Firebase Emulator (desenvolvimento local)
VITE_USE_FIREBASE_EMULATOR=true
```

### 3️⃣ **Inicie o Firebase Emulator** (Terminal 1)
```bash
firebase emulators:start --only firestore,auth
```

> **Primeira vez?** Execute `firebase init emulators` e selecione Firestore e Auth

### 4️⃣ **Inicie o Dev Server** (Terminal 2)
```bash
npm run dev
```

Acesse em: **http://localhost:5173**

---

## 📂 **Estrutura do Projeto**

```
care-monitor/
├── src/
│   ├── App.tsx                 # Componente principal com roteamento
│   ├── types.ts               # Tipos TypeScript globais
│   ├── components/
│   │   ├── LoginPage.tsx       # Autenticação
│   │   ├── PatientProfilePage.tsx
│   │   ├── SchedulePage.tsx    # Agendamento
│   │   ├── HistoryPage.tsx     # Timeline de eventos
│   │   ├── MetricCard.tsx      # Card de métrica
│   │   ├── ScheduleCard.tsx    # Card de agendamento
│   │   ├── AlertCard.tsx       # Card de alerta IA
│   │   ├── DailyNotesCard.tsx  # Notas do dia
│   │   ├── AddMetricModal.tsx  # Modal de nova métrica
│   │   ├── AddScheduleItemModal.tsx
│   │   ├── EditProfileModal.tsx
│   │   ├── ManageTeamModal.tsx
│   │   ├── NavItem.tsx         # Item de navegação
│   │   ├── UrgentContactsBar.tsx
│   │   └── icons.tsx           # SVG icons customizados
│   ├── firebase/
│   │   └── config.ts           # Inicialização Firebase + emulador
│   ├── utils/
│   │   ├── dateUtils.ts        # Formatação de datas
│   │   └── analysisUtils.ts    # Análise Gemini
│   ├── index.tsx               # Entry point
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎮 **Como Usar**

### **Primeira Autenticação**
1. Abra a app: http://localhost:5173
2. Clique em "Criar Conta"
3. Email e senha
4. Perfil é criado automaticamente
5. Preencha dados médicos básicos

### **Dashboard**
- **Cards de Métrica**: Últimas medições capturadas
- **Análise IA**: Resumo automático + alertas + recomendações
- **Agenda do Dia**: Tarefas e compromissos de hoje
- **Notas Diárias**: Observações rápidas

### **Gerenciar Agendamento**
1. Clique em "Agenda" no menu
2. Botão "Adicionar Item" para nova tarefa
3. Selecione tipo (medicamento, consulta, cuidado)
4. Defina data e descrição
5. Marque como concluído com checkbox

### **Registrar Métrica**
1. Dashboard → Botão "Registrar"
2. Selecione tipo de métrica
3. Insira valor e unidade
4. IA analisa automaticamente

### **Gerenciar Equipe**
1. Perfil → Botão "Gerenciar Equipe"
2. Adicione cuidadores por email
3. Defina papéis (cuidador, médico, etc)
4. Removam membros conforme necessário

---

## 📱 **Responsividade**

A aplicação foi otimizada para todos os tamanhos de tela usando Tailwind CSS:

- **Mobile (320px-480px)**: Navegação comprimida, cards em coluna única
- **Tablet (640px-1024px)**: Layout em 2 colunas, spacing aumentado
- **Desktop (1025px+)**: Grid 3 colunas, máximo conforto visual

Todas as métricas, cards, modais e controles são touch-friendly.

---

## 🔧 **Comandos Disponíveis**

```bash
# Desenvolvimento
npm run dev              # Inicia dev server (http://localhost:5173)

# Build
npm run build           # Build para produção
npm run preview         # Preview do build

# Linting
npm run lint            # Verifica erros TypeScript
```

---

## 🌐 **Deployment**

### **Vercel** (Recomendado)
```bash
npm install -g vercel
vercel
```

### **Firebase Hosting**
```bash
firebase deploy --only hosting
```

### **Configurar Variáveis de Produção**
Adicione em seu servidor:
```env
VITE_GEMINI_API_KEY=sua_chave_api
VITE_FIREBASE_CONFIG=...
```

---

## 🔒 **Segurança**

- ✅ Autenticação via Firebase (padrão industrial)
- ✅ Firestore com regras de segurança por usuário
- ✅ Variáveis sensíveis via `.env.local`
- ✅ API calls assinadas com credenciais

---

## 🤝 **Contribuindo**

Encontrou um bug? Quer adicionar feature?

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 **License**

Este projeto está sob a license MIT. Veja [LICENSE](LICENSE) para detalhes.

---

## 💬 **Suporte**

Dúvidas ou problemas? 
- 📧 Email: seu-email@exemplo.com
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

## 🎯 **Roadmap**

- [ ] Integração com wearables (Apple Watch, Fitbit)
- [ ] Modo dark mode
- [ ] Export PDF de relatórios
- [ ] Notificações push
- [ ] Gráficos de tendência avançados
- [ ] Integração com SMS/WhatsApp
- [ ] Suporte a múltiplos pacientes por cuidador
- [ ] Integração com prontuário eletrônico

---

**Desenvolvido com ❤️ para cuidado à saúde**
