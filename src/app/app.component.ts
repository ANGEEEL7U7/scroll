import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import { ReporteCaseta } from './app.types';
import { CABECERAS, TABLA_CASETA } from './app.config';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator) paginacion!: MatPaginator;

  filtros: { [key: string]: string} = {};
  tabla = TABLA_CASETA;
  estructuraTabla = [...this.tabla];
  listaDatos = new MatTableDataSource<ReporteCaseta>([]);

  selectorColumnas = new FormControl(CABECERAS)

  constructor(private _service: AppService) {}

  ngAfterViewInit(): void {
      this.listaDatos.paginator = this.paginacion;
  }

  ngOnInit(): void {
    this._service.obtenerDatos()
      .subscribe(lista => this.listaDatos.data = lista);

    this.listaDatos.filterPredicate = (data,filter): boolean => {
      const filtros = JSON.parse(filter);
      return Object.keys(filtros).every((columna) => {
        const valor = data[columna]? data[columna].toString().toLowerCase() : '';
        return valor.includes(filtros[columna]);
      });

    };
  }

  buscador(filtro: any,indice: any): void {
    this.filtros[indice] = (filtro.target.value as string).trim().toLowerCase()
    this._aplicarFiltro();
    
  }

  limpiarFiltros(): void {
    this.filtros = {};
    this._aplicarFiltro();
  }

  seleccionarColumna(): void {
    const columnas = this.selectorColumnas.value as string[];
    this.estructuraTabla = this.tabla.filter((i) => {
      const visible = i.visible === columnas.includes(i.indice)
      if(!visible) { delete this.filtros[i.indice]; }
      return visible;
    });
    this._aplicarFiltro();
  }

  private _aplicarFiltro(): void {
    const datos = this.listaDatos
    datos.filter = JSON.stringify(this.filtros);
    if(datos.paginator) {
      datos.paginator.firstPage();
    }
  }
}
