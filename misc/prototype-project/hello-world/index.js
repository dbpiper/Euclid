import { prisma } from './generated/prisma-client';

async function main() {
  const users = await prisma.users({
    where: {
      name: 'Bob',
    },
  });
  const userBob = users[0];
  const updatedUser = await prisma
    .deleteUser({ id: userBob.id });
  console.log(updatedUser);
}

main().catch(e => console.error(e));
