import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  HttpUrl = "http://localhost:8100/admin"
  // HttpUrl = "http://inflowactive.api.bizminds.io/admin";
  currentPage = "Dashboard";
  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  constructor(private httpClient:HttpClient) { }
  

  getModels(): Observable<any> {
    return this.httpClient.get(`${this.HttpUrl}/getModels`)
  }
  //recipe api
  getRecipes(): Observable<any> {
    return this.httpClient.get(`${this.HttpUrl}/getRecipes`);
  }
  addEditRecipe(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/addEditRecipe`,data);
  }
  deleteRecipe(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/deleteRecipe`,data);
  }
  
  //exercise api
  getExercises(): Observable<any> {
    return this.httpClient.get(`${this.HttpUrl}/getRecipes`);
  }
  addEditExercises(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/addEditExercise`,data);
  }
  deleteExercise(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/deleteExercise`,data);
  }


  //Wc Exercises
  addEditWCExercises(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/addEditWCExercise`,data);
  }
  deleteWCExercise(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/deleteWCExercise`,data);
  }




  //workout api
  addEditWorkout(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/addWorkout`,data);
  }
  deleteWorkout(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/deleteWorkout`,data);
  }

  //blog api
  addEditBlog(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/addEditBlog`,data);
  }
  deleteBlog(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/deleteBlog`,data);
  }

  //program api
  addEditProgram(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/addEditProgram`,data);
  }
  deleteProgram(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/deleteProgram`,data);
  }

  //user api
  addEditUser(data:any): Observable<any> {
    console.log(data)
    return this.httpClient.post(`${this.HttpUrl}/addUser`,data);
  }
  //user api
  updateUser(data:any): Observable<any> {
    console.log(data)
    return this.httpClient.post(`${this.HttpUrl}/updateUser`,data);
  }
  deleteUser(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/deleteUser`,data);
  }
  
}
