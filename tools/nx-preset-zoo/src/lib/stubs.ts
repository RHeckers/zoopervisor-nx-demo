import { names } from '@nx/devkit';
import { LibKind } from './kinds';

export interface StubResult {
  files: Record<string, string>;
  indexExports: string[];
}

/**
 * Minimal, compiling, sensibly-named content for a freshly generated lib. The
 * hand-written teaching libs (animals stores, the composed store, real UI)
 * overwrite these; for the quieter domains the stub is the deliverable. Every
 * stub is dumb/pure where its `type:` demands it, so generated code never
 * trips the boundary rules.
 */
export function stubFor(kind: LibKind, name: string): StubResult {
  const n = names(name);
  const Class = n.className;
  const kebab = n.fileName;

  switch (kind) {
    case 'types':
      return {
        files: {
          'src/lib/types.ts': `/** Public entity for the ${name} domain. */
export interface ${Class} {
  readonly id: string;
}
`,
        },
        indexExports: [`export * from './lib/types';`],
      };

    case 'util':
      return {
        files: {
          [`src/lib/${kebab}.util.ts`]: `/** Pure helper — no Angular, no side effects. */
export function ${n.propertyName}Label(value: string): string {
  return value.trim();
}
`,
        },
        indexExports: [`export * from './lib/${kebab}.util';`],
      };

    case 'data-access':
      return {
        files: {
          [`src/lib/${kebab}.store.ts`]: `import { signalStore, withState } from '@ngrx/signals';

/** Thin single-entity store for the ${name} domain. */
export const ${Class}Store = signalStore(
  { providedIn: 'root' },
  withState<{ loaded: boolean }>({ loaded: false }),
);
`,
        },
        indexExports: [`export * from './lib/${kebab}.store';`],
      };

    case 'ui':
      return {
        files: {
          [`src/lib/${kebab}.component.ts`]: `import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb ${name} component — signal inputs only, no store, no HTTP. */
@Component({
  selector: 'zoo-${kebab}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './${kebab}.component.html',
})
export class ${Class}Component {
  readonly label = input('');
}
`,
          [`src/lib/${kebab}.component.html`]: `<span class="zoo-${kebab}">{{ label() }}</span>
`,
        },
        indexExports: [`export * from './lib/${kebab}.component';`],
      };

    case 'slice':
      return {
        files: {
          [`src/lib/${kebab}.slice.ts`]: `import { ChangeDetectionStrategy, Component } from '@angular/core';

/*
 * A slice is smart and self-wiring: drop it into any feature with no inputs
 * and it resolves everything itself. Boundary rule: a slice may reach ui,
 * data-access, util and types — nothing else.
 */
@Component({
  selector: 'zoo-${kebab}-slice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './${kebab}.slice.html',
})
export class ${Class}Slice {}
`,
          [`src/lib/${kebab}.slice.html`]: `<section class="zoo-${kebab}-slice"><!-- self-wiring block --></section>
`,
        },
        indexExports: [`export * from './lib/${kebab}.slice';`],
      };

    case 'shell':
      return {
        files: {
          [`src/lib/${kebab}.routes.ts`]: `import { Routes } from '@angular/router';

/** Root routes for the ${name} app. The app project is a thin bootstrap; the
 *  shell owns layout and routing and composes features. */
export const ${n.propertyName}Routes: Routes = [];
`,
        },
        indexExports: [`export * from './lib/${kebab}.routes';`],
      };

    case 'feature':
      return featureStub(name);
  }
}

/** A feature ships with its facade scaffolded — that is the point of it. */
export function featureStub(name: string): StubResult {
  const n = names(name);
  const Class = n.className;
  const kebab = n.fileName;
  return {
    files: {
      [`src/lib/${kebab}.facade.ts`]: `import { Injectable, signal } from '@angular/core';

/*
 * The facade composes domain stores and holds feature-local UI state, exposing
 * a single view model plus intent methods. The feature component injects ONLY
 * this — never a domain store directly.
 */
@Injectable()
export class ${Class}Facade {
  private readonly _busy = signal(false);
  readonly busy = this._busy.asReadonly();

  open(): void {
    /* intent — wire to a domain store */
  }

  refresh(): void {
    this._busy.set(true);
  }
}
`,
      [`src/lib/${kebab}.component.ts`]: `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ${Class}Facade } from './${kebab}.facade';

/** Smart but thin: talks only to the facade. */
@Component({
  selector: 'zoo-${kebab}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [${Class}Facade],
  templateUrl: './${kebab}.component.html',
})
export class ${Class}Component {
  protected readonly facade = inject(${Class}Facade);
}
`,
      [`src/lib/${kebab}.component.html`]: `<section class="zoo-${kebab}"><!-- feature view --></section>
`,
    },
    // No routes file: the shell mounts a single-view feature straight with
    // `loadComponent`. A feature only grows a routes file (and switches the
    // shell to `loadChildren`) once it owns two or more routed views.
    indexExports: [`export * from './lib/${kebab}.component';`],
  };
}
