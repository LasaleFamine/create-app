import path from 'path';
import validateProjectName from 'validate-npm-package-name';

export const validateAppName = (name: string): {valid: boolean; problems: string[]} => {
  const basenamePath = path.basename(path.resolve(name));
  const nameValidation = validateProjectName(basenamePath);
  const problems = [
    ...(nameValidation.errors ?? []),
    ...(nameValidation.warnings ?? []),
  ];

  return {
    valid: nameValidation.validForNewPackages,
    problems,
  };
};
