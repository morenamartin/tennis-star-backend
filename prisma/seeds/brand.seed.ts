export async function seedBrands(prisma) {
    await prisma.brand.createMany({
        data: [
            { name: "Nike" },
            { name: "Adidas" },
            { name: "Puma" },
            { name: "Reebok" },
            { name: "Fila" },
            { name: "Topper" },
            { name: "New Balance" },
        ],
        skipDuplicates: true,
    })
}
