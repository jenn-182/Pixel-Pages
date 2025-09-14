import { Code, PenTool, Palette, BookOpen, Briefcase, Target, Heart, Lightbulb } from 'lucide-react';

/**
 * Service for handling profession and level title calculations
 * Matches the logic from TimeManagementMatrix and HexagonalSkillTree
 */

/**
 * Calculate level from XP using the official system (matches HexagonalSkillTree)
 * @param {number} xp - Current XP
 * @returns {number} - Current level (1-10)
 */
export const getCurrentLevel = (xp) => {
  // XP calculation for levels (exponential growth - EXACT same as HexagonalSkillTree)
  const calculateXPRequired = (level) => {
    const base = 60; // 1 hour for level 1
    return Math.floor(base * Math.pow(1.4, level - 1));
  };

  let level = 1;
  let xpNeeded = 0;
  
  while (level <= 10) {
    xpNeeded += calculateXPRequired(level);
    if (xp < xpNeeded) break;
    level++;
  }
  
  return Math.min(level, 10);
};

/**
 * Get level title based on category and level
 * @param {string} categoryName - Category name (lowercase)
 * @param {number} level - Current level (1-10)
 * @returns {string} - Level title
 */
export const getLevelTitle = (categoryName, level) => {
  const titles = {
    scholar: ['STUDENT', 'LEARNER', 'THINKER', 'SCHOLAR', 'RESEARCHER', 'EXPERT', 'SAGE', 'PROFESSOR', 'GENIUS', 'MASTERMIND'],
    profession: ['INTERN', 'TRAINEE', 'WORKER', 'SPECIALIST', 'VETERAN', 'ELITE', 'MANAGER', 'DIRECTOR', 'EXECUTIVE', 'LEGEND'],
    artisan: ['DREAMER', 'ARTIST', 'MAKER', 'CREATOR', 'DESIGNER', 'INNOVATOR', 'VISIONARY', 'PIONEER', 'VIRTUOSO', 'GODLIKE'],
    scribe: ['NOVICE', 'WRITER', 'AUTHOR', 'STORYTELLER', 'WORDSMITH', 'POET', 'NOVELIST', 'MASTER', 'LAUREATE', 'IMMORTAL'],
    programming: ['NOOB', 'CODER', 'PROGRAMMER', 'DEVELOPER', 'ENGINEER', 'ARCHITECT', 'GURU', 'NINJA', 'WIZARD', 'HACKER'],
    literacy: ['READER', 'BROWSER', 'BOOKWORM', 'SCHOLAR', 'CRITIC', 'ANALYST', 'EXPERT', 'CURATOR', 'SAGE', 'ORACLE'],
    strategist: ['PLANNER', 'ORGANIZER', 'TACTICIAN', 'STRATEGIST', 'COORDINATOR', 'MASTERMIND', 'ARCHITECT', 'VISIONARY', 'COMMANDER', 'GRANDMASTER'],
    mindfulness: ['SEEKER', 'RELAXER', 'MEDITATOR', 'PEACEFUL', 'CENTERED', 'BALANCED', 'SERENE', 'ENLIGHTENED', 'TRANSCENDENT', 'ZEN MASTER'],
    knowledge: ['CURIOUS', 'SEARCHER', 'INVESTIGATOR', 'RESEARCHER', 'EXPLORER', 'DISCOVERER', 'SCHOLAR', 'EXPERT', 'AUTHORITY', 'OMNISCIENT']
  };
  
  const categoryKey = categoryName.toLowerCase();
  return titles[categoryKey]?.[level - 1] || `Level ${level}`;
};

/**
 * Get profession info for a skill
 * @param {string} skillName - Skill name (e.g., "Programming", "Scholar")
 * @param {number} level - Current level
 * @returns {object} - Profession object with icon and name
 */
export const getProfessionForSkill = (skillName, level) => {
  const skillProfessions = {
    'Programming': {
      icon: Code,
      name: getLevelTitle('programming', level)
    },
    'Scribe': {
      icon: PenTool,
      name: getLevelTitle('scribe', level)
    },
    'Artisan': {
      icon: Palette,
      name: getLevelTitle('artisan', level)
    },
    'Scholar': {
      icon: BookOpen,
      name: getLevelTitle('scholar', level)
    },
    'Profession': {
      icon: Briefcase,
      name: getLevelTitle('profession', level)
    },
    'Literacy': {
      icon: BookOpen,
      name: getLevelTitle('literacy', level)
    },
    'Strategist': {
      icon: Target,
      name: getLevelTitle('strategist', level)
    },
    'Mindfulness': {
      icon: Heart,
      name: getLevelTitle('mindfulness', level)
    },
    'Knowledge': {
      icon: Lightbulb,
      name: getLevelTitle('knowledge', level)
    }
  };
  
  // Find the appropriate profession for the skill with case-insensitive matching
  let profession = skillProfessions[skillName];
  
  // If not found, try case-insensitive lookup
  if (!profession) {
    const skillKey = Object.keys(skillProfessions).find(key => 
      key.toLowerCase() === skillName.toLowerCase()
    );
    profession = skillKey ? skillProfessions[skillKey] : null;
  }
  
  // Fallback to Scholar if still not found
  if (!profession) {
    profession = skillProfessions['Scholar'];
  }
  
  return profession;
};

/**
 * Calculate skills with levels and professions from localStorage categories
 * @param {array} categories - Categories from localStorage
 * @returns {object} - Object with skillsWithLevels array and highestSkill
 */
export const calculateSkillsAndProfession = (categories) => {
  // Calculate level for each skill using the official system
  const skillsWithLevels = categories.map(category => {
    const currentXP = category.xp || 0;
    const level = getCurrentLevel(currentXP);
    const profession = getProfessionForSkill(category.name, level);
    
    // Debug log the skill calculation
    console.log(`🎯 Skill Debug - ${category.name}: XP=${currentXP}, Level=${level}, Profession=${profession.name}`);
    
    return {
      ...category,
      level,
      profession: {
        name: profession.name,
        icon: profession.icon
      }
    };
  });
  
  // Find the highest level skill
  const highestSkill = skillsWithLevels.reduce((highest, current) => 
    current.level > highest.level ? current : highest
  );
  
  console.log('🏆 Highest skill determined:', {
    name: highestSkill.name,
    level: highestSkill.level,
    profession: highestSkill.profession.name,
    xp: highestSkill.xp
  });
  
  return { skillsWithLevels, highestSkill };
};
