import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { GithubService, GitHubUser } from '../../services/github.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailComponent implements OnInit {
  private githubService = inject(GithubService);
  private route = inject(ActivatedRoute);
  user = signal<GitHubUser | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['username']) {
        this.githubService.getUser(params['username']).subscribe(user => {
          this.user.set(user);
        });
      }
    });
  }
}
