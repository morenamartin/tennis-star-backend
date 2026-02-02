import { prisma } from './prisma'

async function createUser(name: string, email: string) {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: 'password', // Default/placeholder password
      }
    })
    console.log('Created user:', user)
    return user
  } catch (error) {
    console.error('Error creating user:', error)
  }
}

async function getUsers() {
  try {
    const allUsers = await prisma.user.findMany()
    console.log('All users:', JSON.stringify(allUsers, null, 2))
    return allUsers
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

async function main() {
  await createUser('Alice', 'alice@prisma.io')
  await getUsers()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })