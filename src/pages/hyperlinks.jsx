import { useState, useEffect } from "react";
import Head from "next/head";
import s from "../styles/Hyperlinks.module.css";

const CATS = [
  {
    id: "spaces",
    label: "Creative tech spaces",
    icon: "✦",
    ic: "icSpaces",
    items: [
      {
        n: "School for Poetic Computation",
        url: "https://sfpc.study/",
        d: "Art, code, hardware, critical theory",
      },
      {
        n: "Recurse Center",
        url: "https://www.recurse.com/",
        d: "Self-directed retreat for programmers",
      },
      {
        n: "Eyebeam",
        url: "https://eyebeam.org/",
        d: "Residencies and fellowships for artists working with tech",
      },
      {
        n: "Onassis ONX",
        url: "https://www.onx.studio/",
        d: "Platform for art and advanced tech, NYC + Athens",
      },
      {
        n: "Harvestworks",
        url: "https://www.harvestworks.org/",
        d: "Digital media arts center",
      },
      {
        n: "SVA Visible Futures Lab",
        url: "https://sva.edu/features/sva-visible-futures-lab",
        d: "Fabrication and emerging tech for artists",
      },
      {
        n: "Cybernetics Library",
        url: "https://www.cyberneticslibrary.org/",
        d: "Artist-run browsing library, open events monthly",
      },
      {
        n: "WAVEFIELD",
        url: "https://wavefield.media/",
        d: "Video art and media education space, Brooklyn",
      },
      {
        n: "Strother School",
        url: "https://www.schoolofattention.org/",
        d: "School of Radical Attention",
      },
      {
        n: "Betaworks",
        url: "https://betaworks.com/",
        d: "VC events and community programs",
      },
      {
        n: "tiat (This Is Art And Technology)",
        url: "https://www.tiat.place/",
        d: "SF and NYC creative tech events and gallery space",
      },
      {
        n: "Index",
        url: "https://www.index-space.org/",
        d: "Community coworking, Chinatown + Greenpoint",
      },
      {
        n: "Side Quest",
        url: "https://www.instagram.com/sidequestnyc/",
        d: "Small coworking space",
      },
      {
        n: "LARPA (@larpa.mill)",
        url: "https://www.instagram.com/larpa.mill/",
        d: "",
      },
      {
        n: "TELEPATHY",
        url: "https://www.instagram.com/telepathy.nyc/",
        d: "@telepathy.nyc",
      },
      {
        n: "BRIC",
        url: "https://bricartsmedia.org/",
        d: "Arts, media, and community programming in Downtown Brooklyn",
      },
      {
        n: "Flux Factory",
        url: "https://www.fluxfactory.org/",
        d: "Artist collective and residency in Long Island City, since 1994",
      },
      {
        n: "CultureHub",
        url: "https://www.culturehub.org/",
        d: "Global art and technology community, founded by SeoulArts and La MaMa",
      },
      {
        n: "Manufacture New York",
        url: "https://manufactureny.org/",
        d: "Fashion and wearable tech fabrication hub",
      },
      {
        n: "Loisaida Center",
        url: "https://loisaida.org/",
        d: "Community arts center in the East Village",
      },
    ],
  },
  {
    id: "maker",
    label: "Makerspaces",
    icon: "⚙",
    ic: "icMaker",
    items: [
      {
        n: "NYC Resistor",
        url: "https://www.nycresistor.com/",
        d: "Hacker collective in Boerum Hill",
      },
      {
        n: "Hack Manhattan",
        url: "https://hackmanhattan.com/",
        d: "All-volunteer hackerspace, open Tues + Thurs",
      },
      {
        n: "fat cat FAB LAB",
        url: "https://fatcatfablab.org/",
        d: "Community fabrication lab",
      },
      {
        n: "MakerSpace NYC",
        url: "https://makerspace.nyc/",
        d: "Brooklyn Army Terminal",
      },
      {
        n: "SancuComputer",
        url: "https://sancu.computer/",
        d: "Community computer space",
      },
      {
        n: "Hex House",
        url: "https://hexhouse.studio/",
        d: "Hosts Synth Library NYC",
      },
      {
        n: "glub glub labs",
        url: "https://www.instagram.com/glubglublabs/",
        d: "Friend studio next to Hex House",
      },
      {
        n: "Repair Café El Barrio",
        url: "https://repaircafe.org/en/",
        d: "Community repair",
      },
      {
        n: "Brooklyn Repair Cafe",
        url: "https://www.eventbrite.com/o/brooklyn-repair-cafe-14155737285",
        d: "Community repair",
      },
      {
        n: "Brooklyn Spark",
        url: "https://brooklynspark.org/",
        d: "Volunteer-run makerspace in Bushwick",
      },
    ],
  },
  {
    id: "textile",
    label: "Textile + craft",
    icon: "✂",
    ic: "icTextile",
    items: [
      {
        n: "Textile Arts Center",
        url: "https://textileartscenter.com/",
        d: "Classes, residency, community",
        b: "textile",
      },
      {
        n: "Craftwork Collective",
        url: "https://www.instagram.com/craftwork_collective/",
        d: "Textile-focused studio",
        b: "textile",
      },
      {
        n: "Electronic Textile Camp",
        url: "https://www.electronictextile.camp/",
        d: "Artist-run US residency for e-textile practitioners",
        b: "textile",
      },
      {
        n: "eTextile Summer Camp",
        url: "https://etextile-summercamp.org/",
        d: "Annual gathering in France for the global e-textile community",
        b: "textile",
      },
      {
        n: "KOBAKANT",
        url: "https://www.kobakant.at/DIY/",
        d: "Hannah Perner-Wilson and Mika Satomi's e-textile reference wiki",
        b: "textile",
      },
    ],
  },
  {
    id: "events",
    label: "Recurring events",
    icon: "◎",
    ic: "icEvents",
    items: [
      {
        n: "livecode.nyc",
        url: "https://livecode.nyc/",
        d: "Monthly events for live coders",
      },
      {
        n: "Word hack",
        url: "https://www.wonderville.nyc/",
        d: "Monthly show at Wonderville exploring language and code",
      },
      {
        n: "DAT LAB NYC",
        url: "https://www.instagram.com/datlabnyc/",
        d: "Monthly Touch Designer meetup",
      },
      {
        n: "ZeroSpace",
        url: "https://www.instagram.com/zerospace.nyc/",
        d: "Comfy UI and Touch Designer meetups",
      },
      {
        n: "Critical Hit",
        url: "https://www.instagram.com/criticalhitparty/",
        d: "Trans-centered gamer party",
      },
      {
        n: "Aci-d club",
        url: "https://www.instagram.com/aci.d.club/",
        d: "Design group meetup",
      },
      {
        n: "DEMO festival",
        url: "https://www.demofestival.org/",
        d: "Annual festival at the New Museum",
      },
      {
        n: "2600",
        url: "https://www.2600.com/",
        d: "Quarterly zine + monthly midtown meetings",
      },
    ],
  },
  {
    id: "community",
    label: "Community + social",
    icon: "♡",
    ic: "icCommunity",
    items: [
      {
        n: "Wonderville",
        url: "https://www.wonderville.nyc/",
        d: "Indie arcade bar and event space",
      },
      {
        n: "Ridgewood Commons",
        url: "https://www.instagram.com/ridgewoodcommons/",
        d: "Leftist community center, dinner every Sunday",
      },
      {
        n: "Underground Art and Design",
        url: "https://www.instagram.com/uaad.art/",
        d: "Periodic events (@uaad.art)",
      },
      {
        n: "RECESS",
        url: "https://www.recessart.org/",
        d: "Brooklyn art space for artist projects in public",
      },
    ],
  },
  {
    id: "itp",
    label: "ITP-adjacent",
    icon: "◇",
    ic: "icItp",
    items: [
      {
        n: "ITP / IMA",
        url: "https://itp.nyu.edu/itp/",
        d: "The home base",
        b: "check",
      },
      {
        n: "NYU Game Center",
        url: "https://gamecenter.nyu.edu/",
        d: "Games, play, and interactive media",
      },
      {
        n: "Creative Coding NYC (CCNYC)",
        url: "https://ccnyc.space/",
        d: "Weekly meetup open to all",
        b: "recurring",
      },
      {
        n: "src (@src__nyc)",
        url: "https://www.instagram.com/src__nyc/",
        d: "Small group of ITP alumni",
      },
      {
        n: "Creative Computing Club House",
        url: "https://ccchbk.github.io/_CCCHBK/",
        d: "John-Henry Thompson's Brooklyn project",
      },
      {
        n: "eTextile Spring Break",
        url: "https://etextilespringbreak.org/",
        d: "Annual NYC e-textile gathering",
        b: "recurring",
      },
    ],
  },
  {
    id: "xr",
    label: "XR + immersive",
    icon: "◈",
    ic: "icXr",
    items: [
      {
        n: "XR Motion",
        url: "https://www.instagram.com/xrmotion.nyc/",
        d: "XR and motion arts community",
      },
      {
        n: "XR Guild",
        url: "https://xrguild.org/",
        d: "Extended reality practitioners",
      },
      {
        n: "CuteLab NYC",
        url: "https://www.instagram.com/cutelabnyc/",
        d: "Audio and immersive events",
      },
    ],
  },
  {
    id: "hacker",
    label: "Hacker + infosec",
    icon: "⊡",
    ic: "icHacker",
    items: [
      {
        n: "NYC Resistor",
        url: "https://www.nycresistor.com/",
        d: "Hacker collective, open craft nights",
      },
      {
        n: "HOPE",
        url: "https://www.hope.net/",
        d: "Hackers On Planet Earth, annual NYC conference",
      },
      { n: "DEF CON", url: "https://defcon.org/", d: "Annual, Las Vegas" },
      {
        n: "Black Hat",
        url: "https://www.blackhat.com/",
        d: "Annual, Las Vegas",
      },
      {
        n: "Noisebridge",
        url: "https://www.noisebridge.net/wiki",
        d: "SF hackerspace, sister to NYC Resistor",
      },
      {
        n: "c-base",
        url: "https://www.c-base.org/",
        d: "One of the world's first hackerspaces, crashed space station mythology, Berlin 1995",
      },
      {
        n: "Metalab",
        url: "https://metalab.at/",
        d: "Influential Viennese hackerspace, helped inspire the US hackerspace movement",
      },
      {
        n: "Hackspace Wiki",
        url: "https://wiki.hackerspaces.org/",
        d: "Global directory of hackerspaces",
      },
    ],
  },
  {
    id: "online",
    label: "Online",
    icon: "⌁",
    ic: "icOnline",
    items: [
      {
        n: "Neocities",
        url: "https://neocities.org/",
        d: "Modern Geocities revival",
        b: "online",
      },
      {
        n: "Rhizome",
        url: "https://rhizome.org/",
        d: "New media art hub since 1996",
        b: "online",
      },
      {
        n: "FELT Zine",
        url: "https://feltzine.us",
        d: "Online art and zine community",
        b: "online",
      },
      {
        n: "Metalabel",
        url: "https://metalabel.com/",
        d: "Marketplace for creative works",
        b: "online",
      },
      {
        n: "collabfund",
        url: "https://collabfund.com/",
        d: "Human-centered tech VC",
      },
      {
        n: "HTML Energy",
        url: "https://html.energy/",
        d: "Laurel Schwulst and Elliott Cost's celebration of handwritten HTML",
        b: "online",
      },
      {
        n: "Ultralight School",
        url: "https://ultralight.school/",
        d: "Laurel Schwulst's art and design learning initiative, NYC",
        b: "online",
      },
      {
        n: "OpenProcessing",
        url: "https://openprocessing.org/",
        d: "Community for p5.js and Processing sketches",
        b: "online",
      },
      {
        n: "Are.na",
        url: "https://www.are.na/",
        d: "Collaborative mood-boarding for the internet-conscious",
        b: "online",
      },
      {
        n: "sanctuary.computer",
        url: "https://www.sanctuary.computer/",
        d: "Creative technology studio and development shop",
        b: "online",
      },
      {
        n: "Astoria links",
        url: "https://astoria.app/links/",
        d: "Hyperlink directory for creative computing and local community projects",
        b: "online",
      },
    ],
  },
  {
    id: "global",
    label: "Outside NYC",
    icon: "✈",
    ic: "icGlobal",
    items: [
      {
        n: "Ars Electronica",
        url: "https://ars.electronica.art/",
        d: "Annual festival + museum, Linz Austria",
      },
      {
        n: "Chaos Communication Conference",
        url: "https://www.ccc.de/en/",
        d: "Annual, Hamburg",
      },
      { n: "Buro Stedelijk", url: "https://burostedelijk.nl/", d: "Amsterdam" },
      {
        n: "REINCANTAMENTO",
        url: "https://www.instagram.com/reincantamento/",
        d: "Research + publishing, Berlin / Turin / Venice",
      },
      {
        n: "Gray Area",
        url: "https://grayarea.org/",
        d: "SF-based, classes online",
      },
      {
        n: "NØ SCHOOL NEVERS",
        url: "https://noschoolnevers.com/",
        d: "France",
      },
      {
        n: "Bit Summit",
        url: "https://bitsummit.org/",
        d: "Annual indie games festival, Kyoto",
      },
      {
        n: "MAGFest",
        url: "https://magfest.org/",
        d: "Music and Gaming Festival",
      },
      {
        n: "The Rhizome House",
        url: "https://www.instagram.com/rhizomehouse/",
        d: "Cleveland Heights, OH",
      },
      {
        n: "Stochastic Labs",
        url: "https://stochasticlabs.org/",
        d: "Residencies, Berkeley",
      },
      {
        n: "Mad Sci SF",
        url: "https://www.madscisf.com/",
        d: "ITP alumni space, SF",
      },
      {
        n: "Creative Coding Utrecht",
        url: "https://creativecodingutrecht.nl/",
        d: "Meetups, Netherlands",
      },
      {
        n: "Post Office Amsterdam",
        url: "https://postoffice.amsterdam/",
        d: "Co-working, Amsterdam",
      },
      {
        n: "fidgetcamp",
        url: "https://fidgetcamp.com/",
        d: "SF ITPCamp-esque",
      },
      { n: "demos.club", url: "https://demos.club/", d: "Demos and chill" },
      {
        n: "DINACon",
        url: "https://www.dinacon.org/",
        d: "Digital naturalism conference",
      },
      {
        n: "Open Hardware Summit",
        url: "https://www.oshwa.org/",
        d: "Annual conference",
      },
      {
        n: "Feelers",
        url: "https://www.instagram.com/feelers.sg/",
        d: "Singapore",
      },
      {
        n: "Iffy Books",
        url: "https://iffybooks.net/",
        d: "Bookshop and workshop space for hacking, free culture, and zines — Philadelphia",
      },
      {
        n: "Untitled Games Event",
        url: "https://www.instagram.com/untitledgamesevent/",
        d: "Monthly indie game talks, Amsterdam",
      },
      {
        n: "Fablab Network",
        url: "https://fabfoundation.org/",
        d: "Global network of fabrication labs",
      },
      {
        n: "Eyeo Festival",
        url: "https://eyeofestival.com/",
        d: "Annual gathering for creative coders, Minneapolis",
      },
      {
        n: "Thinking Machines",
        url: "https://thinkingmachines.xyz/",
        d: "Brussels — art and emerging tech",
      },
      {
        n: "Radio Snack",
        url: "https://radiosnack.ca/",
        d: "Membership-based DIY tech, textiles, and creative community space, Montréal",
      },
      {
        n: "SAT Montréal",
        url: "https://sat.qc.ca/en/",
        d: "Digital culture centre with 360 Satosphère dome, residencies, and research",
      },
      {
        n: "InterAccess",
        url: "https://interaccess.org/",
        d: "Gallery, studio, and education for art and technology in Toronto, est. 1983",
      },
      {
        n: "Milieux Institute",
        url: "https://milieux.concordia.ca/",
        d: "Concordia research institute for arts, culture, and technology",
      },
      {
        n: "OCAD University",
        url: "https://www.ocadu.ca/",
        d: "Canada largest art and design university, Toronto",
      },
      {
        n: "Emily Carr University",
        url: "https://www.ecuad.ca/",
        d: "Art and design university in Vancouver",
      },
      {
        n: "Vector Festival",
        url: "https://vectorfestival.org/",
        d: "Annual Toronto festival for digital games and interactive art",
      },
      {
        n: "Eastern Bloc",
        url: "https://easternbloc.ca/",
        d: "Artist-run centre for electronic and digital arts in Montréal",
      },
      {
        n: "Centre des arts actuels Skol",
        url: "https://skol.ca/",
        d: "Artist-run centre for contemporary art in Montréal",
      },
      {
        n: "Site 3 coLaboratory",
        url: "https://site3.ca/",
        d: "Toronto artist-run makerspace and collaborative lab",
      },
    ],
  },
  {
    id: "movement",
    label: "Social movements",
    icon: "☆",
    ic: "icMovement",
    items: [
      {
        n: "S.T.O.P.",
        url: "https://www.stopspying.org/",
        d: "Surveillance Technology Oversight Project",
      },
      {
        n: "Summer of Ludd",
        url: "https://summerofludd.com/",
        d: "Annual community festival in NYC dedicated to offline presence and anti-surveillance organizing",
      },
      {
        n: "DeFlock",
        url: "https://deflock.me/",
        d: "License plate reader opt-out",
      },
      {
        n: "NYC Off Tech",
        url: "https://www.instagram.com/nycofftech/",
        d: "Unplugging from surveillance tech",
      },
      {
        n: "Tech Workers Coalition",
        url: "https://techworkerscoalition.org/",
        d: "Unionizing tech workers",
      },
      {
        n: "Beta NYC",
        url: "https://betanyc.org/",
        d: "Helping NYers access tech and information",
      },
    ],
  },
  {
    id: "dev",
    label: "Dev + open source",
    icon: "⌘",
    ic: "icDev",
    items: [
      {
        n: "p5.js",
        url: "https://p5js.org/",
        d: "Creative coding library for the web",
      },
      {
        n: "ml5.js",
        url: "https://ml5js.org/",
        d: "Friendly machine learning for the web",
      },
      {
        n: "Processing Foundation",
        url: "https://processingfoundation.org/",
        d: "Stewards of Processing and p5.js",
      },
      {
        n: "OpenFrameworks",
        url: "https://openframeworks.cc/",
        d: "Open source C++ toolkit for creative coding",
      },
      {
        n: "Adafruit",
        url: "https://www.adafruit.com/",
        d: "Open source hardware, tutorials, and community",
      },
      {
        n: "SparkFun",
        url: "https://www.sparkfun.com/",
        d: "Electronics and maker education",
      },
      {
        n: "OSHWA",
        url: "https://www.oshwa.org/",
        d: "Open Source Hardware Association",
      },
      {
        n: "Observable",
        url: "https://observablehq.com/",
        d: "Notebooks for data visualization and creative code",
      },
      {
        n: "Hydra",
        url: "https://hydra.ojack.xyz/",
        d: "Browser-based live coding video synth by Olivia Jack",
      },
      {
        n: "TidalCycles",
        url: "https://tidalcycles.org/",
        d: "Live coding environment for music and patterns",
      },
      {
        n: "Sonic Pi",
        url: "https://sonic-pi.net/",
        d: "Code-based music creation for all",
      },
      {
        n: "Pure Data",
        url: "https://puredata.info/",
        d: "Open source visual programming for audio and more",
      },
      {
        n: "Max/MSP",
        url: "https://cycling74.com/",
        d: "Visual programming for music, audio, and media",
      },
      {
        n: "AYAB",
        url: "https://ayab-knitting.com/",
        d: "All Yarns Are Beautiful — open source machine knitting",
      },
      {
        n: "Tracery",
        url: "https://tracery.io/",
        d: "Generative text grammar tool by Kate Compton",
      },
      {
        n: "Tone.js",
        url: "https://tonejs.github.io/",
        d: "Web audio framework for interactive music",
      },
    ],
  },
  {
    id: "fabrication",
    label: "Fabrication + materials",
    icon: "◭",
    ic: "icFab",
    items: [
      {
        n: "Powerhouse Arts",
        url: "https://powerhousearts.org/",
        d: "Ceramics, print, metalwork, and public art fab in Gowanus",
      },
      {
        n: "UrbanGlass",
        url: "https://urbanglass.org/",
        d: "17,000 sq ft glass studio in Brooklyn — blowing, neon, flameworking",
      },
      {
        n: "Brooklyn Glass",
        url: "https://brooklynglass.com/",
        d: "Artist-owned glass studio with hourly rentals and classes",
      },
      {
        n: "MakerSpace NYC",
        url: "https://www.makerspace.nyc/",
        d: "Welding, blacksmithing, ceramics, CNC, waterjet at Brooklyn Army Terminal",
      },
      {
        n: "Brooklyn Metal Works",
        url: "https://www.bkmetalworks.com/",
        d: "Jewelry and metalsmithing classes and studio access",
      },
      {
        n: "Craftsman Ave",
        url: "https://craftsmanave.com/",
        d: "Woodworking, metalworking, welding, knife making workshops in Brooklyn",
      },
      {
        n: "Gasworks NYC",
        url: "https://gasworksnyc.com/",
        d: "Community clay studio with 24/7 membership, South Slope",
      },
      {
        n: "Sculpture Space NYC",
        url: "https://www.sculpturespacenyc.com/",
        d: "Ceramics studio, residency, and gallery",
      },
      {
        n: "Brooklyn Clay Industries",
        url: "https://www.brooklynclayindustries.com/",
        d: "Pottery studio and classes at the Brooklyn Navy Yard",
      },
    ],
  },
  {
    id: "bio",
    label: "Bio + science",
    icon: "⬡",
    ic: "icBio",
    items: [
      {
        n: "Genspace",
        url: "https://www.genspace.org/",
        d: "World's first community biology lab, Sunset Park Brooklyn",
      },
      {
        n: "BioBAT Art Space",
        url: "https://www.biobatartspace.com/",
        d: "Bioart space at the Brooklyn Army Terminal",
      },
      {
        n: "Biodesign Challenge",
        url: "https://biodesignchallenge.org/",
        d: "Annual competition for students designing with biology",
      },
      {
        n: "iGEM",
        url: "https://igem.org/",
        d: "International Genetically Engineered Machine Foundation",
      },
      {
        n: "DIYbio",
        url: "https://diybio.org/",
        d: "Global network of community biology labs",
      },
      {
        n: "Fab City Foundation",
        url: "https://fab.city/",
        d: "Global initiative for locally productive cities",
      },
    ],
  },
  {
    id: "print",
    label: "Print + zine",
    icon: "⊞",
    ic: "icPrint",
    items: [
      {
        n: "Printed Matter",
        url: "https://www.printedmatter.org/",
        d: "NYC institution for artists' books and zines, Chelsea + East Village",
      },
      {
        n: "Secret Riso Club",
        url: "https://secretrisoclub.com/",
        d: "Risograph printing studio and community",
      },
      {
        n: "SVA RisoLAB",
        url: "https://risolab.sva.edu/",
        d: "Risograph educational facility with classes and open studio",
      },
      {
        n: "Interference Archive",
        url: "https://interferencearchive.org/",
        d: "Community archive of cultural materials from social movements",
      },
      {
        n: "8-Ball Community",
        url: "https://8ballcommunity.club/",
        d: "East Village zine community and archive",
      },
      {
        n: "Endless Editions",
        url: "https://www.endlesseditions.com/",
        d: "Publishing and curatorial initiative + Brooklyn Art Book Fair",
      },
      {
        n: "Quimby's Bookstore NYC",
        url: "https://www.quimbys.com/",
        d: "Independent zine and comics shop in Williamsburg",
      },
      {
        n: "Wendy's Subway",
        url: "https://wendyssubway.com/",
        d: "Radical library and community space in Bushwick",
      },
      {
        n: "NY Art Book Fair",
        url: "https://www.printedmatter.org/artbookfair",
        d: "Annual international artists' book fair by Printed Matter",
      },
      {
        n: "Desert Island",
        url: "https://desertislandbrooklyn.com/",
        d: "Comics and zine shop in Williamsburg",
      },
      {
        n: "Radix Media",
        url: "https://radixmedia.org/",
        d: "Worker-owned print shop and publisher in Brooklyn",
      },
      {
        n: "Primary Information",
        url: "https://primaryinformation.org/",
        d: "Nonprofit publisher of artists' books and writings",
      },
      {
        n: "Robert Blackburn Printmaking Workshop",
        url: "https://www.efanyc.org/robert-blackburn-printmaking-workshop",
        d: "Community printmaking studio and archive, Manhattan",
      },
    ],
  },
  {
    id: "rip",
    label: "Graveyard",
    icon: "☽",
    ic: "icRip",
    items: [
      {
        n: "Glitch",
        url: "https://glitch.com/",
        d: "Browser-based coding, community hosting — shut down 2025",
        b: "rip",
      },
      {
        n: "Babycastles",
        url: "https://babycastles.com/",
        d: "NYC event space — Discord still lives",
        b: "rip",
      },
      {
        n: "Pulsewave",
        url: "https://www.pulsewave.org/",
        d: "Chiptune concerts at Babycastles, 2007–2017",
        b: "rip",
      },
      {
        n: "Internet Yami-Ichi",
        url: "https://yami-ichi.biz/",
        d: "Internet craft market, 2012–2023",
        b: "rip",
      },
    ],
  },
];

