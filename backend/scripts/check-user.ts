import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkUser() {
  try {
    console.log('🔍 Verificando usuário admin...');
    
    const user = await prisma.user.findUnique({
      where: { email: 'admin@lablibrary.com' },
    });

    if (!user) {
      console.log('❌ Usuário admin não encontrado!');
      console.log('💡 Execute o seed: npm run prisma:seed');
      return;
    }

    console.log('✅ Usuário encontrado:');
    console.log(`   Nome: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Tipo: ${user.userType}`);
    console.log(`   Ativo: ${user.active}`);
    console.log(`   Bloqueado até: ${user.blockedUntil || 'Não bloqueado'}`);

    // Test password
    const testPassword = '123456';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    if (isValid) {
      console.log('✅ Senha "123456" está correta!');
    } else {
      console.log('❌ Senha "123456" não confere!');
      console.log(`   Hash no banco: ${user.password.substring(0, 20)}...`);
    }

    // List all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        active: true,
      },
    });

    console.log(`\n📊 Total de usuários no banco: ${allUsers.length}`);
    allUsers.forEach((u) => {
      console.log(`   - ${u.name} (${u.email}) - ${u.userType} - ${u.active ? 'Ativo' : 'Inativo'}`);
    });
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();

