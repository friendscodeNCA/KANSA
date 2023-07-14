import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { DataApiService } from '../services/data-api.service';
import { GlobalService } from '../services/global.service';
import { PasarDatosService } from '../services/pasar-datos.service';
import { BuscadorService } from '../services/buscador.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonModal) modal: IonModal;
  foto: any;
  categoriaForm: FormGroup;
  visibilidad = true;
  listaCategorias = [];
  textoBuscador: string;

  slideOpciones = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
   };
  constructor(
    private router: Router,
    private servGlobal: GlobalService,
    private dataApi: DataApiService,
    private pasarDato: PasarDatosService,
    private buscador: BuscadorService
  ) {
    this.categoriaForm = this.createFormUsuario();
  }

  ngOnInit() {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.dataApi.obtenerCategorias().subscribe(lista => {
      console.log(lista);
      if (lista.length) {
        this.listaCategorias = lista;
      } else {
        this.listaCategorias = [];
      }
    })
  }
  
  cerrarModal() {
    this.modal.dismiss();
  }

  irPresentacion() {
    this.router.navigate(['/presentacion']);
  }

  // CATEGORIAS

  createFormUsuario() {
    return new FormGroup({
      img: new FormControl(''),
      nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
      visible: new FormControl(true,[Validators.required]),
      orden: new FormControl(1, [Validators.required]),
    });
  }

  get img() { return this.categoriaForm.get('img'); }
  get nombre() { return this.categoriaForm.get('nombre'); }
  get visible() { return this.categoriaForm.get('visible'); }
  get orden() { return this.categoriaForm.get('orden'); }

  cambiarVisibilidad(ev) {
    console.log(ev);
    this.visibilidad = ev.detail.checked;
    this.categoriaForm.controls.visible.setValue(this.visibilidad);
  }

  // async subirFoto() {
  //   const loading = await this.servGlobal.presentLoading('Subiendo imagen...');
  //   await this.servGlobal.subirImagen(this.foto).then(res => {
  //     console.log('URL: ', res);
  //     loading.dismiss();
  //     return res;
  //   })
  // }

  async guardarNuevaCategoria() {
    console.log(this.categoriaForm.value);
    if (!this.foto) {
      this.servGlobal.presentToast('Por favor, sube una foto para la categoria');
      return;
    }
    if (this.categoriaForm.valid) {
      const loading = await this.servGlobal.presentLoading('Guardando categoria...');
      await this.servGlobal.subirImagen(this.foto).then(url => {
        this.categoriaForm.controls.img.setValue(url);
        console.log(this.categoriaForm.value);
        this.dataApi.guardarCategoria(this.categoriaForm.value).then(res => {
          if (res && res !== 'fail') {
            this.servGlobal.presentToast('Guardado correctamente.', {color: 'success'});
            this.cerrarModal();
            this.categoriaForm.reset({orden: 1});
            this.foto = '';
            loading.dismiss();
          } else {
            this.servGlobal.presentToast('No se pudo guardar.', {color: 'danger'});
            loading.dismiss();
          }
        });
      })
    } else {
      this.servGlobal.presentToast('Complete los datos correctamente.', {color: 'danger'});
    }
  }

  obtenerFotoCategoria() {
    this.servGlobal.obtenerFotoGaleria().then(res => {
      if (res) {
        this.foto =  'data:image/png;base64,' + res.base64String;
      }
    })
  }

  irSubcategoria(categoria) {
    this.pasarDato.setData(categoria);
    this.router.navigate(['/subcategorias', categoria.id]);
  }

  registro() {
    this.router.navigate(['/registro-datos']);
  }

  textoBuscar(data: string) {
    this.textoBuscador = data;
    console.log(data);
  }

  buscarServicioGeneral() {
    if (!this.textoBuscador) {
      this.servGlobal.presentToast('Ingrese el servicio que desea buscar');
    } else {
      this.router.navigate(['/resultados-busqueda', this.textoBuscador]);
    }
  }
}
