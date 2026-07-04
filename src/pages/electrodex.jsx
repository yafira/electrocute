import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import s from "../styles/Electrodex.module.css";

const CATS = [
  {
    id: "spaces",
    label: "creative tech spaces",
    tint: "#F6CFE0",
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
        d: "Creative tech gallery and salons, 151 Powell St, San Francisco",
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
        n: "Loisaida Center",
        url: "https://loisaida.org/",
        d: "Community arts center in the East Village",
      },
    ],
  },
  {
    id: "maker",
    label: "makerspaces",
    tint: "#BFDCF5",
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
    label: "textile + craft",
    tint: "#BFEBD8",
    items: [
      {
        n: "Textile Arts Center",
        url: "https://textileartscenter.com/",
        d: "Classes, residency, community",
      },
      {
        n: "Craftwork Collective",
        url: "https://www.instagram.com/craftwork_collective/",
        d: "Textile-focused studio",
      },
      {
        n: "Electronic Textile Camp",
        url: "https://www.electronictextile.camp/",
        d: "Artist-run US residency for e-textile practitioners",
      },
      {
        n: "eTextile Summer Camp",
        url: "https://etextile-summercamp.org/",
        d: "Annual gathering in France for the global e-textile community",
      },
      {
        n: "KOBAKANT",
        url: "https://www.kobakant.at/DIY/",
        d: "Hannah Perner-Wilson and Mika Satomi's e-textile reference wiki",
      },
    ],
  },
  {
    id: "events",
    label: "recurring events",
    tint: "#F7E8B5",
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
        d: "NEW INC's annual art, design, and tech festival at the New Museum",
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
    label: "community + social",
    tint: "#F6CFE0",
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
    tint: "#BFDCF5",
    items: [
      { n: "ITP / IMA", url: "https://itp.nyu.edu/itp/", d: "The home base" },
      {
        n: "NYU Game Center",
        url: "https://gamecenter.nyu.edu/",
        d: "Games, play, and interactive media",
      },
      {
        n: "Creative Coding NYC (CCNYC)",
        url: "https://ccnyc.space/",
        d: "Weekly meetup open to all",
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
        d: "Annual NY e-textile gathering",
      },
    ],
  },
  {
    id: "xr",
    label: "XR + immersive",
    tint: "#BFEBD8",
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
    label: "hacker + infosec",
    tint: "#F7E8B5",
    items: [
      {
        n: "NYC Resistor (craft nights)",
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
    label: "online",
    tint: "#F6CFE0",
    items: [
      {
        n: "Neocities",
        url: "https://neocities.org/",
        d: "Modern Geocities revival",
      },
      {
        n: "Rhizome",
        url: "https://rhizome.org/",
        d: "New media art hub since 1996",
      },
      {
        n: "FELT Zine",
        url: "https://feltzine.us",
        d: "Online art and zine community",
      },
      {
        n: "Metalabel",
        url: "https://metalabel.com/",
        d: "Marketplace for creative works",
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
      },
      {
        n: "Ultralight School",
        url: "https://ultralight.school/",
        d: "Laurel Schwulst's art and design learning initiative, NYC",
      },
      {
        n: "OpenProcessing",
        url: "https://openprocessing.org/",
        d: "Community for p5.js and Processing sketches",
      },
      {
        n: "Are.na",
        url: "https://www.are.na/",
        d: "Collaborative mood-boarding for the internet-conscious",
      },
      {
        n: "sanctuary.computer",
        url: "https://www.sanctuary.computer/",
        d: "Creative technology studio and development shop",
      },
      {
        n: "Astoria Tech Meetup",
        url: "https://astoria.app/",
        d: "Volunteer-run tech meetup and community in Astoria, Queens",
      },
    ],
  },
  {
    id: "global",
    label: "outside NYC",
    tint: "#BFDCF5",
    items: [
      {
        n: "Ars Electronica",
        url: "https://ars.electronica.art/",
        d: "Annual festival + museum, Linz Austria",
      },
      {
        n: "Chaos Communication Congress",
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
        d: "Co-op makerspace in NOPA, SF",
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
      {
        n: "demos.club",
        url: "https://demos.club/",
        d: "Demos & Chill, SF show-and-tell series",
      },
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
        d: "Bookshop and workshop space for hacking, free culture, and zines, Philadelphia",
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
        n: "Thinking Machines",
        url: "https://thinkingmachines.xyz/",
        d: "Brussels, art and emerging tech",
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
        d: "Canada's largest art and design university, Toronto",
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
    label: "social movements",
    tint: "#BFEBD8",
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
        d: "Crowdsourced map of automated license plate readers",
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
    label: "dev + open source",
    tint: "#F7E8B5",
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
        d: "All Yarns Are Beautiful, open source machine knitting",
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
    label: "fabrication + materials",
    tint: "#F6CFE0",
    items: [
      {
        n: "Powerhouse Arts",
        url: "https://powerhousearts.org/",
        d: "Ceramics, print, metalwork, and public art fab in Gowanus",
      },
      {
        n: "UrbanGlass",
        url: "https://urbanglass.org/",
        d: "17,000 sq ft glass studio in Brooklyn: blowing, neon, flameworking",
      },
      {
        n: "Brooklyn Glass",
        url: "https://brooklynglass.com/",
        d: "Artist-owned glass studio with hourly rentals and classes",
      },
      {
        n: "MakerSpace NYC (fab)",
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
        d: "Woodworking, metalworking, welding, knife making workshops in Industry City",
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
    label: "bio + science",
    tint: "#BFEBD8",
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
    label: "print + zine",
    tint: "#BFDCF5",
    items: [
      {
        n: "Printed Matter",
        url: "https://www.printedmatter.org/",
        d: "NYC institution for artists' books and zines, Chelsea",
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
        d: "Zine library, radio, and public access TV, archive now in Chinatown",
      },
      {
        n: "Endless Editions",
        url: "https://www.endlesseditions.com/",
        d: "Publishing and curatorial initiative + Brooklyn Art Book Fair",
      },
      {
        n: "Quimby's Bookstore NYC",
        url: "https://quimbysnyc.com/",
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
    label: "graveyard",
    tint: "#DDD6E8",
    items: [
      {
        n: "Glitch",
        url: "https://glitch.com/",
        d: "Browser-based coding, community hosting, shut down 2025",
      },
      {
        n: "Babycastles",
        url: "https://babycastles.com/",
        d: "NYC event space, Discord still lives",
      },
      {
        n: "Pulsewave",
        url: "https://www.pulsewave.org/",
        d: "Chiptune concerts at Babycastles, 2007–2017",
      },
      {
        n: "Internet Yami-Ichi",
        url: "https://yami-ichi.biz/",
        d: "Internet craft market, 2012–2023",
      },
      {
        n: "Eyeo Festival",
        url: "https://eyeofestival.com/",
        d: "Creative coding festival in Minneapolis, 2011–2022, on indefinite hiatus",
      },
      {
        n: "Manufacture New York",
        d: "Fashion and wearable tech fabrication hub, closed; old domain is now spam",
      },
    ],
  },
];

const hexAddr = (catIdx, i) =>
  "0x" +
  ((catIdx + 1) * 0x100 + i * 0x18).toString(16).toUpperCase().padStart(4, "0");

export default function Electrodex() {
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

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return CATS.map((cat, catIdx) => ({ ...cat, catIdx }))
      .filter((cat) => active === "all" || active === cat.id)
      .map((cat) => {
        const seen = new Set();
        const items = cat.items.filter((i) => {
          if (seen.has(i.n)) return false;
          seen.add(i.n);
          return (
            !q ||
            i.n.toLowerCase().includes(q) ||
            (i.d || "").toLowerCase().includes(q)
          );
        });
        return { ...cat, items };
      })
      .filter((cat) => cat.items.length > 0);
  }, [query, active]);

  const total = filtered.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <>
      <Head>
        <title>electrodex</title>
        <meta
          name="description"
          content="electrodex: a singly linked list of spaces, tools, and communities for creative technologists — NYC and beyond."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={s.page} data-theme={theme}>
        <div className={s.wrap}>
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
            <p className={s.eyebrow}>electrocute.io / electrodex</p>
            <h1 className={s.title}>
              electrodex<span className={s.caret}>*</span>
            </h1>
            <p className={s.decl}>
              <span className={s.kw}>struct</span> node {"{"}{" "}
              <span className={s.str}>data</span>: a space for creative
              technologists; <span className={s.str}>next</span>: →; {"}"}
              <br />a singly linked list, NYC and beyond.
            </p>
          </header>

          <div className={s.controls}>
            <div className={s.searchWrap}>
              <span className={s.prompt}>⌖</span>
              <input
                type="search"
                className={s.searchInput}
                placeholder="traverse the list…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                aria-label="Search spaces"
              />
            </div>
            <div className={s.pills}>
              {[{ id: "all", label: "all", tint: "#7C5FD3" }, ...CATS].map(
                (f) => (
                  <button
                    key={f.id}
                    className={`${s.pill} ${active === f.id ? s.pillActive : ""}`}
                    onClick={() => setActive(f.id)}
                  >
                    <span className={s.dot} style={{ background: f.tint }} />
                    {f.label}
                  </button>
                ),
              )}
            </div>
            <div className={s.metaBar}>
              {total > 0 ? (
                <>
                  lists: <span className={s.num}>{filtered.length}</span> ·
                  nodes: <span className={s.num}>{total}</span>
                </>
              ) : (
                ""
              )}
            </div>
          </div>

          <main>
            {filtered.length === 0 ? (
              <div className={s.empty}>
                <span className={s.fn}>find(&ldquo;{query}&rdquo;)</span>{" "}
                returned null — yet ♡
              </div>
            ) : (
              filtered.map((cat) => (
                <section key={cat.id} className={s.listSec}>
                  <div className={s.listHead}>
                    <span className={s.listName}>{cat.label}</span>
                    <span className={s.listCount}>
                      .length = {cat.items.length}
                    </span>
                  </div>

                  <div className={s.headPtr}>
                    <span className={s.headLbl}>head ●</span>
                  </div>
                  <div className={s.headStemRow}>
                    <span className={s.stem} />
                  </div>

                  <div className={s.chain}>
                    {cat.items.map((item, i) => {
                      const isLast = i === cat.items.length - 1;
                      const tintFaint = cat.tint + "33";
                      return (
                        <div className={s.nodeRow} key={item.n}>
                          <div
                            className={s.node}
                            style={{
                              "--nodeTint": cat.tint,
                              "--nodeTintFaint": tintFaint,
                            }}
                          >
                            <div className={s.dataCell}>
                              <div className={s.addr}>
                                {hexAddr(cat.catIdx, i)}
                              </div>
                              <div className={s.name}>
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
                              </div>
                              {item.d && <p className={s.desc}>{item.d}</p>}
                            </div>
                            <div className={s.nextCell}>
                              <span className={s.nextLbl}>next</span>
                              {isLast ? (
                                <span className={`${s.nextVal} ${s.nextNull}`}>
                                  ∅
                                </span>
                              ) : (
                                <span className={s.nextVal}>
                                  {hexAddr(cat.catIdx, i + 1)}
                                </span>
                              )}
                            </div>
                          </div>
                          {!isLast && (
                            <div className={s.link} aria-hidden="true">
                              <span className={s.wire} />
                              <span className={s.tip}>▼</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className={s.nullChip}>
                    <span>tail →</span>
                    <span className={s.nullBox}>∅ null</span>
                  </div>
                </section>
              ))
            )}
          </main>
        </div>
      </div>
    </>
  );
}
