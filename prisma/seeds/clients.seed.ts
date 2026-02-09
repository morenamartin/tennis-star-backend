export async function seedClients(prisma) {
  await prisma.client.createMany({
    data: [
      {
        name: "Juan Pérez",
        email: "juan@gmail.com",
        phone: "1134345564",
      },
      {
        name: "María González",
        email: "maria@gmail.com",
        phone: "1144556677",
      },
      {
        name: "Lucía Fernández",
        email: "lucia@gmail.com",
        phone: "1122334455",
      },
      {
        name: "Carlos Rodríguez",
        email: "carlos@gmail.com",
        phone: "1199887766",
      },
    ],
    skipDuplicates: true,
  })
}
