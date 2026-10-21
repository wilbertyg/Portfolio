import { ProjectList } from '../components/Projects/ProjectList'
import { RelatedList } from '../components/Related/RelatedList'
import { skillCategories } from '../components/Skills/SkillList'

// Playful EXP formula: every quest (project), trophy (certificate) and learned skill grants EXP.
export const XP_REWARD = { quest: 250, trophy: 100, skill: 20 }
const XP_PER_LEVEL = 250

const uniqueSkills = new Set(skillCategories.flatMap((c) => c.skills))
const totalXp =
    ProjectList.length * XP_REWARD.quest +
    RelatedList.length * XP_REWARD.trophy +
    uniqueSkills.size * XP_REWARD.skill

export const player = {
    name: 'Wilbert Yang',
    title: 'Data Sorcerer',
    level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
    xp: totalXp % XP_PER_LEVEL,
    xpToNext: XP_PER_LEVEL,
    totalXp,
    quests: ProjectList.length,
    trophies: RelatedList.length,
    skills: uniqueSkills.size,
    schools: skillCategories.length,
}
