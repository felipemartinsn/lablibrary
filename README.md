# LabLibrary - Sistema de Gerenciamento de Acervo de Laboratório

Sistema completo full-stack para gerenciamento de acervo de laboratório, incluindo livros, equipamentos, empréstimos, advertências, reservas e bloqueios de usuários.

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express**
- **Prisma ORM** (MySQL)
- **JWT** com refresh tokens
- **TypeScript**
- **Swagger/OpenAPI** para documentação

### Frontend
- **Next.js 14+** (App Router)
- **React 18**
- **TailwindCSS**
- **shadcn/ui**
- **Zustand** para gerenciamento de estado
- **react-hook-form** + **zod** para validação
- **Recharts** para gráficos

### Infraestrutura
- **Docker** + **Docker Compose**
- **MySQL 8.0**

## 📋 Funcionalidades

### Gestão de Usuários
- CRUD completo de usuários (alunos, professores, técnicos)
- Controle de bloqueios
- Rastreamento de advertências
- Status de ativação/desativação

### Gestão de Materiais
- CRUD completo de materiais (livros, apostilas, artigos, equipamentos)
- Controle de estoque (quantidade total e disponível)
- Status de condição (novo, bom, danificado, manutenção, perdido)
- Área temática e código interno

### Empréstimos
- Criação de empréstimos
- Devolução de materiais
- Controle de prazos e atrasos
- Geração automática de advertências para atrasos
- Atualização automática de estoque

### Advertências (Fines)
- Criação manual de advertências
- Geração automática para devoluções atrasadas
- Controle de advertências ativas
- Bloqueio automático quando limite é atingido

### Reservas
- Sistema de fila de reservas
- Priorização (professores têm prioridade)
- Liberação automática quando material fica disponível

### Configurações
- Limite máximo de advertências
- Duração do bloqueio
- Configurações do sistema

### Auditoria
- Logs completos de todas as operações CRUD
- Rastreamento de usuário, entidade, ação e detalhes
- Filtros por usuário, entidade e tipo de ação

## 🏗️ Arquitetura

### Backend (Clean Architecture)
```
backend/
├── src/
│   ├── config/          # Configurações (database, swagger)
│   ├── controllers/     # Controladores HTTP
│   ├── services/        # Lógica de negócio
│   ├── repositories/    # Acesso a dados
│   ├── middlewares/     # Middlewares (auth, error, audit)
│   ├── validators/      # Validações com Zod
│   ├── utils/           # Utilitários (JWT, paginação)
│   ├── routes/          # Definição de rotas
│   └── server.ts        # Servidor Express
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   └── seed.ts          # Dados iniciais
└── Dockerfile
```

### Frontend (Next.js App Router)
```
frontend/
├── app/
│   ├── (dashboard)/     # Rotas protegidas
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── materials/
│   │   ├── loans/
│   │   ├── fines/
│   │   ├── reservations/
│   │   ├── settings/
│   │   └── audit-logs/
│   ├── login/           # Página de login
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── ui/              # Componentes shadcn/ui
├── lib/
│   ├── api.ts           # Cliente Axios
│   ├── store.ts         # Zustand store
│   └── utils.ts         # Utilitários
└── hooks/               # Custom hooks
```

## 🗄️ Modelo de Dados (ERD)

```
Users
├── id (PK)
├── name
├── email (unique)
├── registration_number (unique)
├── user_type (student|professor|technician)
├── lab_link
├── fine_count
├── active
└── blocked_until

Materials
├── id (PK)
├── internal_code (unique)
├── title
├── thematic_area
├── material_type (book|handout|article|equipment)
├── quantity_total
├── quantity_available
└── condition_status (new|good|damaged|maintenance|lost)

Loans
├── id (PK)
├── user_id (FK -> Users)
├── material_id (FK -> Materials)
├── responsible_staff_id (FK -> Users)
├── loan_date
├── due_date
├── return_date
├── status (active|returned|overdue)
└── return_condition

Fines
├── id (PK)
├── user_id (FK -> Users)
├── loan_id (FK -> Loans, nullable)
├── reason (late_return|damaged_material|rule_violation)
├── description
└── is_active

Reservations
├── id (PK)
├── material_id (FK -> Materials)
├── user_id (FK -> Users)
└── priority_level

Settings
├── id (PK)
├── max_fines_limit
└── block_duration_days

Audit_Logs
├── id (PK)
├── user_id (FK -> Users, nullable)
├── entity
├── action_type (INSERT|UPDATE|DELETE)
├── timestamp
└── details (JSON)
```

