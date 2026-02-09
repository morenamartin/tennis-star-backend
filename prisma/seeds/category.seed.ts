export async function seedCategories(prisma) {
  await prisma.category.createMany({
    data: [
      { name: "Running", position: 1 },
      { name: "Urbano", position: 2 },
      { name: "Training", position: 3 },
      { name: "Outdoor", position: 4 },
      { name: "Fútbol", position: 5 },
      { name: "Lifestyle", position: 6 },
      { name: "Casual", position: 7 },
    ],
    skipDuplicates: true,
  })
}
