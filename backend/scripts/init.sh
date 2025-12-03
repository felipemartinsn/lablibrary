#!/bin/sh

echo "🚀 Iniciando setup do backend..."

echo "📦 Instalando dependências..."
npm install

echo "🔧 Gerando Prisma Client..."
npx prisma generate

echo "🗄️ Executando migrações..."
npx prisma migrate deploy

echo "🌱 Executando seed..."
npm run prisma:seed || echo "⚠️ Seed já executado ou erro (pode ser ignorado se dados já existem)"

echo "✅ Setup concluído!"
echo "🚀 Iniciando servidor..."

npm run dev

