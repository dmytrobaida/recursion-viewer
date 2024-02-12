import Mustache from 'mustache';

import template from './templates/cyto.mustache?raw';
import cytoscape from './scripts/cytoscape.3.28.1.txt?raw';
import dagre from './scripts/dagre.0.8.5.txt?raw';
import cytoscapeDagre from './scripts/cytoscape-darge.2.5.0.txt?raw';

export function visualize(graphData: object): string {
    const rendered = Mustache.render(template, {
        graphData: JSON.stringify(graphData),
        cytoscape: cytoscape,
        dagre: dagre,
        cytoscapeDagre: cytoscapeDagre,
    });

    return rendered;
}
