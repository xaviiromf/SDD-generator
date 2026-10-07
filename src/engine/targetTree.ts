import type { Configuration } from '../domain/models';
import { webPlatforms } from '../domain/compatibility';
export function targetTree(c: Configuration): string[] {
    const languages = c.selections.language ?? [];
    const platform = c.selections.platform?.[0];
    const paths = ['README.md', '.env.example'];
    if (languages.includes('rust'))
        paths.push('Cargo.toml', 'src/main.rs', 'tests/integration.rs');
    else if (languages.includes('python'))
        paths.push('pyproject.toml', 'src/main.py', 'tests/test_main.py');
    else if (languages.includes('go'))
        paths.push('go.mod', 'cmd/main.go', 'internal/app/app_test.go');
    else if (webPlatforms.includes(platform ?? ''))
        paths.push('package.json', 'src/main.tsx', 'src/components/', 'src/styles/tokens.css', 'tests/');
    else if (platform === 'game')
        paths.push('project.godot', 'scenes/', 'scripts/', 'audio/');
    else
        paths.push('src/', 'tests/');
    if (c.selections.backend?.length && webPlatforms.includes(platform ?? ''))
        paths.push('src/api/', 'src/domain/');
    if (c.selections.storage?.some(id => !['memory', 'fixtures'].includes(id)))
        paths.push('src/storage/');
    if (c.selections.deploy?.includes('docker'))
        paths.push('Dockerfile');
    return paths;
}
