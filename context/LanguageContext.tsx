import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'sv';

// Dictionary of all text in the app
const translations = {
  en: {
    common: {
      loading: "Loading...",
      next: "Next",
      back: "Back",
      submit: "Submit",
      cancel: "Cancel",
      pay: "Pay",
      details: "Details",
      close: "Close",
      processing: "Processing...",
    },
    nav: {
      tours: "Tours",
      myPages: "My Pages",
      dashboard: "Dashboard",
      crm: "CRM & Bookings",
      signIn: "Sign In",
      switchGuest: "Switch to Guest",
      switchAdmin: "Demo: Login as Admin",
      loggedInAs: "Logged in as",
    },
    home: {
      heroTitle: "Discover the Nordic Wild",
      heroSubtitle: "Unforgettable expeditions and guided tours in Sweden's most spectacular landscapes.",
      exploreBtn: "Explore Tours",
      upcomingTitle: "Upcoming Adventures",
      trustedBy: "Trusted by Adventurers",
      level: "Level",
      days: "Days",
      spotsLeft: "spots left",
      next: "Next",
    },
    tourDetails: {
      about: "About this adventure",
      highlights: "Highlights",
      itinerary: "Itinerary",
      day: "Day",
      bookCardTitle: "Book this tour",
      nextDeparture: "Next Departure",
      securePayment: "Secure payment via Stripe",
      freeCancel: "Free cancellation up to 30 days",
      bookNow: "Book Now",
      startingFrom: "Starting from",
      maxPeople: "Max 12 People",
      guideIncluded: "Professional guide included",
    },
    booking: {
      steps: {
        overview: "Overview",
        details: "Your Details",
        payment: "Payment",
        done: "Done",
      },
      customize: {
        title: "Customize your trip",
        subtitle: "Select date and travelers for",
        departureDate: "Departure Date",
        travelers: "Number of Travelers",
        people: "people",
      },
      payer: {
        title: "Step 1: Who is paying?",
        tooltip: "The booking confirmation and receipt will be sent to this person.",
        firstName: "First Name",
        lastName: "Last Name",
        country: "Country",
        address: "Street Address",
        zip: "Zip Code",
        city: "City",
        phone: "Phone",
        email: "Email",
      },
      traveler: {
        sectionTitle: "Traveler Information",
        title: "Traveler",
        sameAsPayer: "Same person as payer",
        ssn: "Date of Birth / SSN (8 digits)",
        companion: "Travel Companion (Optional)",
        companionPlaceholder: "Enter details of your travel companion if any",
        preferences: "Room Preferences & Dietary Requirements",
        preferencesPlaceholder: "E.g., Vegetarian, Double bed request...",
      },
      payment: {
        title: "Payment Details",
        scheduleTitle: "Payment Schedule",
        payNow: "Pay Now (Deposit)",
        payLater: "Remaining Balance",
        dueToday: "Due Today",
        dueLater: "Due 60 days before trip",
        cardDetails: "Credit Card",
        cardNumber: "Card number",
        expiry: "MM / YY",
        cvc: "CVC",
        holderName: "Cardholder Name",
        agree: "I agree to the",
        terms: "Booking Terms",
        privacy: "Privacy Policy",
        payBtn: "Pay Deposit",
        nextStep: "Next Step",
      },
      confirmation: {
        title: "Booking Confirmed!",
        subtitle: "Your adventure is secured.",
        ref: "Booking Reference",
        totalPaid: "Total Paid Now",
        remaining: "Remaining Balance",
        emailSent: "A confirmation email has been sent to",
        homeBtn: "Back to Home",
        myPagesBtn: "Go to My Pages",
      },
      summary: {
        title: "Summary",
        product: "Product",
        date: "Date",
        travelers: "Travelers",
        totalPrice: "Total Price",
        toPay: "To Pay",
        vatMsg: "Includes VAT and booking fees.",
        secureMsg: "Secure SSL Payment",
      }
    },
    myPages: {
      title: "My Pages",
      welcome: "Welcome back! Manage your upcoming trips here.",
      upcoming: "Upcoming Trips",
      noTrips: "No upcoming trips booked yet.",
    },
    footer: {
      tagline: "Premium guided tours and expeditions in Scandinavia.",
      support: "Support",
      contact: "Contact Us",
      faq: "FAQ",
      cancelPolicy: "Avbokningsregler",
      secure: "Säkra Betalningar",
      rights: "Alla rättigheter förbehållna.",
    }
  },
  sv: {
    common: {
      loading: "Laddar...",
      next: "Nästa",
      back: "Tillbaka",
      submit: "Skicka",
      cancel: "Avbryt",
      pay: "Betala",
      details: "Detaljer",
      close: "Stäng",
      processing: "Bearbetar...",
    },
    nav: {
      tours: "Turer",
      myPages: "Mina Sidor",
      dashboard: "Panel",
      crm: "Bokningar & CRM",
      signIn: "Logga in",
      switchGuest: "Byt till gäst",
      switchAdmin: "Demo: Logga in som Admin",
      loggedInAs: "Inloggad som",
    },
    home: {
      heroTitle: "Upptäck Nordens Vildmark",
      heroSubtitle: "Oförglömliga expeditioner och guidade turer i Sveriges mest spektakulära landskap.",
      exploreBtn: "Utforska Turer",
      upcomingTitle: "Kommande Äventyr",
      trustedBy: "Betrodd av Äventyrare",
      level: "Nivå",
      days: "Dagar",
      spotsLeft: "platser kvar",
      next: "Nästa",
    },
    tourDetails: {
      about: "Om äventyret",
      highlights: "Höjdpunkter",
      itinerary: "Resplan",
      day: "Dag",
      bookCardTitle: "Boka denna tur",
      nextDeparture: "Nästa Avresa",
      securePayment: "Säker betalning via Stripe",
      freeCancel: "Gratis avbokning upp till 30 dagar",
      bookNow: "Boka Nu",
      startingFrom: "Från",
      maxPeople: "Max 12 Personer",
      guideIncluded: "Professionell guide inkluderad",
    },
    booking: {
      steps: {
        overview: "Översikt",
        details: "Dina uppgifter",
        payment: "Betalning",
        done: "Klart",
      },
      customize: {
        title: "Skräddarsy din resa",
        subtitle: "Välj datum och resenärer för",
        departureDate: "Avresedatum",
        travelers: "Antal resenärer",
        people: "personer",
      },
      payer: {
        title: "Steg 1: Vem betalar?",
        tooltip: "Bokningsbekräftelsen och kvittot skickas till denna person.",
        firstName: "Förnamn",
        lastName: "Efternamn",
        country: "Land",
        address: "Gatuadress",
        zip: "Postnummer",
        city: "Ort",
        phone: "Telefon",
        email: "E-post",
      },
      traveler: {
        sectionTitle: "Resenärsinformation",
        title: "Resenär",
        sameAsPayer: "Samma person som betalar",
        ssn: "Födelsedatum / Personnr (8 siffror)",
        companion: "Resesällskap (Valfritt)",
        companionPlaceholder: "Ange detaljer om ditt resesällskap",
        preferences: "Rumsönskemål & Kost",
        preferencesPlaceholder: "T.ex. Vegetarian, Dubbelsäng...",
      },
      payment: {
        title: "Betalningsuppgifter",
        scheduleTitle: "Betalningsplan",
        payNow: "Betala nu (Anmälningsavgift)",
        payLater: "Kvarstående belopp",
        dueToday: "Betalas idag",
        dueLater: "Betalas 60 dagar innan avresa",
        cardDetails: "Kreditkort",
        cardNumber: "Kortnummer",
        expiry: "MM / ÅÅ",
        cvc: "CVC",
        holderName: "Kortinnehavarens namn",
        agree: "Jag godkänner",
        terms: "Bokningsvillkor",
        privacy: "Integritetspolicy",
        payBtn: "Betala Anmälningsavgift",
        nextStep: "Nästa Steg",
      },
      confirmation: {
        title: "Bokning Bekräftad!",
        subtitle: "Ditt äventyr är säkrat.",
        ref: "Bokningsreferens",
        totalPaid: "Totalt betalat nu",
        remaining: "Kvarstående belopp",
        emailSent: "Ett bekräftelsemail har skickats till",
        homeBtn: "Tillbaka till start",
        myPagesBtn: "Gå till Mina Sidor",
      },
      summary: {
        title: "Sammanfattning",
        product: "Produkt",
        date: "Datum",
        travelers: "Resenärer",
        totalPrice: "Totalt Pris",
        toPay: "Att betala",
        vatMsg: "Inkluderar moms och avgifter.",
        secureMsg: "Säker SSL-betalning",
      }
    },
    myPages: {
      title: "Mina Sidor",
      welcome: "Välkommen tillbaka! Hantera dina kommande resor här.",
      upcoming: "Kommande Resor",
      noTrips: "Inga kommande resor bokade än.",
    },
    footer: {
      tagline: "Premium guidade turer och expeditioner i Skandinavien.",
      support: "Support",
      contact: "Kontakta oss",
      faq: "FAQ",
      cancelPolicy: "Avbokningsregler",
      secure: "Säkra Betalningar",
      rights: "Alla rättigheter förbehållna.",
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children?: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Helper function to get nested object value by string key (e.g. 'nav.tours')
  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path} in language: ${language}`);
        return path;
      }
      current = current[key];
    }
    
    return typeof current === 'string' ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};