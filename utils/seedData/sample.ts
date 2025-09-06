import { BRAND_STATUS } from "@/models/brand/Brand";
import { BrandData } from "./types";
import { USER_ROLES } from "@/models/role/Role";
import { getRandomProducts } from "./utils";

export const sampleBrands: BrandData[] = [
  {
    name: "Grab",
    description: "Southeast Asian super app",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Grab_%28application%29_logo.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Singapore",
    phoneNumber: "+65 6234 5678",
    company: "Grab Holdings Inc.",
    products: getRandomProducts(),
  },
  {
    name: "Amazon",
    description: "Global e-commerce and cloud computing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+1 206 266 1000",
    company: "Amazon.com, Inc.",
    products: getRandomProducts(),
  },
  {
    name: "Esprit",
    description: "Fashion and lifestyle brand",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/49/Esprit.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Germany",
    phoneNumber: "+49 211 3006 0",
    company: "Esprit Holdings Limited",
    products: getRandomProducts(),
  },
  {
    name: "Subway",
    description: "Fast food restaurant chain",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+1 203 877 4281",
    company: "Subway Restaurants",
    products: getRandomProducts(),
  },
  {
    name: "Lazada",
    description: "Online shopping platform",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Lazada_%282019%29.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Singapore",
    phoneNumber: "+65 6123 4567",
    company: "Lazada Singapore Pte Ltd",
    products: getRandomProducts(),
  },
  {
    name: "Kaspersky",
    description: "Cybersecurity and antivirus provider",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/25/Kaspersky_logo.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+7 495 797 8700",
    company: "Kaspersky Lab",
    products: getRandomProducts(),
  },
  {
    name: "Netflix",
    description: "Streaming entertainment service",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+1 866 579 7172",
    company: "Netflix, Inc.",
    products: getRandomProducts(),
  },
  {
    name: "Spotify",
    description: "Music streaming platform",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+46 8 510 520 00",
    company: "Spotify AB",
    products: getRandomProducts(),
  },
  {
    name: "Netflix 2",
    description: "Streaming entertainment service",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+1 866 579 7172",
    company: "Netflix, Inc.",
    products: getRandomProducts(),
  },
  {
    name: "Spotify 2",
    description: "Music streaming platform",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
    status: BRAND_STATUS.ACTIVE,
    country: "Global",
    phoneNumber: "+46 8 510 520 00",
    company: "Spotify AB",
    products: getRandomProducts(),
  },
];

export const sampleUserRoles = [
  {
    name: USER_ROLES.ADMIN,
  },
  {
    name: USER_ROLES.USER,
  }
]

export const sampleUser = {
  username: "admin",
  email: "admin@example.com",
  password: "1",
  role_id: sampleUserRoles.findIndex(r => r.name === USER_ROLES.ADMIN) + 1,
}

export const sampleUsers = [
  sampleUser
]
