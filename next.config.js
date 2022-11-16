module.exports = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      dns: false,
      tls: false,
      child_process: false,
      net: false
    };
    return config;
  },
  images: {
    domains: ['images.ctfassets.net']
  },
  publicRuntimeConfig: {
    homePage: {
      toursButton: 'Visit all tours',
      contactText: 'Let us help create your memories',
      contactButton: 'Contact us',
      menuButton: 'Check out full menu'
    },
    notFoundPage: {
      title: '404 Page',
      text: 'Oops! That page cannot be found :('
    },
    menuPage: {
      title: 'Menu',
      menuButton: 'Download Menu'
    },
    travelPage: {
      title: 'Travel with us'
    },
    slugPage: {
      timeTitle: 'Itinerary'
    },
    contactPage: {
      title: 'Contact us',
      formTitle: 'Let us know how we can help you',
      contactTitle: 'Contact',
      contactAddress: 'Address'
    },
    email: {
      host: 'smtp.gmail.com'
    },
    gallery: {
      title: 'Check our gallery'
    },
    footer: {
      title: 'Food and travel'
    }
  }
}
