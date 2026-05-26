import { Product } from "../models/Product"

export const seedProducts = async () => {
  const count = await Product.countDocuments()
  if (count > 0) return

  await Product.insertMany([
    {
      name: "Classic Burger",
      category: "burgers",
      description:
        "Artisan bread, choice of meat, cheddar cheese, tomato, lettuce, onion, pickles and house sauce",
      priceCents: 1200,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=60",

      modifierGroups: [
        {
          id: "protein",
          name: "Protein",
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
          id: "toppings",
          name: "Toppings",
          required: false,
          min: 0,
          max: 3,
          options: [
            { id: "cheese", name: "Extra cheese", priceCents: 100 },
            { id: "bacon", name: "Bacon", priceCents: 200 },
            { id: "egg", name: "Fried egg", priceCents: 150 }
          ]
        },
        {
          id: "sauces",
          name: "Sauces",
          required: false,
          min: 0,
          max: 3,
          options: [
            { id: "ketchup", name: "Ketchup", priceCents: 0 },
            { id: "bbq", name: "BBQ sauce", priceCents: 0 },
            { id: "garlic", name: "Garlic mayo", priceCents: 0 }
          ]
        }
      ]
    },

    {
      name: "Wrap Deluxe",
      category: "wraps",
      description:
        "Grilled protein wrap with fresh veggies and sauces",
      priceCents: 1000,
      imageUrl:
        "https://images.unsplash.com/photo-1666819604634-98dd67634148?auto=format&fit=crop&w=600&q=60",

      modifierGroups: [
        {
          id: "protein",
          name: "Protein",
          required: true,
          min: 1,
          max: 1,
          options: [
            { id: "chicken", name: "Chicken", priceCents: 0 },
            { id: "beef", name: "Beef", priceCents: 100 }
          ]
        },
        {
          id: "toppings",
          name: "Toppings",
          required: false,
          min: 0,
          max: 3,
          options: [
            { id: "lettuce", name: "Lettuce", priceCents: 0 },
            { id: "tomato", name: "Tomato", priceCents: 0 },
            { id: "cheese", name: "Cheese", priceCents: 100 }
          ]
        },
        {
          id: "sauces",
          name: "Sauces",
          required: false,
          min: 0,
          max: 4,
          options: [
            { id: "mayo", name: "Mayonnaise", priceCents: 0 },
            { id: "spicy", name: "Spicy sauce", priceCents: 0 },
            { id: "ketchup", name: "Ketchup", priceCents: 0 },
            { id: "bbq", name: "BBQ sauce", priceCents: 0 }
          ]
        }
      ]
    },

    {
      name: "Fries",
      category: "sides",
      description: "Hot crispy fries",
      priceCents: 500,
      imageUrl:
        "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=600&q=6"
    },

    {
      name: "Pizza Margherita",
      category: "pizzas",
      description: "Tomato sauce, mozzarella and basil",
      priceCents: 1500,
      imageUrl:
        "https://images.unsplash.com/photo-1573821663912-6df460f9c684?auto=format&fit=crop&w=600&q=6"
    },

    {
      name: "Salad Bowl",
      category: "salads",
      description: "Fresh salad bowl with chicken and veggies",
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
          id: "size",
          name: "Size",
          required: true,
          min: 1,
          max: 1,
          options: [
            { id: "small", name: "Small", priceCents: 0 },
            { id: "medium", name: "Medium", priceCents: 50 },
            { id: "large", name: "Large", priceCents: 100 }
          ]
        }
      ]
    },

    {
      name: "Ice Cream",
      category: "desserts",
      description: "Creamy ice cream",
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

  console.log("Products seeded (7 items, 2 with full modifier structure)")
}