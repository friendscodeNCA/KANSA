import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { DataApiService } from 'src/app/services/data-api.service';
import { GlobalService } from 'src/app/services/global.service';
import { PasarDatosService } from 'src/app/services/pasar-datos.service';

@Component({
  selector: 'app-subcategorias',
  templateUrl: './subcategorias.page.html',
  styleUrls: ['./subcategorias.page.scss'],
})
export class SubcategoriasPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  foto: any;

  idCategoria;
  dataCategoria;
  categoriaForm: FormGroup;
  visibilidad = true;
  listaSubCategorias : any = [];
  constructor(
    private route: ActivatedRoute,
    private pasarDatos: PasarDatosService,
    private router: Router,
    private servGlobal: GlobalService,
    private dataApi: DataApiService
  ) {
    this.idCategoria = this.route.snapshot.params.id;
    this.categoriaForm = this.createFormUsuario();
  }
  
  ngOnInit() {
    this.obtenerSubCategorias();
    this.dataCategoria = this.pasarDatos.getData();
    if (!this.dataCategoria) {
      this.router.navigate(['/tabs/tab1']);
    }
  }

  obtenerSubCategorias() {
    this.dataApi.obtenerSubCategorias(this.idCategoria).subscribe(lista => {
      console.log(lista);
      if (lista.length) {
        this.listaSubCategorias = lista;
      }
    })
  }

//   obtenerSubCategorias() {
//     this.dataApi.obtenerSubCategorias(this.idCategoria)
    
//     // .forEach(res => {
//     //     console.log(res);

//     // })
//     // .subscribe(res => {
//     //   console.log(res);
//     //   this.listaSubCategorias = res;
//     // });
//     .then(res => {
//       res.forEach(data => {
//       // this.listaSubCategorias = [];
//       if (data) {
//         console.log(data.data())
//         this.listaSubCategorias.push(data.data());
//       }
//     });
//   });
// }

  cerrarModal() {
    this.modal.dismiss();
  }

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

  async guardarNuevaSubCategoria() {
    console.log(this.categoriaForm.value);
    if (!this.foto) {
      this.servGlobal.presentToast('Por favor, sube una foto para la categoria');
      return;
    }
    if (this.categoriaForm.valid) {
      const loading = await this.servGlobal.presentLoading('Guardando Subcategoria...');
      await this.servGlobal.subirImagen(this.foto).then(url => {
        this.categoriaForm.controls.img.setValue(url);
        console.log(this.categoriaForm.value);
        this.dataApi.guardarSubCategoria(this.categoriaForm.value, this.idCategoria).then(res => {
          if (res && res !== 'fail') {
            this.servGlobal.presentToast('Guardado correctamente.', {color: 'success'});
            this.cerrarModal();
            this.foto = '';
            this.categoriaForm.reset({orden: 1});
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

  irListaUsuariosServicio(servicio) {
    this.pasarDatos.setData(servicio);
    this.router.navigate(['/lista-usuarios-servicio', servicio.id])
  }

}
