import { Product } from "../models/Product"

export const seedProducts = async () => {
  const count = await Product.countDocuments()
  if (count > 0) return

  await Product.insertMany([
    {
      name: "Classic Burger",
      category: "burgers",
      description:
        "Artisan bread, choice of meat, cheddar cheese, tomato, European lettuce, onion, pickles and house sauce",
      priceCents: 1200,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=60",

      modifierGroups: [
        {
          id: "meat",
          name: "Choose your meat",
          required: true,
          min: 1,
          max: 1,
          options: [
            { id: "beef", name: "Beef", priceCents: 0 },
            { id: "chicken", name: "Chicken", priceCents: 0 },
            { id: "veggie", name: "Veggie patty", priceCents: 0 }
          ]
        },
        {
          id: "extras",
          name: "Add extras",
          required: false,
          min: 0,
          max: 5,
          options: [
            { id: "cheese", name: "Extra cheese", priceCents: 100 },
            { id: "bacon", name: "Bacon", priceCents: 200 },
            { id: "egg", name: "Fried egg", priceCents: 150 },
            { id: "double_meat", name: "Double meat", priceCents: 400 }
          ]
        },
        {
          id: "no",
          name: "Remove ingredients",
          required: false,
          min: 0,
          max: 6,
          options: [
            { id: "no_onion", name: "No onion", priceCents: 0 },
            { id: "no_pickles", name: "No pickles", priceCents: 0 },
            { id: "no_tomato", name: "No tomato", priceCents: 0 },
            { id: "no_lettuce", name: "No lettuce", priceCents: 0 },
            { id: "no_sauce", name: "No house sauce", priceCents: 0 }
          ]
        }
      ]
    }

    {
      name: "Chicken Wrap",
      category: "wraps",
      description: "Shredded Chicken Breast, Tomato, Mozzarella Cheese, Lettuce, and Mayonnaise.",
      priceCents: 1000,
      imageUrl:
        "https://images.unsplash.com/photo-1666819604634-98dd67634148?auto=format&fit=crop&w=600&q=6"
    },

    {
      name: "Fries",
      category: "sides",
      description: "Hot, crispy, and delicious. Enjoy our world-famous fries, from the first one to the last.",
      priceCents: 500,
      imageUrl:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f87?auto=format&fit=crop&w=600&q=6"
    },

    {
      name: "Pizza Margherita",
      category: "pizzas",
      description: "Simple yet perfect—that’s our Margarita. A tomato sauce base, buffalo mozzarella, basil, and extra-virgin olive oil",
      priceCents: 1500,
      imageUrl:
        "https://images.unsplash.com/photo-1573821663912-6df460f9c684?auto=format&fit=crop&w=600&q=6"
    },

    {
      name: "Salad Bowl",
      category: "salads",
      description: "Chicken tinga salad (mildly spicy), nachos, pico de gallo, guacamole, tomato, corn, lettuce, and house sauce.",
      priceCents: 900,
      imageUrl:
        "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=600&q=6"
    },

    {
      name: "Soda",
      category: "drinks",
      description: "Cold drink",
      priceCents: 300,
      imageUrl:
        "https://images.unsplash.com/photo-1629654613528-5d0a2e4166de?auto=format&fit=crop&w=600&q=6",
      modifierGroups: [
        {
          id: "type",
          name: "Type",
          required: true,
          min: 1,
          max: 1,
          options: [
            { id: "coke", name: "Coke", priceCents: 0 },
            { id: "pepsi", name: "Pepsi", priceCents: 0 },
            { id: "colombiana", name: "Colombiana", priceCents: 0 }
          ]
        }
      ]
    },

    {
      name: "Ice Cream",
      category: "desserts",
      description: "Vanilla dessert",
      priceCents: 600,
      imageUrl:
        "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=600&q=6",
      modifierGroups: [
        {
          id: "flavor",
          name: "Flavor",
          required: true,
          min: 1,
          max: 1,
          options: [
            { id: "vanilla", name: "Vanilla", priceCents: 0 },
            { id: "chocolate", name: "Chocolate", priceCents: 0 },
            { id: "strawberry", name: "Strawberry", priceCents: 0 }
          ]
        }
      ]
    }
  ])

  console.log("🌱 Products seeded with images + categories")
}