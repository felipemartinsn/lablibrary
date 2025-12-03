# 🚀 Guia Rápido de Início - LabLibrary

## Início Rápido com Docker

### 1. Inicie todos os serviços
```bash
docker-compose up -d
```

### 2. Aguarde a inicialização
O backend irá:
- Instalar dependências
- Gerar Prisma Client
- Executar migrações
- Popular o banco com dados iniciais (seed)

Isso pode levar 1-2 minutos na primeira execução.

### 3. Acesse a aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api-docs
- **MySQL**: localhost:3306

### 4. Faça login
- **Email**: `admin@lablibrary.com`
- **Senha**: `123456`

## Verificar Status dos Serviços

```bash
docker-compose ps
```

## Ver Logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

## Parar os Serviços

```bash
docker-compose down
```

## Limpar Tudo (incluindo dados)

```bash
docker-compose down -v
```

## Desenvolvimento Local (sem Docker)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com suas configurações
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edite o .env.local
npm run dev
```

## Estrutura do Projeto

```
sistema-biblioteca/
├── backend/          # API Node.js/Express
├── frontend/         # Next.js App
├── docker-compose.yml
└── README.md
```

## Próximos Passos

1. Acesse o dashboard em http://localhost:3000
2. Explore as funcionalidades:
   - Gerenciar usuários
   - Cadastrar materiais
   - Criar empréstimos
   - Ver advertências
   - Gerenciar reservas
   - Configurar sistema
   - Ver logs de auditoria

## Problemas Comuns

### Porta já em uso
```bash
# Pare outros serviços nas portas 3000, 3001 ou 3306
# Ou altere as portas no docker-compose.yml
```

### Erro de conexão com banco
```bash
# Aguarde o MySQL inicializar completamente
docker-compose logs mysql
```

### Erro no Prisma
```bash
# No backend, execute:
cd backend
npx prisma generate
npx prisma migrate reset
npm run prisma:seed
```

## Suporte

Consulte o README.md completo para mais detalhes.

