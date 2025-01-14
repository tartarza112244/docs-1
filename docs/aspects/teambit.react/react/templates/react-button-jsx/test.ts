import { GeneratorContext } from '@teambit/generator';

export const testFile = (context: GeneratorContext) => {
  const { name, namePascalCase: Name } = context;

  return {
    relativePath: `${name}.spec.jsx`,
    content: `import React from 'react';
import { render } from '@testing-library/react';
import { Basic${Name} } from './${name}.composition';

describe('${name}', () => {

  it('should render with the correct text', () => {
    const { getByText } = render(<Basic${Name} />);
    const rendered = getByText('click me');
    expect(rendered).toBeTruthy();
  });

})`,
  };
};
