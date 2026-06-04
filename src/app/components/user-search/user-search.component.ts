import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSearchComponent {
  protected githubService = inject(GithubService);
  searchQuery = signal('');

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.githubService.searchUsers(query);
  }
}
