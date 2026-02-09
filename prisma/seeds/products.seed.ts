export async function seedProducts(prisma) {
const getCategory = async (name) => {
  const c = await prisma.category.findFirst({ where: { name } })
  if (!c) throw new Error(`Category ${name} not found`)
  return c
}

const getBrand = async (name) => {
  const b = await prisma.brand.findFirst({ where: { name } })
  if (!b) throw new Error(`Brand ${name} not found`)
  return b
}


await prisma.product.create({
  data: {
    name: "Zapatilla Running Pro",
    description: "Zapatilla liviana ideal para running urbano",
    stock: 12,

    brand: { connect: { id: (await getBrand("Nike")).id } },
    category: { connect: { id: (await getCategory("Running")).id } },

    images: ["https://res.cloudinary.com/demo/zapatilla-negra.webp"],

    options: {
      create: [
        {
          name: "Talle",
          values: ["39", "40", "41"],
        },
        {
          name: "Color",
          values: ["Negro"],
        },
      ],
    },

    variants: {
      create: [
        {
          sku: "RUN-NIKE-39",
          price: 45000,
          stock: 5,
          attributes: { Talle: "39", Color: "Negro" },
        },
        {
          sku: "RUN-NIKE-40",
          price: 45000,
          stock: 4,
          attributes: { Talle: "40", Color: "Negro" },
        },
        {
          sku: "RUN-NIKE-41",
          price: 45000,
          stock: 3,
          attributes: { Talle: "41", Color: "Negro" },
        },
      ],
    },
  },
})

await prisma.product.create({
  data: {
    name: "Nike Air Zoom Runner",
    description: "Zapatilla de running liviana y reactiva",
    stock: 12,

    brand: { connect: { id: (await getBrand("Nike")).id } },
    category: { connect: { id: (await getCategory("Running")).id } },

    images: ["https://res.cloudinary.com/demo/nike-run.webp"],
    options: {
      create: [
        { name: "Talle", values: ["39", "40", "41"] },
        { name: "Color", values: ["Negro"] },
      ],
    },
    variants: {
      create: [
        { sku: "NIK-RUN-39", price: 52000, stock: 4, attributes: { Talle: "39", Color: "Negro" } },
        { sku: "NIK-RUN-40", price: 52000, stock: 4, attributes: { Talle: "40", Color: "Negro" } },
        { sku: "NIK-RUN-41", price: 52000, stock: 4, attributes: { Talle: "41", Color: "Negro" } },
      ],
    },
  },
})


await prisma.product.create({
  data: {
    name: "Adidas Street Classic",
    description: "Zapatilla urbana para uso diario",
    stock: 10,

    brand: { connect: { id: (await getBrand("Adidas")).id } },
    category: { connect: { id: (await getCategory("Urbano")).id } },

    images: ["https://res.cloudinary.com/demo/adidas-urb.webp"],
    options: {
      create: [
        { name: "Talle", values: ["38", "39", "40", "41"] },
        { name: "Color", values: ["Blanco"] },
      ],
    },
    variants: {
      create: [
        { sku: "ADI-URB-38", price: 39000, stock: 2, attributes: { Talle: "38", Color: "Blanco" } },
        { sku: "ADI-URB-39", price: 39000, stock: 3, attributes: { Talle: "39", Color: "Blanco" } },
        { sku: "ADI-URB-40", price: 39000, stock: 3, attributes: { Talle: "40", Color: "Blanco" } },
        { sku: "ADI-URB-41", price: 39000, stock: 2, attributes: { Talle: "41", Color: "Blanco" } },
      ],
    },
  },
})

await prisma.product.create({
  data: {
    name: "Puma Train Flex",
    description: "Zapatilla para entrenamiento funcional",
    stock: 8,
    brand: { connect: { id: (await getBrand("Puma")).id } },
    category: { connect: { id: (await getCategory("Training")).id } },
    images: ["https://res.cloudinary.com/demo/puma-train.webp"],
    options: {
      create: [
        { name: "Talle", values: ["39", "40", "41"] },
        { name: "Color", values: ["Negro"] },
      ],
    },
    variants: {
      create: [
        { sku: "PUM-TRN-39", price: 41000, stock: 3, attributes: { Talle: "39", Color: "Negro" } },
        { sku: "PUM-TRN-40", price: 41000, stock: 3, attributes: { Talle: "40", Color: "Negro" } },
        { sku: "PUM-TRN-41", price: 41000, stock: 2, attributes: { Talle: "41", Color: "Negro" } },
      ],
    },
  },
})

await prisma.product.create({
  data: {
    name: "Topper Fútbol Campo",
    description: "Botín para césped natural",
    stock: 6,
    brand: { connect: { id: (await getBrand("Topper")).id } },
    category: { connect: { id: (await getCategory("Fútbol")).id } },
    images: ["https://res.cloudinary.com/demo/topper-fut.webp"],
    options: {
      create: [
        { name: "Talle", values: ["40", "41", "42"] },
        { name: "Color", values: ["Negro"] },
      ],
    },
    variants: {
      create: [
        { sku: "TOP-FUT-40", price: 36000, stock: 2, attributes: { Talle: "40", Color: "Negro" } },
        { sku: "TOP-FUT-41", price: 36000, stock: 2, attributes: { Talle: "41", Color: "Negro" } },
        { sku: "TOP-FUT-42", price: 36000, stock: 2, attributes: { Talle: "42", Color: "Negro" } },
      ],
    },
  },
})

await prisma.product.create({
  data: {
    name: "New Balance Lifestyle 574",
    description: "Zapatilla clásica lifestyle",
    stock: 9,
    brand: { connect: { id: (await getBrand("New Balance")).id } },
    category: { connect: { id: (await getCategory("Lifestyle")).id } },
    images: ["https://res.cloudinary.com/demo/nb-574.webp"],
    options: {
      create: [
        { name: "Talle", values: ["39", "40", "41"] },
        { name: "Color", values: ["Gris"] },
      ],
    },
    variants: {
      create: [
        { sku: "NB-574-39", price: 48000, stock: 3, attributes: { Talle: "39", Color: "Gris" } },
        { sku: "NB-574-40", price: 48000, stock: 3, attributes: { Talle: "40", Color: "Gris" } },
        { sku: "NB-574-41", price: 48000, stock: 3, attributes: { Talle: "41", Color: "Gris" } },
      ],
    },
  },
})


}
