import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostService } from '../../core/post.service';
import { Card } from '../../shared/card/card';

@Component({
  selector: 'app-home',
  imports: [Card, DatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly latest = inject(PostService).latest(3);
}
