import bcrypt from 'bcrypt'; // o 'bcryptjs'

export async function seedUsers(prisma) {
    // Definimos la cantidad de "salt rounds" para el encriptado
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("Password123", saltRounds);

    await prisma.user.createMany({
        data: [
            { 
                name: "Morena Martin",
                email: "martinmorena269@gmail.com",
                password: hashedPassword,
                rememberMe: false
            },
        ],
        skipDuplicates: true,
    });
}