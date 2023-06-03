import { FisherComponent, Experience, isWithSkillComponent, isWithFightComponent } from '@FisherCore';

const useFisherComponentExperience = (component: FisherComponent) => {
  let experience: Experience | undefined = undefined;

  if (isWithSkillComponent(component)) {
    experience = component.skill.experience;
  }

  if (isWithFightComponent(component)) {
    experience = component.master.person.experience;
  }

  return { experience };
};

export { useFisherComponentExperience };
