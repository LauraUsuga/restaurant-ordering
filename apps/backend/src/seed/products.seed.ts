import { Product } from "../models/Product"

export const seedProducts = async () => {
  const count = await Product.countDocuments()
  if (count > 0) return

  await Product.insertMany([
    {
      name: "Classic Burger",
      category: "burgers",
      description: "Beef burger with simple toppings",
      priceCents: 1200,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
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
        }
      ]
    },

    {
      name: "Chicken Wrap",
      category: "wraps",
      description: "Fresh wrap with chicken and veggies",
      priceCents: 1000,
      imageUrl:
        "https://images.unsplash.com/photo-1626645738196-c2a7c87a2d2f",
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
      category: "sides",
      description: "Crispy fries",
      priceCents: 500,
      imageUrl:
        "https://images.unsplash.com/photo-1606755962773-d324e0a13086"
    },

    {
      name: "Pizza Margherita",
      category: "pizzas",
      description: "Classic pizza with tomato and cheese",
      priceCents: 1500,
      imageUrl:
        "https://images.unsplash.com/photo-1601924582970-9238bcb495d9"
    },

    {
      name: "Salad Bowl",
      category: "salads",
      description: "Healthy fresh salad",
      priceCents: 900,
      imageUrl:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
    },

    {
      name: "Soda",
      category: "drinks",
      description: "Cold drink",
      priceCents: 300,
      imageUrl:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
    },

    {
      name: "Ice Cream",
      category: "desserts",
      description: "Vanilla dessert",
      priceCents: 600,
      imageUrl:
        "https://images.unsplash.com/photo-1501443762994-82bd5dace89a"
    }
  ])

  console.log("🌱 Products seeded with images + categories")
}