import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // HttpUrl = "https://testsubscription.bizminds.io/admin";
  HttpUrl = environment.httpUrl;
  currentPage = "Dashboard";
  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  constructor(private httpClient:HttpClient) {
    console.log(this.HttpUrl)
   }
  

  getModels(): Observable<any> {
    return this.httpClient.get(`${this.HttpUrl}/getModels`);
  }

  getChallengeTag(): Observable<any> {
    return this.httpClient.get(`${this.HttpUrl}/getChallengeTag`);
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
    return this.httpClient.post(`${this.HttpUrl}/addEditWorkout`,data);
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
  addEditChallenge(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/addEditChallenge`,data);
  }
  deleteChallenge(data:any): Observable<any> {
    return this.httpClient.post(`${this.HttpUrl}/deleteChallenge`,data);
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
