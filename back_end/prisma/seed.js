const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Deletar dados existentes para evitar duplicatas em cada deploy
  await prisma.cidade.deleteMany({});
  await prisma.tecnico.deleteMany({});
  await prisma.cTO.deleteMany({}); // Se tiver CTO, também deleta

  // Inserir cidades
  const cidade1 = await prisma.cidade.create({
    data: { nome: 'São Paulo' },
  });
  const cidade2 = await prisma.cidade.create({
    data: { nome: 'Rio de Janeiro' },
  });
  const cidade3 = await prisma.cidade.create({
    data: { nome: 'Belo Horizonte' },
  });

  console.log(`Cidades criadas: ${cidade1.nome}, ${cidade2.nome}, ${cidade3.nome}`);

  // Inserir técnicos
  const tecnico1 = await prisma.tecnico.create({
    data: { nome: 'João Silva' },
  });
  const tecnico2 = await prisma.tecnico.create({
    data: { nome: 'Maria Souza' },
  });
  const tecnico3 = await prisma.tecnico.create({
    data: { nome: 'Pedro Alves' },
  });

  console.log(`Técnicos criados: ${tecnico1.nome}, ${tecnico2.nome}, ${tecnico3.nome}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });