import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
   cliente: Cliente = new Cliente()
  titulo:string = "Crear Cliente"
  errors: string[] | undefined;
 


  constructor(private clienteService: ClienteService, 
    private router: Router,
    private activatedRoute: ActivatedRoute) {}
    

  ngOnInit() {
    this.cargarCliente()
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params ['id']
      if (id){
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    })

  }

  create(): void{
    this.clienteService.create(this.cliente).subscribe({
      next: (cliente) => {
        this.router.navigate(['/clientes']);
        Swal.fire('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con éxito `, 'success');
      },
      error: (err) => { 
        this.errors = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
  });
      
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe({
      next:(json) => {
      this.router.navigate(['/clientes']);
      Swal.fire('Nuevo cliente', ` ${json.mensaje}: ${json.cliente.nombre}`, 'success');
    
    },
    error: (err) => { 
      this.errors = err.error.errors as string[];
      console.error('Código del error desde el backend: ' + err.status);
      console.error(err.error.errors);
    },
  });
  }

}
