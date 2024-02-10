import Mustache from 'mustache';

import v1 from './templates/v1.html?raw';
import v2 from './templates/v2.html?raw';

export function visualize(version: 'v1' | 'v2', graphData: object): string {
    const template = version === 'v1' ? v1 : v2;

    const rendered = Mustache.render(template, {
        graphData: JSON.stringify(graphData),
    });

    return rendered;
}
