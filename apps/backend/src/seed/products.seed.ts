import { Product } from "../models/Product"

export const seedProducts = async () => {
  const count = await Product.countDocuments()
  if (count > 0) return

  await Product.insertMany([
    {
      name: "Classic Burger",
      description: "Beef burger with simple toppings",
      priceCents: 1200,
      modifierGroups: [
        {
          id: "protein",
          name: "Protein",
          required: true,
          min: 1,
          max: 1,
          options: [
            { id: "beef", name: "Beef", priceCents: 0 },
            { id: "chicken", name: "Chicken", priceCents: 0 }
          ]
        },
        {
          id: "toppings",
          name: "Toppings",
          required: false,
          min: 0,
          max: 3,
          options: [
            { id: "cheese", name: "Cheese", priceCents: 100 },
            { id: "lettuce", name: "Lettuce", priceCents: 0 },
            { id: "tomato", name: "Tomato", priceCents: 0 }
          ]
        },
        {
          id: "sauces",
          name: "Sauces",
          required: false,
          min: 0,
          max: 2,
          options: [
            { id: "ketchup", name: "Ketchup", priceCents: 0 },
            { id: "mayo", name: "Mayo", priceCents: 0 }
          ]
        }
      ]
    },

    {
      name: "Chicken Wrap",
      description: "Fresh wrap with chicken and veggies",
      priceCents: 1000,
      modifierGroups: [
        {
          id: "protein",
          name: "Protein",
          required: true,
          min: 1,
          max: 1,
          options: [
            { id: "chicken", name: "Chicken", priceCents: 0 }
          ]
        }
      ]
    },

    {
      name: "Fries",
      description: "Crispy fries",
      priceCents: 500
    },

    {
      name: "Pizza Margherita",
      description: "Classic pizza",
      priceCents: 1500
    },

    {
      name: "Salad Bowl",
      description: "Healthy fresh salad",
      priceCents: 900
    },

    {
      name: "Soda",
      description: "Cold drink",
      priceCents: 300
    },

    {
      name: "Ice Cream",
      description: "Vanilla dessert",
      priceCents: 600
    }
  ])

  console.log("🌱 Products seeded")
}