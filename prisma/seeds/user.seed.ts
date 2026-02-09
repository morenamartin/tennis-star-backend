export async function seedUsers(prisma) {
    await prisma.user.createMany({
        data: [
            { 
                name: "Morena Martin",
                email: "martinmorena269@gmail.com",
                password: "Password123",
            },
        ],
        skipDuplicates: true,
    })
}
