export const LEARNING_LEVELS = [
  {
    id: 1,
    title: "Alphabet Foundations I",
    description: "Learn basic signs A through M",
    category: "foundations",
    icon: "🟢",
    requiredXP: 0,
    signs: [
      { sign: "A", hint: "Make a fist with your thumb resting against the side of your index finger." },
      { sign: "B", hint: "Hold your hand flat with fingers together and thumb folded across your palm." },
      { sign: "C", hint: "Curve your fingers and thumb to form the shape of a 'C'." },
      { sign: "D", hint: "Hold up your index finger, curve other fingers to touch your thumb." },
      { sign: "E", hint: "Curl your fingers in to touch the tip of your thumb." },
      { sign: "F", hint: "Touch the tips of your index finger and thumb together, keep other fingers straight." },
      { sign: "G", hint: "Point your index finger and thumb forward, parallel to each other." },
      { sign: "H", hint: "Point your index and middle fingers forward, keep them together." },
      { sign: "I", hint: "Hold up your pinky finger, fold the rest of your fingers into a fist." },
      { sign: "J", hint: "Hold up your pinky finger and swoop it down in the shape of a 'J'." },
      { sign: "K", hint: "Point index and middle fingers up, spread them, put thumb between them." },
      { sign: "L", hint: "Form 'L' shape with thumb and index finger, tuck other fingers." },
      { sign: "M", hint: "Make a fist, tuck thumb under first three fingers." },
    ],
    subLevels: [
      { id: "1-1", type: "learn", title: "Watch & Learn" },
      { id: "1-2", type: "practice", title: "Try It Out" },
      { id: "1-3", type: "test", title: "AI Check" },
      { id: "1-4", type: "challenge", title: "Speed Round" }
    ]
  },
  {
    id: 2,
    title: "Alphabet Foundations II",
    description: "Learn signs N through Z",
    category: "foundations",
    icon: "🟢",
    requiredXP: 30,
    signs: [
      { sign: "N", hint: "Make a fist, tuck thumb under first two fingers." },
      { sign: "O", hint: "Curve fingers and thumb to make an 'O' shape." },
      { sign: "P", hint: "Like 'K', but point fingers downwards." },
      { sign: "Q", hint: "Like 'G', but point fingers downwards." },
      { sign: "R", hint: "Cross your middle finger over your index finger." },
      { sign: "S", hint: "Make a fist, wrap thumb across the front of your fingers." },
      { sign: "T", hint: "Make a fist, tuck thumb under index finger." },
      { sign: "U", hint: "Point index and middle fingers straight up, keep them together." },
      { sign: "V", hint: "Point index and middle fingers straight up, spread them apart." },
      { sign: "W", hint: "Point index, middle, and ring fingers up and spread apart." },
      { sign: "X", hint: "Make a hook shape with your index finger." },
      { sign: "Y", hint: "Extend pinky and thumb outward, curl other fingers." },
      { sign: "Z", hint: "Trace a 'Z' in the air with your index finger." }
    ],
    subLevels: [
      { id: "2-1", type: "learn", title: "Watch & Learn" },
      { id: "2-2", type: "practice", title: "Try It Out" },
      { id: "2-3", type: "test", title: "AI Check" },
      { id: "2-4", type: "challenge", title: "Speed Round" }
    ]
  },
  {
    id: 3,
    title: "Numbers 0-9",
    description: "Learn basic numbers",
    category: "numbers",
    icon: "🟡",
    requiredXP: 80,
    signs: [
      { sign: "0", hint: "Form an 'O' shape with your hand." },
      { sign: "1", hint: "Hold up just your index finger." },
      { sign: "2", hint: "Hold up your index and middle fingers (V shape)." },
      { sign: "3", hint: "Hold up your thumb, index, and middle fingers." },
      { sign: "4", hint: "Hold up four fingers, keep thumb tucked." },
      { sign: "5", hint: "Hold up all five fingers spread apart." },
      { sign: "6", hint: "Touch tip of pinky to tip of thumb." },
      { sign: "7", hint: "Touch tip of ring finger to tip of thumb." },
      { sign: "8", hint: "Touch tip of middle finger to tip of thumb." },
      { sign: "9", hint: "Touch tip of index finger to tip of thumb." }
    ],
    subLevels: [
      { id: "3-1", type: "learn", title: "Watch & Learn" },
      { id: "3-2", type: "practice", title: "Try It Out" },
      { id: "3-3", type: "test", title: "AI Check" },
      { id: "3-4", type: "challenge", title: "Speed Round" }
    ]
  },
  {
    id: 4,
    title: "Basic Words I",
    description: "Important daily words",
    category: "words",
    icon: "🟡",
    requiredXP: 150,
    signs: [
      { sign: "Hello", hint: "Salute gesture from forehead outward." },
      { sign: "Yes", hint: "Make a fist and nod it up and down." },
      { sign: "No", hint: "Tap first two fingers to your thumb." },
      { sign: "ThankYou", hint: "Fingers from chin outward towards the person." },
      { sign: "Sorry", hint: "Rub a fist in a circle over your chest." }
    ],
    subLevels: [
      { id: "4-1", type: "learn", title: "Watch & Learn" },
      { id: "4-2", type: "practice", title: "Try It Out" },
      { id: "4-3", type: "test", title: "AI Check" },
      { id: "4-4", type: "challenge", title: "Speed Round" }
    ]
  },
  {
    id: 5,
    title: "Basic Words II",
    description: "More important daily words",
    category: "words",
    icon: "🟠",
    requiredXP: 250,
    signs: [
      { sign: "Please", hint: "Rub a flat hand in a circle over your chest." },
      { sign: "Help", hint: "Place closed fist on open palm and lift both up." },
      { sign: "Good", hint: "Fingers from chin down to other hand." },
      { sign: "Bad", hint: "Fingers from chin down and flip hand over." },
      { sign: "More", hint: "Tap fingertips of both hands together repeatedly." }
    ],
    subLevels: [
      { id: "5-1", type: "learn", title: "Watch & Learn" },
      { id: "5-2", type: "practice", title: "Try It Out" },
      { id: "5-3", type: "test", title: "AI Check" },
      { id: "5-4", type: "challenge", title: "Speed Round" }
    ]
  },
  {
    id: 6,
    title: "Daily Actions I",
    description: "Common daily actions",
    category: "actions",
    icon: "🟠",
    requiredXP: 370,
    signs: [
      { sign: "Eat", hint: "Tap pinched fingers to mouth." },
      { sign: "Drink", hint: "Mime holding a cup to your mouth." },
      { sign: "Go", hint: "Point both index fingers forward simultaneously." },
      { sign: "Come", hint: "Gesture with both index fingers towards yourself." },
      { sign: "Stop", hint: "Bring one hand down sharply onto the palm of another." }
    ],
    subLevels: [
      { id: "6-1", type: "learn", title: "Watch & Learn" },
      { id: "6-2", type: "practice", title: "Try It Out" },
      { id: "6-3", type: "test", title: "AI Check" },
      { id: "6-4", type: "challenge", title: "Speed Round" }
    ]
  },
  {
    id: 7,
    title: "Daily Actions II",
    description: "Expressing needs and feelings",
    category: "actions",
    icon: "🔵",
    requiredXP: 510,
    signs: [
      { sign: "Want", hint: "Bring hands towards you, curling fingers inwards." },
      { sign: "Need", hint: "Hooked index finger moving downwards." },
      { sign: "Like", hint: "Pull thumb and middle finger away from chest." },
      { sign: "Love", hint: "Cross both arms over your chest." },
      { sign: "Friend", hint: "Hook index fingers together, then switch." }
    ],
    subLevels: [
      { id: "7-1", type: "learn", title: "Watch & Learn" },
      { id: "7-2", type: "practice", title: "Try It Out" },
      { id: "7-3", type: "test", title: "AI Check" },
      { id: "7-4", type: "challenge", title: "Speed Round" }
    ]
  },
  {
    id: 8,
    title: "Basic Phrases",
    description: "Putting words together",
    category: "phrases",
    icon: "🔵",
    requiredXP: 670,
    signs: [
      { sign: "I am fine", hint: "Point to self, then sign 'fine' (thumb of open hand to chest)." },
      { sign: "Thank you", hint: "Fingers from chin outward towards the person." },
      { sign: "How are you", hint: "Hands roll outwards, then point to the person." }
    ],
    subLevels: [
      { id: "8-1", type: "learn", title: "Watch & Learn" },
      { id: "8-2", type: "practice", title: "Try It Out" },
      { id: "8-3", type: "test", title: "AI Check" },
      { id: "8-4", type: "challenge", title: "Speed Round" }
    ]
  },
  {
    id: 9,
    title: "Conversations",
    description: "Introducing yourself",
    category: "conversation",
    icon: "🔴",
    requiredXP: 860,
    signs: [
      { sign: "My name is", hint: "Sign 'my', then 'name' (tap H hands together twice)." },
      { sign: "Nice to meet you", hint: "Slide flat hand over other flat hand, then sign 'meet' (bring two pointing index fingers together)." }
    ],
    subLevels: [
      { id: "9-1", type: "learn", title: "Watch & Learn" },
      { id: "9-2", type: "practice", title: "Try It Out" },
      { id: "9-3", type: "test", title: "AI Check" },
      { id: "9-4", type: "challenge", title: "Speed Round" }
    ]
  },
  {
    id: 10,
    title: "Mastery Challenge",
    description: "Mixed review of all signs",
    category: "mastery",
    icon: "🔴",
    requiredXP: 1080,
    signs: [], // Will be dynamically generated from all previous 
    subLevels: [
      { id: "10-1", type: "learn", title: "Mastery Review" },
      { id: "10-2", type: "practice", title: "Try It Out" },
      { id: "10-3", type: "test", title: "AI Check" },
      { id: "10-4", type: "challenge", title: "Ultimate Speed Round" }
    ]
  }
];
