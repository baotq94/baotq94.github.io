import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MermaidDirective } from './mermaid.directive';

const renderer = vi.hoisted(() => ({ initialize: vi.fn(), render: vi.fn() }));
vi.mock('mermaid', () => ({ default: renderer }));

@Component({
  imports: [MermaidDirective],
  template: '<div [innerHTML]="html()" [appMermaid]="html()"></div>',
})
class TestPost {
  readonly html = signal('');
}

const fence = (source: string) => `<pre><code class="language-mermaid">${source}</code></pre>`;

describe('MermaidDirective', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    renderer.render.mockResolvedValue({ svg: '<svg role="img"><title>Diagram</title></svg>' });
    TestBed.configureTestingModule({ imports: [TestPost] });
  });

  it('renders Mermaid while preserving ordinary code and Angular sanitization', async () => {
    const fixture = TestBed.createComponent(TestPost);
    fixture.componentInstance.html.set(
      `${fence('graph TD; A-->B')}<pre><code>plain code</code></pre><script>alert(1)</script>`,
    );
    await fixture.whenStable();
    await vi.waitFor(() => expect(fixture.nativeElement.querySelector('figure svg')).toBeTruthy());
    expect(fixture.nativeElement.querySelector('code').textContent).toBe('plain code');
    expect(fixture.nativeElement.querySelector('script')).toBeNull();
    expect(renderer.initialize).toHaveBeenCalledWith(
      expect.objectContaining({ securityLevel: 'strict' }),
    );
  });

  it('keeps invalid source readable and still renders the next diagram', async () => {
    renderer.render.mockRejectedValueOnce(new Error('Invalid diagram'));
    const fixture = TestBed.createComponent(TestPost);
    fixture.componentInstance.html.set(fence('invalid') + fence('graph TD; A-->B'));
    await fixture.whenStable();
    await vi.waitFor(() => expect(fixture.nativeElement.querySelector('figure svg')).toBeTruthy());
    expect(fixture.nativeElement.querySelector('code').textContent).toBe('invalid');
  });

  it('renders new content without inserting a stale result after navigation', async () => {
    let resolveOld!: (result: { svg: string }) => void;
    renderer.render.mockImplementationOnce(() => new Promise((resolve) => (resolveOld = resolve)));
    const fixture = TestBed.createComponent(TestPost);
    fixture.componentInstance.html.set(fence('graph TD; Old-->Post'));
    await fixture.whenStable();
    await vi.waitFor(() => expect(renderer.render).toHaveBeenCalledTimes(1));
    fixture.componentInstance.html.set(fence('graph TD; New-->Post'));
    await fixture.whenStable();
    await vi.waitFor(() => expect(renderer.render).toHaveBeenCalledTimes(2));
    resolveOld({ svg: '<svg><title>Stale</title></svg>' });
    await vi.waitFor(() => expect(fixture.nativeElement.querySelector('figure svg')).toBeTruthy());
    expect(fixture.nativeElement.textContent).not.toContain('Stale');
  });
});
