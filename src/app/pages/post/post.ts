import { DatePipe } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PostService } from '../../core/post.service';

/** One post at /blog/:slug, prerendered for every file in posts/. */
@Component({
  selector: 'app-post',
  imports: [DatePipe, RouterLink],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class PostPage {
  private readonly postService = inject(PostService);

  /** Bound from the :slug route param. */
  readonly slug = input.required<string>();

  protected readonly post = this.postService.bySlug(this.slug);
  protected readonly isLoading = this.postService.isLoading;

  constructor() {
    const title = inject(Title);
    effect(() => {
      const post = this.post();
      if (post) title.setTitle(`${post.title} · baotq94`);
    });
  }
}