const BADGE_LABEL = {
  textile: "textiles",
  recurring: "recurring",
  online: "online",
  rip: "RIP",
  check: "verified",
};

export default function Hyperlinks() {
  const [theme, setTheme] = useState("light");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("electrodex-theme");
    if (saved) {
      setTheme(saved);
      return;
    }
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(sys);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("electrodex-theme", next);
  };

  const filtered = CATS.filter((cat) => active === "all" || active === cat.id)
    .map((cat) => {
      const seen = new Set();
      const items = cat.items.filter((i) => {
        if (seen.has(i.n)) return false;
        seen.add(i.n);
        const q = query.toLowerCase();
        return (
          !q ||
          i.n.toLowerCase().includes(q) ||
          (i.d || "").toLowerCase().includes(q)
        );
      });
      return { ...cat, items };
    })
    .filter((cat) => cat.items.length > 0);

  const total = filtered.reduce((acc, cat) => acc + cat.items.length, 0);

  const badgeClass = {
    textile: s.bTextile,
    recurring: s.bRecurring,
    online: s.bOnline,
    rip: s.bRip,
    check: s.bCheck,
  };

  const iconClass = {
    icItp: s.icItp,
    icSpaces: s.icSpaces,
    icMaker: s.icMaker,
    icTextile: s.icTextile,
    icEvents: s.icEvents,
    icCommunity: s.icCommunity,
    icXr: s.icXr,
    icHacker: s.icHacker,
    icOnline: s.icOnline,
    icGlobal: s.icGlobal,
    icMovement: s.icMovement,
    icDev: s.icDev,
    icFab: s.icFab,
    icPrint: s.icPrint,
    icBio: s.icBio,
    icRip: s.icRip,
  };

  return (
    <>
      <Head>
        <title>electrodex — hyperlinks</title>
        <meta
          name="description"
          content="A field guide to spaces, tools, and communities for creative technologists — NYC and beyond."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght=300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={s.page} data-theme={theme}>
        <header className={s.header}>
          <button
            className={s.themeBtn}
            onClick={toggleTheme}
            aria-label="Toggle visual layout theme"
          >
            {theme === "dark" ? (
              <span className={s.btnIcon}>☼</span>
            ) : (
              <span className={s.btnIcon}>☾</span>
            )}
            {theme === "dark" ? "light" : "dark"}
          </button>
          <p className={s.eyebrow}>electrocute.io / hyperlinks</p>
          <h1 className={s.title}>electrodex</h1>
          <p className={s.tagline}>
            a field guide to spaces, tools, and communities for creative
            technologists — NYC and beyond.
          </p>
        </header>

        <div className={s.controls}>
          <div className={s.searchWrap}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className={s.searchInput}
              placeholder="Search spaces…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className={s.pills}>
            {[
              { id: "all", label: "all" },
              ...CATS.map((c) => ({ id: c.id, label: c.label })),
            ].map((f) => (
              <button
                key={f.id}
                className={`${s.pill} ${active === f.id ? s.pillActive : ""}`}
                onClick={() => setActive(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className={s.metaBar}>{total > 0 ? `${total} spaces` : ""}</div>

        <main className={s.main}>
          {filtered.length === 0 ? (
            <div className={s.empty}>
              nothing found for &ldquo;{query}&rdquo; — yet ♡
            </div>
          ) : (
            filtered.map((cat) => (
              <div
                key={cat.id}
                className={`${s.section} ${s[`sec-${cat.id}`] || ""}`}
              >
                <div className={s.secHeader}>
                  <div
                    className={`${s.secIcon} ${iconClass[cat.ic] || ""}`}
                    aria-hidden="true"
                  >
                    {cat.icon}
                  </div>
                  <span className={s.secLabel}>{cat.label}</span>
                  <div className={s.secRule} />
                </div>
                <div className={s.grid}>
                  {cat.items.map((item) => (
                    <div key={item.n} className={s.card}>
                      <div className={s.cardContent}>
                        <div className={s.cardName}>
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.n}
                            </a>
                          ) : (
                            item.n
                          )}
                          {item.b && (
                            <span
                              className={`${s.badge} ${badgeClass[item.b] || ""}`}
                            >
                              {BADGE_LABEL[item.b]}
                            </span>
                          )}
                        </div>
                        {item.d && <p className={s.cardDesc}>{item.d}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </>
  );
}
