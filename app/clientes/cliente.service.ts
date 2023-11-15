import { Injectable } from '@angular/core';
import { formatDate, DatePipe} from '@angular/common';

import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';



import { Router } from '@angular/router';

@Injectable()
export class ClienteService {
  urlEndpoint:string = 'http://localhost:8080/api/clientes';

 httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
  constructor( private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any> { 
      return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
        tap((response: any) => {
          console.log('ClienteService: tap 1');
          (response.content as Cliente[]).forEach(cliente =>{
            console.log(cliente.nombre);
          });
        }), 
        map((response: any) => {
          (response.content as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre?.toUpperCase();
            //let datePipe = new DatePipe('Es');
            //cliente.createAt = formatDate(cliente.createAt!, 'EEEE dd, MMMM yyyy', 'Es');
            
            return cliente;
          });
          return response;
        }), 
        tap(response => {
          console.log('ClienteService: tap 2');
          (response.content as Cliente[]).forEach( cliente =>{
            console.log(cliente.nombre);
          });
        })
      );
  }

  create(cliente: Cliente) : Observable<Cliente> {
    return this.http.post(this.urlEndpoint, cliente, {headers: this.httpHeaders}).pipe(
      map( (response: any )=> response.cliente as Cliente), 
      catchError(error =>{


        if(error.status==400){
          return throwError(() => error);

        }

        console.error(error.errors.mensaje);
        Swal.fire(error.error.mensaje, error.error.error, 'error');
        return throwError(() => error);
      })
    );
  }

  getCliente(id:number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(error => {
          this.router.navigate(['/clientes']);
          console.error(error.error.mensaje);
          Swal.fire('Error al editar', error.error.mensaje, 'error');
          return throwError(() => error); 
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndpoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(error => {

        if (error.status==400){
          return throwError(() => error);
        }
        this.router.navigate(['/clientes']);
        console.error(error.error.mensaje);
        Swal.fire(error.error.mensaje, error.error.error, 'error');
        return throwError(() => error); 
    })
    );
  };

  delete(id: number) : Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndpoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(error => {
        this.router.navigate(['/clientes']);
        console.error(error.error.mensaje);
        Swal.fire(error.error.mensaje, error.error.error, 'error');
        return throwError(() => error); 
    })
    );
  };
  
}
