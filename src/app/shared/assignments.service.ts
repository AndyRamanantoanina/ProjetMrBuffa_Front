import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, forkJoin, map, Observable, of, pairwise, tap } from 'rxjs';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';
import { bdInitialAssignments } from './data';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AssignmentsService {
  assignments:Assignment[] = [];
  private authorizationToken: string = '-'

  constructor(private loggingService:LoggingService, private http:HttpClient, private auth:AuthService) {
    this.loggingService.setNiveauTrace(2);
    this.setAuthorizationTokenValue();

  }


  url = "http://localhost:8010/api/assignments";
  //url= "https://mbdsmadagascar2022api.herokuapp.com/api/assignments";

  protected setAuthorizationTokenValue() : void {
    this.authorizationToken = 'Bearer ' + this.auth.getToken();
  }

  protected getOptions(options: any = {}) : any {
    this.setAuthorizationTokenValue();

    let requestHeaders: HttpHeaders;
    
    var allowHeaders = '*';
    var contentType = 'application/json';
    if(options.headers && (options.headers instanceof HttpHeaders)) {
      requestHeaders = (options.headers as HttpHeaders);
      requestHeaders.append('Access-Control-Allow-Headers', allowHeaders);
      requestHeaders.append('Content-Type', contentType);
      requestHeaders.append('Accept', contentType);
      requestHeaders.append('token', this.authorizationToken);
    }
    else {
      requestHeaders = new HttpHeaders({
        'Access-Control-Allow-Headers': allowHeaders,
        'Content-Type': contentType,
        'Accept': contentType,
        'Authorization' : this.authorizationToken
      })
    }
    if(!options.observe) {
      options.observe = 'body'
    }
    options.headers = requestHeaders;
    return options;
  }

  getAssignments(page:number, limit:number):Observable<any> {
    // en réalité, bientôt au lieu de renvoyer un tableau codé en dur,
    // on va envoyer une requête à un Web Service sur le cloud, qui mettra un
    // certain temps à répondre. On va donc préparer le terrain en renvoyant
    // non pas directement les données, mais en renvoyant un objet "Observable"
    //return of(this.assignments);
    return this.http.get<Assignment[]>(this.url + "?page=" + page + "&limit=" + limit,this.getOptions({}));
  }
  

  getAssignment(id:number):Observable<Assignment|undefined> {
    //let a = this.assignments.find(a => a.id === id);
    //return of(a);
    return this.http.get<Assignment>(`${this.url}/${id}`)
    .pipe(
      map(a => {
        a.nom = a.nom + " MODIFIE PAR UN MAP AVANT DE L'ENVOYER AU COMPOSANT D'AFFICHAGE";
        return a;
      }),
      tap(a => {
        console.log("Dans le tap, pour debug, assignment recu = " + a.nom)
      }),
      catchError(this.handleError<any>('### catchError: getAssignments by id avec id=' + id))
    );
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    }
  }

  addAssignment(assignment:Assignment):Observable<any> {
   // this.assignments.push(assignment);

    this.loggingService.log(assignment.nom, "ajouté");

    return this.http.post<Assignment>(this.url, assignment,this.getOptions({}));

    //return of("Assignment ajouté");
  }

  updateAssignment(assignment:Assignment):Observable<any> {
    this.loggingService.log(assignment.nom, "modifié");

    return this.http.put<Assignment>(this.url, assignment,this.getOptions({}));
  }

  deleteAssignment(assignment:Assignment):Observable<any> {
    //let pos = this.assignments.indexOf(assignment);
    //this.assignments.splice(pos, 1);

    this.loggingService.log(assignment.nom, "supprimé");

    //return of("Assignment supprimé");
    return this.http.delete(this.url + "/" + assignment._id,this.getOptions({}));
  }

  peuplerBD() {
    bdInitialAssignments.forEach(a => {
      let newAssignment = new Assignment();
      newAssignment.nom = a.nom;
      newAssignment.dateDeRendu = new Date(a.dateDeRendu);
      newAssignment.rendu = a.rendu;
      newAssignment.id = a.id;

      this.addAssignment(newAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);
      })
    })
  }

  peuplerBDAvecForkJoin(): Observable<any> {
    const appelsVersAddAssignment:any = [];

    bdInitialAssignments.forEach((a) => {
      const nouvelAssignment:any = new Assignment();

      nouvelAssignment.id = a.id;
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });
    return forkJoin(appelsVersAddAssignment); // renvoie un seul Observable pour dire que c'est fini
  }

}
