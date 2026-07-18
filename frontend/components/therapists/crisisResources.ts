export interface CrisisContact {
  name: string;
  number: string;
  description: string;
  hours?: string;
}

// Verified against multiple official sources (Mental Health Uganda's own
// site/social account, Uganda Police Force). If this ever ships to real
// users, re-confirm these numbers first -- crisis information has to be
// exactly right.
export const UGANDA_CRISIS_CONTACTS: CrisisContact[] = [
  {
    name: "Mental Health Uganda — Toll-Free Helpline",
    number: "0800212121",
    description:
      "Free, confidential counselling for anyone struggling with their mental health.",
    hours: "Mon–Fri, 8:30am–5:00pm",
  },
  {
    name: "Uganda Police — Emergency",
    number: "999",
    description: "For immediate danger to life or safety.",
  },
  {
    name: "Butabika National Referral Hospital",
    number: "0414504388",
    description: "Uganda's national psychiatric hospital.",
  },
];

export interface HelpOrganization {
  name: string;
  description: string;
  url: string;
}

export const HELP_ORGANIZATIONS: HelpOrganization[] = [
  {
    name: "Mental Health Uganda",
    description:
      "Uganda's leading mental health advocacy organization, running the national toll-free helpline.",
    url: "https://mhu.ug/",
  },
  {
    name: "StrongMinds",
    description:
      "Treats depression in women and adolescents across Uganda and Zambia through group talk therapy.",
    url: "https://strongminds.org/",
  },
  {
    name: "Befrienders Worldwide",
    description:
      "A global network of emotional support helplines, if you're reaching out from outside Uganda.",
    url: "https://www.befrienders.org/",
  },
  {
    name: "Find A Helpline",
    description: "A worldwide directory to find a crisis line wherever you are.",
    url: "https://findahelpline.com/",
  },
];