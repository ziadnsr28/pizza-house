import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/pizzahouse?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Pizza House database...");

  // 1. Categories
  const categories = [
    { name: "Classic", slug: "classic", description: "Traditional Italian recipe favorites" },
    { name: "Special", slug: "special", description: "Chef signature artisan creations" },
    { name: "Spicy", slug: "spicy", description: "Hot chili & fiery pepper varieties" },
    { name: "Vegetarian", slug: "vegetarian", description: "Fresh organic vegetables & gourmet cheeses" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // 2. Pizzas
  const classicCat = await prisma.category.findUnique({ where: { slug: "classic" } });
  const specialCat = await prisma.category.findUnique({ where: { slug: "special" } });
  const spicyCat = await prisma.category.findUnique({ where: { slug: "spicy" } });
  const vegCat = await prisma.category.findUnique({ where: { slug: "vegetarian" } });

  const pizzas = [
    {
      id: "pizza-1",
      name: "Pepperoni Supreme",
      description: "Crispy artisan pepperoni, melted mozzarella, and signature tomato sauce.",
      price: 225,
      image: "/images/pizza-pepperoni.png",
      category: "Classic",
      categoryId: classicCat?.id,
      ingredients: JSON.stringify(["Pepperoni", "Mozzarella", "Tomato Sauce", "Oregano"]),
    },
    {
      id: "pizza-2",
      name: "Classic Margherita",
      description: "San Marzano tomatoes, fresh mozzarella, extra virgin olive oil, and fresh basil.",
      price: 175,
      image: "/images/pizza-margherita.png",
      category: "Classic",
      categoryId: classicCat?.id,
      ingredients: JSON.stringify(["San Marzano Tomatoes", "Fresh Mozzarella", "Basil", "Olive Oil"]),
    },
    {
      id: "pizza-3",
      name: "Truffle Mushroom",
      description: "Roasted wild mushrooms, creamy garlic white sauce, truffle oil, and fresh thyme.",
      price: 260,
      image: "/images/pizza-truffle.png",
      category: "Special",
      categoryId: specialCat?.id,
      ingredients: JSON.stringify(["Wild Mushrooms", "White Truffle Oil", "Garlic Sauce", "Parmesan"]),
    },
    {
      id: "pizza-4",
      name: "Garden Veggie Delight",
      description: "Mediterranean organic bell peppers, kalamata olives, red onions, cherry tomatoes, and feta.",
      price: 195,
      image: "/images/pizza-veggie.png",
      category: "Vegetarian",
      categoryId: vegCat?.id,
      ingredients: JSON.stringify(["Bell Peppers", "Kalamata Olives", "Red Onions", "Feta Cheese"]),
    },
    {
      id: "pizza-5",
      name: "Fiery Diablo Spicy",
      description: "Spicy pepperoni, fresh jalapeno slices, crushed red pepper, hot chili oil, and spicy tomato sauce.",
      price: 240,
      image: "/images/pizza-spicy.png",
      category: "Spicy",
      categoryId: spicyCat?.id,
      ingredients: JSON.stringify(["Spicy Pepperoni", "Jalapenos", "Chili Oil", "Spicy Sauce"]),
    },
    {
      id: "pizza-6",
      name: "Chicken Ranch Pizza",
      description: "Grilled marinated chicken breast, creamy garlic ranch sauce, mozzarella, and sweet corn.",
      price: 265,
      image: "/images/hero-pizza.png",
      category: "Special",
      categoryId: specialCat?.id,
      ingredients: JSON.stringify(["Grilled Chicken", "Ranch Dressing", "Sweet Corn", "Mozzarella"]),
    },
  ];

  for (const pizza of pizzas) {
    await prisma.pizza.upsert({
      where: { id: pizza.id },
      update: {
        name: pizza.name,
        description: pizza.description,
        image: pizza.image,
        category: pizza.category,
        categoryId: pizza.categoryId,
        price: pizza.price,
        ingredients: pizza.ingredients,
        available: true,
      },
      create: pizza,
    });
  }

  // 3. Default administrator account
  const adminPassword = await bcrypt.hash("Admin123@", 12);
  await prisma.user.upsert({
    where: { email: "admin@pizzahouse.com" },
    update: { role: "ADMIN", password: adminPassword },
    create: {
      name: "Admin User",
      email: "admin@pizzahouse.com",
      phone: "+20 100 000 9999",
      role: "ADMIN",
      address: "Headquarters, Cairo, Egypt",
      password: adminPassword,
    },
  });

  // 4. Demo Customer Users
  const demoUsers = [
    { name: "Ahmed Hassan", email: "ahmed.hassan@example.com", phone: "+20 100 123 4567" },
    { name: "Sara Mahmoud", email: "sara.m@example.com", phone: "+20 111 987 6543" },
    { name: "Mohamed Ali", email: "m.ali@example.com", phone: "+20 122 345 6789" },
  ];

  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  // 5. Sample Orders
  const customer = await prisma.user.findUnique({ where: { email: "ahmed.hassan@example.com" } });
  const samplePizza = await prisma.pizza.findFirst();

  if (customer && samplePizza) {
    const existingOrder = await prisma.order.findFirst();
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          id: "ORD-9841",
          userId: customer.id,
          customerName: customer.name || "Ahmed Hassan",
          customerEmail: customer.email,
          customerPhone: customer.phone || "+20 100 123 4567",
          status: "Pending",
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Unpaid",
          total: 490,
          items: {
            create: [
              {
                pizzaId: samplePizza.id,
                quantity: 2,
                size: "Medium",
                price: samplePizza.price,
              },
            ],
          },
        },
      });

      await prisma.order.create({
        data: {
          id: "ORD-9840",
          userId: customer.id,
          customerName: "Sara Mahmoud",
          customerEmail: "sara.m@example.com",
          customerPhone: "+20 111 987 6543",
          status: "Preparing",
          paymentMethod: "Credit Card",
          paymentStatus: "Paid",
          total: 360,
          items: {
            create: [
              {
                pizzaId: samplePizza.id,
                quantity: 1,
                size: "Large",
                price: samplePizza.price,
              },
            ],
          },
        },
      });
    }
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
