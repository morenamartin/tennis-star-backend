export async function seedSales(prisma) {
  const clients = await prisma.client.findMany({ take: 2 })
  const variants = await prisma.productVariant.findMany({ take: 2 })

  await prisma.sale.create({
    data: {
      orderNumber: `ORD-${Date.now()}-1`,
      clientId: clients[0].id,
      paymentMethod: "CASH",
      shippingAddress: "Av. Corrientes 123",
      total: Number(variants[0].price),
      items: {
        create: [
          {
            variantId: variants[0].id,
            quantity: 1,
            total: Number(variants[0].price),
          },
        ],
      },
    },
  })

  await prisma.sale.create({
    data: {
      orderNumber: `ORD-${Date.now()}-2`,
      clientId: clients[1].id,
      paymentMethod: "TRANSFER",
      shippingAddress: "Av. Santa Fe 456",
      total: Number(variants[1].price) * 2,
      items: {
        create: [
          {
            variantId: variants[1].id,
            quantity: 2,
            total: Number(variants[1].price) * 2,
          },
        ],
      },
    },
  })
}
