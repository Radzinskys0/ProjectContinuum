// Inline markup: **bold**, _italic_. "\n" inside lines/list items renders as a line break.
export type Block = string | { list: string[] } | { lines: string[] }

export type RulesSection = { title: string; blocks: Block[] }

export const RULES: RulesSection[] = [
  {
    title: "Converting Stat Parameter Letter Grades",
    blocks: [
      { lines: ["**E - 1**", "**D - 2**", "**C - 3**", "**B - 4**", "**A - 5**", "**EX - 6**"] },
      "**Plus or minus +1 or -1**",
    ],
  },
  {
    title: "LCK Saving Throw Bonus",
    blocks: [
      {
        lines: [
          "E - D: No effect",
          "C - B: Reroll a saving throw once per rest",
          "A - EX: Automatically pass a saving throw once per rest",
        ],
      },
    ],
  },
  {
    title: "Maximum Hit Points",
    blocks: [
      "A Servant’s Max HP is determined by their Class Recipient:",
      {
        list: [
          "Saber: 100 + (10 x END)",
          "Lancer: 100 + (10 x END)",
          "Archer: 100 + (10 x END)",
          "Rider: 100 + (10 x END)",
          "Caster: 80 + (10 x END)",
          "Assassin: 90 + (10 x END)",
          "Berserker: 110 + (10 x END)",
          "Extra Classes: 100 + (10 x END)",
        ],
      },
    ],
  },
  {
    title: "Armor Class",
    blocks: [
      "A Servant’s Base AC is 10 + AGL",
      "**Heavy Armor**",
      "Servants wearing heavy armor have 18 base AC and do not add their AGL modifier to their AC.",
      "**Medium Armor**",
      "Servants wearing medium armor have 15 base AC and can only gain a +2 bonus to their AC from AGL.",
      "**Light Armor**",
      "Servants wearing light armor have their base AC raised to 11.",
    ],
  },
  {
    title: "EX Rank Stat Parameter",
    blocks: [
      {
        lines: [
          "Unless stated otherwise, Servant Stat parameters cannot reach EX Rank artificially.",
          "EX Rank can only be reached either by the base parameters of a Servant’s vessel, exceptional skills that are stated can elevate a Servant’s stat to this Rank or NPs.",
          "If an A Ranked stat gets upgraded three times by a ‘+’ Rank up, they are eligible to ‘EX’, up to the creator’s discretion.",
        ],
      },
      "Canonically, EX rank is considered ‘unmeasurable’, but in this format it will be represented by a numerical value of ‘8’ instead of ‘6’ to differentiate from ‘A+’.",
      "Any stat bonifiers to an EX Rank stat will be represented by EX(x), with ‘x’ being its numerical value, for easy readability.",
    ],
  },
  {
    title: "Strength and Power",
    blocks: [
      "The STR parameter encapsulates the raw physical power of a creature. In this format, Servants with a STR rank of EX will be treated differently.",
      "If not already stated, servants with EX STR roll STR checks and saving throws with advantage and ignore size disadvantages.",
    ],
  },
  {
    title: "Endurance and Resilience",
    blocks: [
      "The END parameter encapsulates the unyielding durability of a creature. In this format, Servants with an END rank of EX will be treated differently.",
      "If not already stated, once per rest, the Servant may sustain a fatal blow, standing back with an amount of HP equal to their END modifier. For the remainder of the combat, they also gain resistance to the damage type of the fatal blow.",
    ],
  },
  {
    title: "Speed and Movement",
    blocks: [
      "A Servant’s base movement speed is 30 feet.",
      "AGL encapsulates speed, reflexes and dexterity of a Servant, having varying effects depending on the rank.",
      {
        lines: [
          "**D~C**: The Servant gains +10 feet of movement.",
          "**B~A**: The Servant gains +20 feet of movement.",
          "**A+~EX**: The Servant gains +20 feet of movement, and qualifies for a single of the following Features exclusive to this category depending on the Servant’s depiction of high AGL:",
        ],
      },
      {
        list: [
          "Lightspeed: (Servant) is specially renowned for their high speed movement. As a result, (Servant) gains the Lightspeed Dash Action to use once per rest: (Servant) may use a bonus action to appear next to any creature within their total movement speed without expending any movement, provided that they can see them and their path is clear of any obstacles that would impede their movement. This action cannot be used in the same turn with the Dash Action. Creatures who want to react against this movement must roll an AGL check equal to 10 + the Servant's AGL.",
          "Instant Reflex: (Servant) is specially renowned for their inhuman reflexes. As a result, (Servant) gains an Instant Reaction they may use once per rest to perform any kind of maneuver or feature that would normally be a bonus action/action/full round action as a reaction, without counting True Name attacks.\nThis reaction can only be reacted by another instant reaction or skills of equal rank to the Servant's AGL.",
          "Blink Technique: (Servant) is specially renowned for their immaculately fast technique. As a result, (Servant) gains a blink attack that they may use once per rest when making an attack. This attack ignores AC gained from AGL and gains advantage. If (Servant) already had advantage, they roll 3 times instead of twice and take the best result.",
        ],
      },
    ],
  },
  {
    title: "Mana and Thaumaturgy",
    blocks: [
      "The MNA parameter encapsulates the mana reserves and/or skill to wield magecraft of a creature. In this format, Servants with a MNA rank of EX will be treated differently.",
      "If not already stated, once per rest, the Servant may recharge all expendable abilities at their disposal, with the exception of Noble Phantasms unless stated otherwise.",
    ],
  },
  {
    title: "Luck and Fate",
    blocks: [
      "The LCK parameter encapsulates destiny’s preference for a creature. In this format, Servants with a LCK rank of EX will be treated differently.",
      {
        lines: [
          "If not already stated, once per rest, the Servant may add their LCK stat to any kind of die.",
          "If the roll imposes a success/failure state, they suffer no negative effects from the source of it on a success and half on a failure (if eligible).",
        ],
      },
    ],
  },
  {
    title: "Abilities",
    blocks: [
      "Most Servants have techniques they can perform outside of their Class, Skills, and Noble Phantasm. These are abilities.",
      "For Caster Servants, abilities replace the need for spell slots and spells.",
    ],
  },
  {
    title: "Ability Allowance",
    blocks: [
      "While some abilities can only be used once per rest, others can be used as many times as the Servant wishes, so long as they have the mana for it. To represent this mana being consumed, any ability that does not require a rest must be limited in some way.",
      "Determine the governing stat for that ability (if the servant shoots a beam of magic, it uses MNA. if the servant throws a spear, it uses STR or AGL) then link that stat to the ability. The Servant can use this ability as many times as they have ranks above 0 in that stat. (A Servant with a stat linked to MNA and a MNA modifier of C can use that ability 3 times per rest)",
    ],
  },
  {
    title: "Spellcasting",
    blocks: [
      "All Caster class Servants, unless stated otherwise, have access to advanced spellcasting abilities. Caster class Servants, and other few Servants who may have this feature, have access to the entirety of the Spell List from the Master’s Handbook, and are considered proficient with all Spell types for that matter. They may cast said Spells an amount of times equal to 2 x MNA mod per rest.",
    ],
  },
  {
    title: "Personal Maneuvers",
    blocks: [
      "Most Knight classes and other martial servants gain access to maneuvers. Maneuvers are feats of physical prowess that typically involve the use of a servants signature weapon. A Servant should have no more than 3 maneuvers.",
      "Maneuvers can be given to Servants who are not primarily martial if you feel some of their features are not suited to be portrayed as Abilities.",
    ],
  },
  {
    title: "Martial Spirit Maneuvers",
    blocks: [
      "These are moves that every Martial Heroic Spirit has access to thanks to their training and knowledge in combat, unless stated otherwise. They are called Maneuvers because some of them use Maneuver Die in order to determine results, but they don’t spend Maneuver Die like Personal Maneuvers do.",
      "_Parry/Deflect_ - When the Servant is hit by a melee attack, they may use their reaction in order to reduce the incoming damage by a d8+STR/AGL.",
      "_Riposte/Revenge_ - When an attack is missed against the Servant, they may use their reaction in order to attack at the creature who missed. This move can be used as well when _Parry/Deflect_ has reduced the incoming damage from the attack to 0. A d8 is added to the damage roll on a hit.",
      "_Unarmed Strike_ - When successfully hitting a creature with two consecutive attacks rolled with their Action, the Servant may choose to use their bonus action to make an Unarmed Strike against the same creature. On a hit, the attack deals 1d4(or higher if unarmed strikes are upgraded)+STR bludgeoning damage.",
    ],
  },
  {
    title: "Maneuver Dice",
    blocks: [
      "Servants have a number of maneuver dice equal to their STR or AGL mod (whichever is higher), which are d8s. They are expended when a maneuver is used. All lost maneuver dice are regained on a rest.",
    ],
  },
  {
    title: "Noble Phantasm Rank",
    blocks: [
      "If a Servant’s noble phantasm is a weapon, it gains a magic bonus to attack and damage rolls based on its rank. The rank of the Noble Phantasm also determines the DC of any saving throws it forces.",
      "A+ or EX: +3 to attack and damage. DC 22.",
      "B or A: +2 to attack and damage. DC 20.",
      "D or C: + 1 to attack and damage. DC18.",
      "E: DC16.",
    ],
  },
  {
    title: "Noble Phantasm Use",
    blocks: [
      "A Servant’s Noble Phantasm typically has the capability to release a large attack, known as a ‘true name attack’. This attack consumes a great deal of magical energy. A Servant will have the energy themselves to use a single Noble Phantasm true name attack in a 24 hour period. For any additional Noble Phantasm releases, the Master will have to act as a stand-in and supply the magical energy themselves.",
      "To do this, the Master must make a MNA skill check with a DC equal to the Servant’s power ranking DC. On a success nothing happens and the Noble Phantasm is launched normally. On a failure, the Noble Phantasm is still launched but the Master becomes incapacitated.",
      "On a critical failure, the Master is killed.",
      "Every time this skill check is made without resting, the DC is raised by 2.",
    ],
  },
  {
    title: "Noble Phantasm Clashing",
    blocks: [
      "Being on the receiving end of a Noble Phantasm is usually not a favorable position to be in. Luckily, a Servant can choose to launch their True Name Attack in response to being the target of a Noble Phantasm in order to mitigate, neutralize the damage or even overwhelm the enemy with their own Noble Phantasm.",
      "In such cases, the second Servant to use their Noble Phantasm must either use their reaction or their action with Heroic Surge in order to deploy their Noble Phantasm. When using their reaction, the Noble Phantasm will receive a penalty of 5 damage dies reduced from its total damage for deploying a True Name Attack without proper incantation. Additionally, if the Noble Phantasm is Anti-Army or above, the Master will be under the effects of Mana Drain, or the Servant may choose to be under the effects of Mana Withdrawal. This rule is ignored if the Noble Phantasm is normally deployed by using a reaction or if stated in the description of the Noble Phantasm. The very nature of the Noble Phantasm itself may be a factor as well, so it’s very up to interpretation from the GM’s part.",
      "The type of Noble Phantasm is also an important factor. If one of the Noble Phantasms is two or more tier-types lower than the other (for example, an Anti-Army NP against an Anti-Mountain NP or an Anti-Fortress NP vs an Anti-Country NP), the lower tier type will receive a reduction to its damage tier as well, as the higher tier should win 9/10 times.",
      "When launching Noble Phantasms this way, it is not guaranteed that they will properly clash or cancel each other out, as the areas of effect must overlap in order for them to make contact in the first place. An additional factor to consider is the manner of deployment (a beam of energy, a projectile, a laser beam, the creature launching themselves, etc.) and how the Noble Phantasms would clash, if it’s possible at all.",
      "If these factors show that a Noble Phantasm Clash is doable, the next step is to determine the outcome of the clash. The GM must roll the damage for both Noble Phantasms and compare the numerical results:",
      {
        list: [
          "If the difference in damage is 10 or less, both Noble Phantasms are neutralized by each other and no party receives damage. Additional effects will not apply to any party in normal circumstances, but remember that in Fate there are always exceptions to rules. Creatures caught between the Noble Phantasms will receive the damage regardless, unless the nature of the Noble Phantasms would indicate otherwise.",
          "If the difference in damage is between 10 and 20 included, the “losing party” will receive the remaining damage if they were within the winning Noble Phantasm’s area of effect. If the Noble Phantasm had additional effects tied to a saving throw, it will count as them having succeeded said saving throw. If the effects are not tied to a saving throw and just by being hit, they will become afflicted by said effect. (The winning party may be subjected to the effects of the losing Noble Phantasm depending on its nature as well).",
          "If the difference in damage is above 20, the “losing party” will receive the remaining damage if they were within the winning Noble Phantasm’s area of effect. If the Noble Phantasm had additional effects, the losing party will receive said effects, and may count as a failure if they were tied to a saving throw. (The winning party may be subjected to the effects of the losing Noble Phantasm depending on its nature as well).",
        ],
      },
      "Even if the Noble Phantasms cannot properly clash, a Servant may still choose to launch their Noble Phantasm as a reaction. The Noble Phantasm launched as a full-round action will always land first, unless stated otherwise. (This rule may serve more as a cool narration tool or as a last resort sacrifice than a practical tactic or strategy).",
    ],
  },
  {
    title: "Servant/Skill Power Rankings",
    blocks: [
      "Power Ranking determines whether a Servant suffers from a drain affliction as well as the DCs for some of their abilities, maneuvers and spells.",
      {
        lines: [
          "Skill DC’s are determined by their rank, going from DC16 for E rank and going up by 1 for each rank, capping at DC21 for EX ranking. “+” and “-” add or subtract 1 from the DC.",
          "For abilities or maneuvers that don’t name a rank, the DC is determined by the Servant’s Power Ranking in the same manner.",
        ],
      },
      {
        lines: [
          "The Power Ranking ‘A+’ exists purely to represent particular cases of Servants in an odd spot, where they either: are lorewise stronger than ‘A’ Rank, but weaker than ‘EX’ rank; their power increases artificially; their Power Ranking is vague or badly elaborated in the Wiki (this happens way too often, unfortunately…); or they exist under special circumstances.",
          "Virtually, ‘A+’ Rank acts as ‘EX’ rank, and is merely a “symbolic” rank only for special exceptions.",
        ],
      },
    ],
  },
  {
    title: "True Name Proclamation",
    blocks: ["For Heroic Spirits, their True Names"],
  },
  {
    title: "Stat Drain Equation",
    blocks: [
      "Servants that are rank A and above expend large amounts of magical energy, possibly incurring in mana drain from their masters. To check if said effect applies, the following equation must be made: (Master’s MNA mod) -  (Servant’s Power Ranking). Servants with Madness Enhancement C or above will also be subjected to this equation and will subtract their Madness Enhancement rank in addition to their Power Ranking.",
      "If the result is a negative number, the master is afflicted with Mana Drain.",
      "Servants may choose to spare their master from said affliction in expense of consuming their own magical energy instead, incurring in Mana Withdrawal.",
    ],
  },
  {
    title: "Mana Drain",
    blocks: [
      "Masters who have summoned a high caliber Servant may be afflicted by Mana Drain when unable to provide enough magical energy for their Servant’s natural mana consumption. In such cases, the Master will be put in tremendous strain.",
      "The Master will be able to function an amount of Game Phases equal to their MNA mod before perishing, with a minimum of 1 Game Phase. If the Servant enters combat, the Master will lose an amount of hit points equal to the Servant’s Power Ranking, adding their Madness Enhancement if applicable, at the beginning of the Servant’s turn.",
    ],
  },
  {
    title: "Mana Withdrawal",
    blocks: [
      "Servants with an A to EX Power Ranking or high ranking Madness Enhancement require a large amount of magical energy from their Masters to operate at full capacity, typically more than most magi would possess on their best day. As such, many of them choose to deplete their own magical energy to remain manifested, incurring in Mana Withdrawal. A few Berserker class Servants are also able to deactivate their Madness Enhancement, mitigating or nullifying entirely the effects of Mana Drain or Mana Withdrawal.",
      "When willingly fighting under the effects of Mana Withdrawal, Servants have both their attack and damage modifiers halved, rounded up. In addition, any active skills, abilities and maneuvers will have their total uses halved, rounded up, as well. Certain skills, abilities, and Noble Phantasms may be sealed depending on the particular Servant.",
      "Servants that choose to incur in Mana Withdrawal can choose to release their limiters, by making their Master incur Mana Drain at any point in combat.",
    ],
  },
  {
    title: "Soul Consumption",
    blocks: [
      "Another way to prevent Mana Drain is to have the Servant harvest souls by killing civilians around the city. Spending 8 hours to empower a Servant in such a way will remove both the effects of Mana Drain or Mana Withdrawal for 24 hours. If the Servant was not incurring in Mana Drain when doing so, or the Servant spends 16 consecutive hours harvesting souls, the Servant will be empowered, allowing for the release of an additional True Name Attack or other specific buffs depending on the Servant, for the following 24 hours.",
    ],
  },
  {
    title: "Immaterial Form",
    blocks: [
      "A Servant can assume an immaterial form as an action when they are not in combat. In this form they are invisible.",
    ],
  },
  {
    title: "Aura of Detection",
    blocks: [
      "All Servants have an aura which detects any magic around them at all times unless they are incapacitated. They can sense all magic (Servants, Bounded Fields, etc.) They can not tell specifics, only that something magical is within the aura, unless it is a Servant, which they can specifically discern.",
    ],
  },
  {
    title: "Augmented Magic Vessel",
    blocks: [
      "Servants receive substantial enhancements to their physical abilities that turn them impossible to defeat even for mages of the highest caliber.",
      {
        lines: [
          "They have advantage on STR, END, AGL and MNA (if a Caster) checks and saving throws against humans and mages.",
          "Servants are resistant to non-magical damage.",
        ],
      },
    ],
  },
  {
    title: "Heroic Surge",
    blocks: [
      "Servants that are not summoned in the Berserker class gain access to the Heroic Surge ability. At the end of another creature's turn, the Servant can activate it and immediately take an action or bonus action.",
      "Heroic Surge can only be used once per rest.",
    ],
  },
  {
    title: "Telepathic Link",
    blocks: ["Servants and Masters can communicate with one another telepathically."],
  },
  {
    title: "Defending Their Master",
    blocks: [
      "When a Servant’s Master is the target of a spell or attack, the Servant may use their reaction to assume a space within 5 feet of their Master so long as they are within the Servant’s line of sight and within their dash range, becoming the new target of the attack. If the reaction is used in response to a saving throw, the Servant fails automatically. In return, if it is AoE, the Master passes automatically.",
    ],
  },
  {
    title: "Living Without a Master",
    blocks: [
      "A Servant can continue to carry on in their immaterial form for an amount of 8 hour phases equal to their MNA mod without requiring a contract with a Master. If a new contract is not formed within this timeframe, the Servant will fade from existence.",
      "Should a Servant engage in combat without a Master, they would be able to shore up their remaining magical energy to fight as normal, but without the use of a Noble Phantasm. At the end of the encounter, if the Servant still has not formed a contract, they will fade from existence.",
    ],
  },
]
