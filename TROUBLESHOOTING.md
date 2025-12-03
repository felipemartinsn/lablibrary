# 🔧 Guia de Solução de Problemas - LabLibrary

## Problema: Erro ao fazer login

### Verificação 1: Usuário existe no banco?

Execute o script de verificação:
```bash
cd backend
npm run check:user
```

Se o usuário não existir, execute o seed:
```bash
npm run prisma:seed
```

### Verificação 2: Seed foi executado?

Se você está usando Docker, o seed deve executar automaticamente. Verifique os logs:
```bash
docker-compose logs backend | grep -i seed
```

Se não encontrar mensagens de seed, execute manualmente:
```bash
# Dentro do container
docker-compose exec backend npm run prisma:seed

# Ou localmente
cd backend
npm run prisma:seed
```

### Verificação 3: Banco de dados está acessível?

Teste a conexão:
```bash
# Com Docker
docker-compose exec mysql mysql -u lablibrary_user -plablibrary_password lablibrary -e "SELECT COUNT(*) FROM users;"

# Ou use Prisma Studio
cd backend
npm run prisma:studio
```

### Verificação 4: Migrações foram executadas?

```bash
cd backend
npx prisma migrate status
```

Se houver migrações pendentes:
```bash
npx prisma migrate deploy
# ou
npx prisma migrate dev
```

### Verificação 5: Credenciais corretas?

**Credenciais padrão após seed:**
- Email: `admin@lablibrary.com`
- Senha: `123456`

**Outros usuários criados no seed:**
- `joao.silva@example.com` / `123456`
- `maria.santos@example.com` / `123456`
- `roberto.alves@example.com` / `123456` (professor)
- etc.

### Solução Rápida: Recriar tudo

```bash
# Com Docker
docker-compose down -v
docker-compose up -d

# Aguarde alguns minutos para o seed executar
docker-compose logs -f backend
```

### Solução Manual: Recriar seed

```bash
cd backend

# Resetar banco (CUIDADO: apaga todos os dados)
npx prisma migrate reset

# Ou apenas executar seed novamente
npm run prisma:seed
```

## Problema: Backend não inicia

### Verificar variáveis de ambiente

```bash
cd backend
cat .env
```

Certifique-se de que `DATABASE_URL` está correto:
```
DATABASE_URL="mysql://lablibrary_user:lablibrary_password@mysql:3306/lablibrary?schema=public"
```

### Verificar se MySQL está rodando

```bash
docker-compose ps mysql
```

### Verificar logs

```bash
docker-compose logs backend
```

## Problema: Frontend não conecta ao backend

### Verificar URL da API

No arquivo `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Verificar CORS

No backend, verifique se `FRONTEND_URL` está configurado:
```
FRONTEND_URL=http://localhost:3000
```

### Testar API diretamente

```bash
curl http://localhost:3001/health
```

## Problema: Erro de migração do Prisma

### Resetar migrações

```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
npm run prisma:seed
```

### Verificar schema

```bash
npx prisma validate
```

## Comandos Úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Reiniciar um serviço específico
docker-compose restart backend

# Entrar no container
docker-compose exec backend sh
docker-compose exec mysql bash

# Verificar banco de dados
docker-compose exec mysql mysql -u lablibrary_user -plablibrary_password lablibrary

# Limpar tudo e recomeçar
docker-compose down -v
docker-compose up -d
```

## Ainda com problemas?

1. Verifique os logs completos: `docker-compose logs`
2. Verifique se todas as portas estão livres (3000, 3001, 3306)
3. Verifique se Docker tem recursos suficientes (RAM, CPU)
4. Tente executar localmente sem Docker para isolar o problema

