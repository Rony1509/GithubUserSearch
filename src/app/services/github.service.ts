import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  profile_url?: string;
  name?: string;
  bio?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  location?: string;
  blog?: string;
}

export interface SearchResult {
  items: GitHubUser[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private http = inject(HttpClient);
  private searchSubject = new Subject<string>();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private resultsSubject = new BehaviorSubject<GitHubUser[]>([]);

  public search$ = this.searchSubject.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => {
      if (!query.trim()) {
        this.loadingSubject.next(false);
        this.resultsSubject.next([]);
        return of({ items: [], total_count: 0 } as SearchResult);
      }

      this.loadingSubject.next(true);
      this.errorSubject.next(null);
      return this.http.get<SearchResult>(`https://api.github.com/search/users?q=${query}&per_page=10`)
        .pipe(
          catchError(error => {
            this.errorSubject.next('Failed to fetch users. Please try again.');
            this.loadingSubject.next(false);
            return of({ items: [], total_count: 0 } as SearchResult);
          })
        );
    })
  );

  constructor() {
    this.search$.subscribe(result => {
      this.resultsSubject.next(result.items);
      this.loadingSubject.next(false);
    });
  }

  searchUsers(query: string): void {
    this.searchSubject.next(query);
  }

  getUser(username: string): Observable<GitHubUser> {
    return this.http.get<GitHubUser>(`https://api.github.com/users/${username}`).pipe(
      catchError(error => {
        this.errorSubject.next('User not found.');
        return of({} as GitHubUser);
      })
    );
  }

  get results$(): Observable<GitHubUser[]> {
    return this.resultsSubject.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  get error$(): Observable<string | null> {
    return this.errorSubject.asObservable();
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}
