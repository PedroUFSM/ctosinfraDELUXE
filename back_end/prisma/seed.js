const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o script de seed...');

  // Inserir cidades com CID_UF e CID_IBGE
  const cidades = await prisma.cidade.createMany({
    data: [
      { CID_NOME: 'São Paulo', CID_UF: 'SP', CID_IBGE: '3550308' },
      { CID_NOME: 'Rio de Janeiro', CID_UF: 'RJ', CID_IBGE: '3304557' },
      { CID_NOME: 'Belo Horizonte', CID_UF: 'MG', CID_IBGE: '3106200' },
      { CID_NOME: 'Curitiba', CID_UF: 'PR', CID_IBGE: '4106902' },
      { CID_NOME: 'Porto Alegre', CID_UF: 'RS', CID_IBGE: '4314902' },
      { CID_NOME: 'Florianópolis', CID_UF: 'SC', CID_IBGE: '4205407' }
    ],
    skipDuplicates: true, // Garante que não duplica se já existirem
  });
  console.log(`${cidades.count} cidades criadas.`);

  // Inserir técnicos com TEC_SITUACAO
  const tecnicos = await prisma.tecnico.createMany({
    data: [
      { TEC_NOME: 'João Silva', TEC_SITUACAO: 1 }, // 1 para ativo, 0 para inativo ou outro código
      { TEC_NOME: 'Maria Souza', TEC_SITUACAO: 1 },
      { TEC_NOME: 'Pedro Alves', TEC_SITUACAO: 1 },
      { TEC_NOME: 'Ana Costa', TEC_SITUACAO: 0 },
      { TEC_NOME: 'Lucas Ferreira', TEC_SITUACAO: 1 }
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