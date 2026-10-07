/* ============================================================
   PUBLICATION DATA — categories, authors, articles.

   ⚠️  PLACEHOLDER CONTENT. Every article, author and category below is
   sample copy so the publication can be designed and tested end to end:
     • articles are evergreen craft pieces with no real-world facts,
       quotes, statistics or named companies
     • authors are fictional (initial avatars — no photos)
     • images are stock photos
   Replace with real editorial before launch. Nothing here depends on a
   CMS: swap these arrays for a fetch from Sanity / Contentful / Strapi /
   Markdown and keep the shapes — the pages only use lib/publication.js.

   Article body blocks:
     { type: "p", text }  { type: "h2", text }
     { type: "quote", text, cite }  { type: "list", items: [] }
============================================================ */

export const CATEGORIES = [
  {
    "slug": "film-video",
    "label": "Film & Video",
    "description": "How stories are shot, cut and shipped — craft, pace and the people behind the frame.",
    "image": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80"
  },
  {
    "slug": "design",
    "label": "Design",
    "description": "Identity, systems and the small decisions that make brands feel like themselves.",
    "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=80"
  },
  {
    "slug": "technology",
    "label": "Technology",
    "description": "Tools, platforms and the web — what actually changes how creative work gets made.",
    "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80"
  },
  {
    "slug": "creator-economy",
    "label": "Creator Economy",
    "description": "Audiences, workflows and the business of making things people choose to watch.",
    "image": "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1600&q=80"
  },
  {
    "slug": "brand-business",
    "label": "Brand & Business",
    "description": "Pricing, briefs and partnerships — how good creative work gets commissioned and delivered.",
    "image": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80"
  },
  {
    "slug": "culture",
    "label": "Culture",
    "description": "Taste, attention and the ideas shaping what we make and what we pay attention to.",
    "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
  }
];

export const AUTHORS = [
  {
    "slug": "aanya-verma",
    "name": "Aanya Verma",
    "role": "Editor-in-Chief",
    "bio": "Aanya leads the OCT20FIVE Publication. She spent her early career cutting documentaries and short-form video, and writes about pacing, storytelling and why attention is earned rather than demanded.",
    "beats": [
      "film-video",
      "culture"
    ],
    "since": "2025",
    "links": {}
  },
  {
    "slug": "rohan-mehta",
    "name": "Rohan Mehta",
    "role": "Senior Writer, Design & Brand",
    "bio": "Rohan covers identity, design systems and the business of brand work. He is interested in the gap between a beautiful guideline and a brand people actually recognise.",
    "beats": [
      "design",
      "brand-business"
    ],
    "since": "2025",
    "links": {}
  },
  {
    "slug": "zoya-khan",
    "name": "Zoya Khan",
    "role": "Technology Reporter",
    "bio": "Zoya writes about the web, creative tooling and the quiet engineering decisions that shape how work feels to use. She prefers explaining things plainly over explaining them impressively.",
    "beats": [
      "technology",
      "culture"
    ],
    "since": "2026",
    "links": {}
  },
  {
    "slug": "kabir-sethi",
    "name": "Kabir Sethi",
    "role": "Creator Economy Correspondent",
    "bio": "Kabir reports on how independent creators and small teams plan, price and publish. His writing focuses on workflow, ownership and sustainable output.",
    "beats": [
      "creator-economy",
      "brand-business"
    ],
    "since": "2026",
    "links": {}
  }
];