## 🔧 Instalação e Execução

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)

### Com Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <repository-url>
cd sistema-biblioteca
```

2. Inicie os serviços:
```bash
docker-compose up -d
```

3. Acesse:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs (Swagger): http://localhost:3001/api-docs
- MySQL: localhost:3306

### Desenvolvimento Local

#### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env`:
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

4. Execute as migrações e seed:
```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

5. Inicie o servidor:
```bash
npm run dev
```

#### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env.local`:
```bash
cp .env.local.example .env.local
# Edite com a URL da API
```

4. Inicie o servidor:
```bash
npm run dev
```

## 👤 Autenticação

**⚠️ Nota:** A autenticação foi removida para fins de demonstração. A tela de login é apenas fictícia e permite acesso com qualquer credencial.

- Qualquer email e senha permitem acesso ao sistema
- Um usuário fictício (Usuário Demo) é criado automaticamente
- Não é necessário executar o seed para acessar o frontend

### Para desenvolvimento com autenticação real

Se você quiser reativar a autenticação real, você precisará:

1. **Executar o seed do backend:**
   ```bash
   cd backend
   npm run prisma:seed
   ```

2. **Credenciais padrão (após seed):**
   - **Email**: `admin@lablibrary.com`
   - **Senha**: `123456`

3. **Verificar usuários:**
   ```bash
   cd backend
   npm run check:user
   ```

## 📚 Regras de Negócio

### Usuários
- Usuários bloqueados não podem fazer empréstimos
- `fine_count` aumenta automaticamente quando uma advertência ativa é criada
- Se `fine_count >= max_fines_limit`, o usuário é bloqueado automaticamente

### Materiais
- Ao criar empréstimo, `quantity_available` é decrementado
- Ao devolver, `quantity_available` é incrementado
- Reservas só são permitidas quando `quantity_available = 0`

### Empréstimos
- Devolução atrasada gera advertência automática
- Status muda para `overdue` quando passa da data de vencimento

### Advertências
- Advertências ativas incrementam `fine_count` do usuário
- Quando limite é atingido, usuário é bloqueado por `block_duration_days`

### Reservas
- Sistema de fila com priorização
- Professores têm prioridade maior (priority_level = 1)
- Quando material fica disponível, primeira reserva da fila é processada

### Auditoria
- Todas as operações CRUD geram logs automáticos
- Logs incluem usuário, entidade, ação e detalhes completos (JSON)

## 🧪 Seeds

O seed cria:
- 5 alunos
- 2 professores
- 1 técnico (admin)
- 10 materiais
- 3 empréstimos
- 2 advertências
- 2 reservas
- Configurações padrão

## 📖 Documentação da API

A documentação completa da API está disponível em:
- **Swagger UI**: http://localhost:3001/api-docs

## 🛠️ Scripts Disponíveis

### Backend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila TypeScript
- `npm run start` - Inicia servidor de produção
- `npm run prisma:generate` - Gera Prisma Client
- `npm run prisma:migrate` - Executa migrações
- `npm run prisma:seed` - Executa seed
- `npm run prisma:studio` - Abre Prisma Studio

### Frontend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa linter

## 🔒 Segurança

- Autenticação JWT com refresh tokens
- Senhas hasheadas com bcrypt
- Validação de dados com Zod
- Middleware de autenticação e autorização
- CORS configurado
- Sanitização de inputs

## 📝 Licença

Este projeto foi desenvolvido como sistema de gerenciamento de acervo de laboratório.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório.

---

Desenvolvido com ❤️ para gerenciamento eficiente de acervos de laboratório.

