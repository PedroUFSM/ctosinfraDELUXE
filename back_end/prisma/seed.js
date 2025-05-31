const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o script de seed...');

  // REMOVEMOS O BLOCO DE DELEÇÃO AQUI, pois está causando problema.
  // O "skipDuplicates: true" nos "createMany" abaixo vai evitar duplicatas.

  // Inserir cidades
  const cidades = await prisma.cidade.createMany({
    data: [
      { nome: 'São Paulo' },
      { nome: 'Rio de Janeiro' },
      { nome: 'Belo Horizonte' },
      { nome: 'Curitiba' },
      { nome: 'Porto Alegre' },
      { nome: 'Florianópolis' }
    ],
    skipDuplicates: true, // Garante que não duplica se já existirem
  });
  console.log(`${cidades.count} cidades criadas.`);

  // Inserir técnicos
  const tecnicos = await prisma.tecnico.createMany({
    data: [
      { nome: 'João Silva' },
      { nome: 'Maria Souza' },
      { nome: 'Pedro Alves' },
      { nome: 'Ana Costa' },
      { nome: 'Lucas Ferreira' }
    ],
    skipDuplicates: true, // Garante que não duplica se já existirem
  });
  console.log(`${tecnicos.count} técnicos criados.`);

  console.log('Script de seed concluído com sucesso!');
}

main()
  .catch(e => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });