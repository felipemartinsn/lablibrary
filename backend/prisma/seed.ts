import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Create default settings
  const settings = await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      maxFinesLimit: 3,
      blockDurationDays: 7,
    },
  });
  console.log('✅ Settings criados');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Create 5 students
  const students = await Promise.all([
    prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        registrationNumber: 'STU001',
        userType: 'student',
        labLink: 'https://lab.example.com/joao',
        password: hashedPassword,
        fineCount: 0,
        active: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maria Santos',
        email: 'maria.santos@example.com',
        registrationNumber: 'STU002',
        userType: 'student',
        labLink: 'https://lab.example.com/maria',
        password: hashedPassword,
        fineCount: 1,
        active: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@example.com',
        registrationNumber: 'STU003',
        userType: 'student',
        labLink: 'https://lab.example.com/pedro',
        password: hashedPassword,
        fineCount: 0,
        active: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ana Costa',
        email: 'ana.costa@example.com',
        registrationNumber: 'STU004',
        userType: 'student',
        labLink: 'https://lab.example.com/ana',
        password: hashedPassword,
        fineCount: 2,
        active: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carlos Ferreira',
        email: 'carlos.ferreira@example.com',
        registrationNumber: 'STU005',
        userType: 'student',
        labLink: 'https://lab.example.com/carlos',
        password: hashedPassword,
        fineCount: 0,
        active: true,
      },
    }),
  ]);
  console.log('✅ 5 alunos criados');

  // Create 2 professors
  const professors = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Prof. Dr. Roberto Alves',
        email: 'roberto.alves@example.com',
        registrationNumber: 'PROF001',
        userType: 'professor',
        labLink: 'https://lab.example.com/roberto',
        password: hashedPassword,
        fineCount: 0,
        active: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Prof. Dra. Fernanda Lima',
        email: 'fernanda.lima@example.com',
        registrationNumber: 'PROF002',
        userType: 'professor',
        labLink: 'https://lab.example.com/fernanda',
        password: hashedPassword,
        fineCount: 0,
        active: true,
      },
    }),
  ]);
  console.log('✅ 2 professores criados');

  // Create 1 technician
  const technician = await prisma.user.create({
    data: {
      name: 'Técnico Admin',
      email: 'admin@lablibrary.com',
      registrationNumber: 'TECH001',
      userType: 'technician',
      password: hashedPassword,
      fineCount: 0,
      active: true,
    },
  });
  console.log('✅ 1 técnico criado');

  // Create 10 materials
  const materials = await Promise.all([
    prisma.material.create({
      data: {
        internalCode: 'MAT001',
        title: 'Introdução à Química Orgânica',
        thematicArea: 'Química',
        materialType: 'book',
        quantityTotal: 5,
        quantityAvailable: 3,
        conditionStatus: 'good',
      },
    }),
    prisma.material.create({
      data: {
        internalCode: 'MAT002',
        title: 'Manual de Laboratório de Física',
        thematicArea: 'Física',
        materialType: 'handout',
        quantityTotal: 10,
        quantityAvailable: 7,
        conditionStatus: 'new',
      },
    }),
    prisma.material.create({
      data: {
        internalCode: 'MAT003',
        title: 'Artigos sobre Biologia Molecular',
        thematicArea: 'Biologia',
        materialType: 'article',
        quantityTotal: 3,
        quantityAvailable: 0,
        conditionStatus: 'good',
      },
    }),
    prisma.material.create({
      data: {
        internalCode: 'MAT004',
        title: 'Microscópio Óptico',
        thematicArea: 'Biologia',
        materialType: 'equipment',
        quantityTotal: 2,
        quantityAvailable: 1,
        conditionStatus: 'good',
      },
    }),
    prisma.material.create({
      data: {
        internalCode: 'MAT005',
        title: 'Fundamentos de Programação',
        thematicArea: 'Computação',
        materialType: 'book',
        quantityTotal: 8,
        quantityAvailable: 5,
        conditionStatus: 'good',
      },
    }),
    prisma.material.create({
      data: {
        internalCode: 'MAT006',
        title: 'Apostila de Cálculo Diferencial',
        thematicArea: 'Matemática',
        materialType: 'handout',
        quantityTotal: 15,
        quantityAvailable: 12,
        conditionStatus: 'new',
      },
    }),
    prisma.material.create({
      data: {
        internalCode: 'MAT007',
        title: 'Balança Analítica',
        thematicArea: 'Química',
        materialType: 'equipment',
        quantityTotal: 1,
        quantityAvailable: 0,
        conditionStatus: 'maintenance',
      },
    }),
    prisma.material.create({
      data: {
        internalCode: 'MAT008',
        title: 'Pesquisas em Engenharia',
        thematicArea: 'Engenharia',
        materialType: 'article',
        quantityTotal: 5,
        quantityAvailable: 3,
        conditionStatus: 'good',
      },
    }),
    prisma.material.create({
      data: {
        internalCode: 'MAT009',
        title: 'Química Inorgânica Avançada',
        thematicArea: 'Química',
        materialType: 'book',
        quantityTotal: 4,
        quantityAvailable: 2,
        conditionStatus: 'damaged',
      },
    }),
    prisma.material.create({
      data: {
        internalCode: 'MAT010',
        title: 'Osciloscópio Digital',
        thematicArea: 'Física',
        materialType: 'equipment',
        quantityTotal: 3,
        quantityAvailable: 2,
        conditionStatus: 'good',
      },
    }),
  ]);
  console.log('✅ 10 materiais criados');

  // Create 3 loans
  const loan1 = await prisma.loan.create({
    data: {
      userId: students[0].id,
      materialId: materials[0].id,
      responsibleStaffId: technician.id,
      loanDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: 'active',
    },
  });

  const loan2 = await prisma.loan.create({
    data: {
      userId: students[1].id,
      materialId: materials[2].id,
      responsibleStaffId: technician.id,
      loanDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (overdue)
      status: 'active',
    },
  });

  const loan3 = await prisma.loan.create({
    data: {
      userId: professors[0].id,
      materialId: materials[3].id,
      responsibleStaffId: technician.id,
      loanDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: 'active',
    },
  });
  console.log('✅ 3 empréstimos criados');

  // Create 2 fines
  const fine1 = await prisma.fine.create({
    data: {
      userId: students[1].id,
      loanId: loan2.id,
      reason: 'late_return',
      description: 'Devolução atrasada do material MAT003',
      isActive: true,
    },
  });

  const fine2 = await prisma.fine.create({
    data: {
      userId: students[3].id,
      reason: 'rule_violation',
      description: 'Violação de regras do laboratório',
      isActive: true,
    },
  });
  console.log('✅ 2 advertências criadas');

  // Create 2 reservations
  await prisma.reservation.create({
    data: {
      materialId: materials[2].id, // Material with 0 available
      userId: students[2].id,
      priorityLevel: 0,
    },
  });

  await prisma.reservation.create({
    data: {
      materialId: materials[6].id, // Material with 0 available
      userId: students[4].id,
      priorityLevel: 0,
    },
  });
  console.log('✅ 2 reservas criadas');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

