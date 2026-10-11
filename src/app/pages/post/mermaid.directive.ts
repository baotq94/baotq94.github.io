import { afterRenderEffect, Directive, ElementRef, inject, input } from '@angular/core';

let diagramId = 0;

/** Render fenced Mermaid blocks after browser rendering; keep source during prerendering. */
@Directive({ selector: '[appMermaid]' })
export class MermaidDirective {
  readonly appMermaid = input.required<string>();
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterRenderEffect((onCleanup) => {
      this.appMermaid();
      let cancelled = false;
      onCleanup(() => (cancelled = true));
      const host = this.element.nativeElement;
      const blocks = [...host.querySelectorAll<HTMLElement>('pre > code.language-mermaid')];
      if (!blocks.length) return;

      void (async () => {
        try {
          const { default: mermaid } = await import('mermaid');
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            suppressErrorRendering: true,
            theme: 'neutral',
            flowchart: { htmlLabels: false },
          });
          for (const block of blocks) {
            if (cancelled || !host.contains(block)) return;
            try {
              const { svg } = await mermaid.render(
                `post-diagram-${++diagramId}`,
                block.textContent ?? '',
              );
              if (cancelled || !host.contains(block)) return;
              const figure = host.ownerDocument.createElement('figure');
              figure.className = 'mermaid-diagram';
              // Mermaid sanitizes its SVG in strict mode. Markdown still uses Angular sanitization.
              figure.innerHTML = svg;
              block.parentElement?.replaceWith(figure);
            } catch {
              // Invalid diagrams remain readable as source; continue with the other blocks.
            }
          }
        } catch {
          // Keep the source if the lazy-loaded renderer is unavailable.
        }
      })();
    });
  }
}
