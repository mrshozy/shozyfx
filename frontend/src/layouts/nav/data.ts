export const AppName = "ShozyFx"

export const NavFeatures: { title: string; href: string; description: string }[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description:
      "A dashboard view that show that has tool to assist you on your trade.",
  },
  {
    title: "Live Forex Rates",
    href: "/",
    description:
      "Get real-time updates on currency exchange rates to stay informed about the latest market movements.",
  },
  {
    title: "Forex Analytics",
    href: "/",
    description:
      "Access powerful tools and analytics to analyze market trends, identify potential trade opportunities, and make informed trading decisions.",
  },
  {
    title: "Currency Converter",
    href: "/",
    description:
      "Easily convert between different currencies with our user-friendly currency converter tool.",
  },
  {
    title: "Forex News Feed",
    href: "/",
    description:
      "Stay updated with the latest news and events impacting the forex market, helping you make timely and strategic trading decisions.",
  },
  {
    title: "Trading Signals",
    href: "/",
    description:
      "Receive valuable trading signals and insights to enhance your trading strategy and improve your overall trading performance.",
  },
]

export const PLANS = [
  {
    name: 'Free',
    slug: 'free',
    quota: 10,
    pagesPerPdf: 5,
    price: {
      amount: 0,
      priceIds: {
        test: '',
        production: '',
      },
    },
  },
  {
    name: 'Pro',
    slug: 'pro',
    quota: 50,
    pagesPerPdf: 25,
    price: {
      amount: 14,
      priceIds: {
        test: 'price_1NuEwTA19umTXGu8MeS3hN8L',
        production: '',
      },
    },
  },
]