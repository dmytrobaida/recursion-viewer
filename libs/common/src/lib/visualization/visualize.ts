import v1 from './templates/v1.html?raw';
import v2 from './templates/v2.html?raw';

export function visualize(version: 'v1' | 'v2'): string {
    switch (version) {
        case 'v1':
            return v1;
        case 'v2':
            return v2;
    }
}
