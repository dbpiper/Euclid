import { prisma } from './generated/prisma-client';

async function main() {
  const user = await prisma.user({ id: '__USER_ID__' });

}

main().catch(e => console.error(e));


