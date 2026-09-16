import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PostService } from '../../core/post.service';
import { Card } from '../../shared/card/card';
import { PageShell } from '../../shared/page-shell/page-shell';

/** Every post, newest first, on one page. No filters, no paging. */
@Component({
  selector: 'app-blog',
  imports: [Card, DatePipe, PageShell],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  private readonly postService = inject(PostService);

  protected readonly posts = this.postService.posts;
  protected readonly isLoading = this.postService.isLoading;
}