export const ARTICLES = [
  {
    "slug": "why-the-first-three-seconds-decide-everything",
    "title": "Why the first three seconds decide everything",
    "dek": "The hook is not a trick. It is the promise that earns the rest of the video — and it has to be kept.",
    "category": "film-video",
    "author": "aanya-verma",
    "date": "2026-10-04",
    "image": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "Why the first three seconds decide everything",
    "tags": [
      "editing",
      "storytelling",
      "short-form"
    ],
    "lead": true,
    "featured": true,
    "body": [
      {
        "type": "p",
        "text": "Every edit begins with a quiet negotiation. The viewer is deciding, almost instantly, whether this is worth their time. The opening seconds are where that decision gets made, and no amount of polish later can win it back."
      },
      {
        "type": "p",
        "text": "The mistake is treating the hook as decoration. A loud first frame without a reason behind it only delays the moment of disappointment. The strongest openings do something simpler: they state the question the rest of the piece will answer."
      },
      {
        "type": "h2",
        "text": "Start with the tension"
      },
      {
        "type": "p",
        "text": "Look for the moment in the footage where something is at stake — a decision, a surprise, a contradiction. Open there, then earn the context. Viewers forgive being dropped into the middle far more readily than being made to wait."
      },
      {
        "type": "quote",
        "text": "A hook is a promise. The edit is how you keep it.",
        "cite": "OCT20FIVE Publication"
      },
      {
        "type": "p",
        "text": "Then check the promise at the end. If the final cut doesn't deliver what the opening implied, viewers notice — even if they can't say why. Tight openings only work when the whole structure is honest."
      }
    ]
  },
  {
    "slug": "the-case-for-the-slower-cut",
    "title": "The case for the slower cut",
    "dek": "Faster is not the same as better. Pace is a choice, and the best editors know when to let a shot breathe.",
    "category": "film-video",
    "author": "aanya-verma",
    "date": "2026-09-27",
    "image": "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "The case for the slower cut",
    "tags": [
      "editing",
      "pacing"
    ],
    "lead": false,
    "featured": false,
    "body": [
      {
        "type": "p",
        "text": "Somewhere along the way, fast became the default. Quick cuts feel energetic, and energy feels like retention. But rhythm is about contrast, and a piece that never slows down has nothing to speed up against."
      },
      {
        "type": "p",
        "text": "Slow moments do real work. They let an expression land, give the audience time to feel what just happened, and make the next cut hit harder. Removing every pause removes the part people remember."
      },
      {
        "type": "h2",
        "text": "How to find the right pace"
      },
      {
        "type": "list",
        "items": [
          "Cut to the emotion of the scene, not the length of the clip.",
          "Let the most important line finish before moving on.",
          "Vary the rhythm — a run of fast cuts earns one long hold."
        ]
      },
      {
        "type": "p",
        "text": "None of this means cutting slowly for its own sake. It means choosing, shot by shot, instead of letting a formula choose for you."
      }
    ]
  },
  {
    "slug": "consistency-is-a-design-decision",
    "title": "Consistency is a design decision, not a template",
    "dek": "Brands that feel coherent rarely got there by accident — and rarely by copying a layout.",
    "category": "design",
    "author": "rohan-mehta",
    "date": "2026-10-02",
    "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "Consistency is a design decision, not a template",
    "tags": [
      "brand",
      "systems"
    ],
    "lead": false,
    "featured": true,
    "body": [
      {
        "type": "p",
        "text": "When a brand feels instantly recognisable, it is tempting to credit a clever logo. More often it is the dull, repeated decisions: the same spacing, the same restraint, the same voice, applied everywhere including the places nobody checks."
      },
      {
        "type": "p",
        "text": "Templates promise consistency but deliver sameness. A real system names the choices — why this typeface, why this amount of space — so that the next person can make a new decision that still feels like the same brand."
      },
      {
        "type": "h2",
        "text": "Rules that travel"
      },
      {
        "type": "p",
        "text": "The most useful guidelines explain intent. 'Keep clear space around the logo' is a rule. 'Give the mark room because it is dense' is an idea someone can apply to a format you never imagined."
      },
      {
        "type": "p",
        "text": "Consistency, in the end, is a form of respect for the audience: it means they never have to relearn who you are."
      }
    ]
  },
  {
    "slug": "what-a-good-brand-book-actually-does",
    "title": "What a good brand book actually does",
    "dek": "It is not a rulebook for policing designers. It is a shared memory for everyone who will ever touch the brand.",
    "category": "design",
    "author": "rohan-mehta",
    "date": "2026-09-18",
    "image": "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "What a good brand book actually does",
    "tags": [
      "brand",
      "guidelines"
    ],
    "lead": false,
    "featured": false,
    "body": [
      {
        "type": "p",
        "text": "A brand book earns its place on the day someone new opens it. They should be able to find a colour, a typeface, a logo rule and a tone of voice within minutes — and understand why each one is there."
      },
      {
        "type": "p",
        "text": "The weakest ones read like legal documents. The strongest ones read like a conversation with the person who made the decisions, with examples of both right and wrong."
      },
      {
        "type": "h2",
        "text": "What to include"
      },
      {
        "type": "list",
        "items": [
          "The logo and how not to misuse it",
          "A small, confident colour palette with exact values",
          "One primary and one secondary typeface, with a clear hierarchy",
          "Real examples of the brand in use"
        ]
      },
      {
        "type": "p",
        "text": "Keep it short enough that people actually read it. A book nobody opens protects nothing."
      }
    ]
  },
  {
    "slug": "fast-websites-are-a-kindness",
    "title": "Fast websites are a kindness",
    "dek": "Speed is not a technical vanity metric. It is how a site treats the people waiting on the other end.",
    "category": "technology",
    "author": "zoya-khan",
    "date": "2026-10-03",
    "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "Fast websites are a kindness",
    "tags": [
      "web",
      "performance"
    ],
    "lead": false,
    "featured": true,
    "body": [
      {
        "type": "p",
        "text": "A slow page rarely announces itself as a problem. People just leave. They don't file a complaint; they close the tab, and the site never learns what it lost."
      },
      {
        "type": "p",
        "text": "Performance is usually a pile of small decisions: oversized images, scripts nobody remembers adding, fonts loaded three times. None of them feels important alone, which is exactly why they accumulate."
      },
      {
        "type": "h2",
        "text": "Where to look first"
      },
      {
        "type": "list",
        "items": [
          "Images — right size, right format, loaded only when needed",
          "Third-party scripts — every one has a cost",
          "Fonts — fewer files, loaded once"
        ]
      },
      {
        "type": "p",
        "text": "Treat speed as part of the design, not a final pass. A fast site feels more trustworthy before a single word is read."
      }
    ]
  },
  {
    "slug": "ai-is-changing-the-edit-bay-not-replacing-the-editor",
    "title": "AI is changing the edit bay, not replacing the editor",
    "dek": "New tools remove the tedious parts of post-production. The judgement still has to come from somewhere.",
    "category": "technology",
    "author": "zoya-khan",
    "date": "2026-09-22",
    "image": "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "AI is changing the edit bay, not replacing the editor",
    "tags": [
      "editing",
      "tools"
    ],
    "lead": false,
    "featured": false,
    "body": [
      {
        "type": "p",
        "text": "Much of an editor's day is not creative: syncing, logging, trimming, exporting in five ratios. Tools that take that work off the table are a genuine gain, and editors have good reason to welcome them."
      },
      {
        "type": "p",
        "text": "What they don't replace is the decision about what the piece is for. Choosing the take, the moment, the silence — these depend on a point of view, and a point of view is not a feature you can switch on."
      },
      {
        "type": "p",
        "text": "The useful question is not whether a tool can do a task, but whether doing it faster leaves more time for the decisions that matter. Used that way, new software makes the human part of the job bigger, not smaller."
      }
    ]
  },
  {
    "slug": "own-the-audience-rent-the-platform",
    "title": "Own the audience, rent the platform",
    "dek": "Platforms change their rules. The relationships you build directly are the ones that last.",
    "category": "creator-economy",
    "author": "kabir-sethi",
    "date": "2026-10-01",
    "image": "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "Own the audience, rent the platform",
    "tags": [
      "audience",
      "strategy"
    ],
    "lead": false,
    "featured": false,
    "body": [
      {
        "type": "p",
        "text": "Every platform is, in the end, someone else's building. It can be a wonderful place to find people, but the terms of the arrangement can change without notice and without asking you."
      },
      {
        "type": "p",
        "text": "That is why experienced creators keep one foot outside. An email list, a website, a direct way for people who like your work to reach you again — these are small assets that don't depend on anyone's algorithm."
      },
      {
        "type": "h2",
        "text": "Start small and direct"
      },
      {
        "type": "list",
        "items": [
          "Give people one clear way to follow you beyond the platform",
          "Publish something you control on a regular schedule",
          "Treat every new follower as a relationship, not a number"
        ]
      },
      {
        "type": "p",
        "text": "The platform finds the audience. Your own channel keeps it."
      }
    ]
  },
  {
    "slug": "batching-is-the-quiet-superpower-of-working-creators",
    "title": "Batching is the quiet superpower of working creators",
    "dek": "Making many things at once is less glamorous than making one thing perfectly — and far more sustainable.",
    "category": "creator-economy",
    "author": "kabir-sethi",
    "date": "2026-09-15",
    "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "Batching is the quiet superpower of working creators",
    "tags": [
      "workflow",
      "production"
    ],
    "lead": false,
    "featured": false,
    "body": [
      {
        "type": "p",
        "text": "Setting up a shoot, a studio or a workflow has a fixed cost. The first piece pays it; every extra piece made in the same session costs far less. That is the entire logic of batching."
      },
      {
        "type": "p",
        "text": "It also protects creative energy. Deciding what to make, filming it, editing it and publishing it are different kinds of work, and switching between them all day is quietly exhausting."
      },
      {
        "type": "p",
        "text": "Teams that publish steadily tend to separate the stages: plan together, capture together, edit in blocks. The result is not just more output, but calmer output."
      }
    ]
  },
  {
    "slug": "fixed-scope-pricing-builds-trust-faster-than-discounts",
    "title": "Fixed-scope pricing builds trust faster than discounts",
    "dek": "Clients rarely want the cheapest option. They want to know what they will pay and what they will get.",
    "category": "brand-business",
    "author": "rohan-mehta",
    "date": "2026-09-30",
    "image": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "Fixed-scope pricing builds trust faster than discounts",
    "tags": [
      "pricing",
      "clients"
    ],
    "lead": false,
    "featured": false,
    "body": [
      {
        "type": "p",
        "text": "Open-ended hourly billing leaves the client doing arithmetic they can't verify. Even honest numbers feel risky when the final total is unknown."
      },
      {
        "type": "p",
        "text": "A fixed scope turns that uncertainty into a decision. Here is what's included, here is the price, here is the timeline. Everyone can see where the edges are, which makes it easier to say yes."
      },
      {
        "type": "h2",
        "text": "Clarity over cleverness"
      },
      {
        "type": "p",
        "text": "The strongest packages are simple enough to explain in a sentence and specific enough that nobody argues later about what was promised."
      },
      {
        "type": "p",
        "text": "Discounts can win a first project. Clarity wins the second one."
      }
    ]
  },
  {
    "slug": "how-to-brief-a-creative-team",
    "title": "How to brief a creative team so you get what you meant",
    "dek": "Most disappointing work traces back to a brief that left out the one thing the client was assuming.",
    "category": "brand-business",
    "author": "kabir-sethi",
    "date": "2026-09-10",
    "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "How to brief a creative team so you get what you meant",
    "tags": [
      "briefs",
      "process"
    ],
    "lead": false,
    "featured": false,
    "body": [
      {
        "type": "p",
        "text": "A brief is not a formality; it is the first draft of the project. Whatever is missing from it will be filled in by the team's best guess, and guesses drift."
      },
      {
        "type": "h2",
        "text": "What a useful brief contains"
      },
      {
        "type": "list",
        "items": [
          "The goal — what should be different after this exists",
          "The audience — who it's for, and what they already know",
          "The constraints — budget, timeline, formats, must-haves",
          "References — one example you love and one you don't"
        ]
      },
      {
        "type": "p",
        "text": "The last item matters most. Showing what you dislike narrows the field faster than any adjective, and it saves a round of revisions."
      }
    ]
  },
  {
    "slug": "why-we-still-crave-the-handmade",
    "title": "Why we still crave the handmade in a generated world",
    "dek": "As making things becomes easier, the marks of a person behind the work become worth more.",
    "category": "culture",
    "author": "aanya-verma",
    "date": "2026-09-25",
    "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "Why we still crave the handmade in a generated world",
    "tags": [
      "taste",
      "craft"
    ],
    "lead": false,
    "featured": false,
    "body": [
      {
        "type": "p",
        "text": "When anything can be produced instantly, perfection stops being impressive. What stands out instead is evidence of intent: a choice, a mistake left in on purpose, a detail only someone who cared would add."
      },
      {
        "type": "p",
        "text": "This is not nostalgia. It is a reasonable response to abundance. People look for signs that someone spent attention on them, because attention is the one thing that stays scarce."
      },
      {
        "type": "quote",
        "text": "Craft is the visible trace of someone caring.",
        "cite": "OCT20FIVE Publication"
      },
      {
        "type": "p",
        "text": "For anyone making work, the lesson is encouraging: the more tools can do, the more your specific taste is worth."
      }
    ]
  },
  {
    "slug": "the-attention-economy-needs-better-editors",
    "title": "The attention economy needs better editors",
    "dek": "Feeds reward volume. Readers and viewers are quietly asking for someone to decide what is worth their time.",
    "category": "culture",
    "author": "zoya-khan",
    "date": "2026-09-12",
    "image": "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "The attention economy needs better editors",
    "tags": [
      "media",
      "curation"
    ],
    "lead": false,
    "featured": false,
    "body": [
      {
        "type": "p",
        "text": "There has never been more to watch, read or scroll. Abundance sounds like a gift until you notice how much of your day goes to deciding what deserves attention."
      },
      {
        "type": "p",
        "text": "Editing, in the broadest sense, is that decision made on someone else's behalf — and made well. It means cutting, ordering, framing and sometimes saying no."
      },
      {
        "type": "h2",
        "text": "What good curation looks like"
      },
      {
        "type": "p",
        "text": "A trustworthy editor is consistent about standards and open about choices. Over time, readers don't just follow the stories; they follow the judgement behind them."
      },
      {
        "type": "p",
        "text": "That judgement is the real product of a publication."
      }
    ]
  }
];
