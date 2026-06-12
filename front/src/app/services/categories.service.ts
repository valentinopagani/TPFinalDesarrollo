import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly api = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.api);
  }

  findOne(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.api}/${id}`);
  }

  create(dto: CreateCategoryDto): Observable<Category> {
    return this.http.post<Category>(this.api, dto);
  }

  update(id: number, dto: UpdateCategoryDto): Observable<Category> {
    return this.http.put<Category>(`${this.api}/${id}`, dto);
  }

  remove(id: number): Observable<Category> {
    return this.http.delete<Category>(`${this.api}/${id}`);
  }
}
