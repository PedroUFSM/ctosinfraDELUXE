const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o script de seed com os DADOS FINAIS...');

  // Inserir cidades com CID_UF e CID_IBGE
  const cidades = await prisma.cidade.createMany({
    data: [
      { CID_NOME: 'Campo Novo', CID_UF: 'RS', CID_IBGE: '4303803' },
      { CID_NOME: 'Coronel Bicaco', CID_UF: 'RS', CID_IBGE: '4305802' },
      { CID_NOME: 'Redentora', CID_UF: 'RS', CID_IBGE: '4315206' },
      { CID_NOME: 'Miraguaí', CID_UF: 'RS', CID_IBGE: '4312005' },
      { CID_NOME: 'Erval Seco', CID_UF: 'RS', CID_IBGE: '4307600' },
      { CID_NOME: 'Dois Irmãos', CID_UF: 'RS', CID_IBGE: '4306305' },
      { CID_NOME: 'Tenente Portela', CID_UF: 'RS', CID_IBGE: '4321303' },
      { CID_NOME: 'Três Passos', CID_UF: 'RS', CID_IBGE: '4321600' },
      { CID_NOME: 'Derrubadas', CID_UF: 'RS', CID_IBGE: '4306321' },
      { CID_NOME: 'Vista Gaúcha', CID_UF: 'RS', CID_IBGE: '4323606' },
      { CID_NOME: 'Panambi', CID_UF: 'RS', CID_IBGE: '4313904' },
      { CID_NOME: 'Condor', CID_UF: 'RS', CID_IBGE: '4305604' }
    ],
    skipDuplicates: true, // Garante que não duplica se já existirem
  });
  console.log(`${cidades.count} cidades criadas.`);

  // Inserir técnicos com TEC_SITUACAO
  const tecnicos = await prisma.tecnico.createMany({
    data: [
      { TEC_NOME: 'Andre Artur Santos do Nascimento', TEC_SITUACAO: 1 },
      { TEC_NOME: 'Daniel Jesus de Vargas', TEC_SITUACAO: 1 },
      { TEC_NOME: 'Roger Andrei Santos de Sena', TEC_SITUACAO: 1 },
      { TEC_NOME: 'Emanuel Atílio Vigne de Anhaia', TEC_SITUACAO: 1 }
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