import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'presentacion',
    loadChildren: () => import('./pages/presentacion/presentacion.module').then( m => m.PresentacionPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'registro-datos/:celular/:token',
    loadChildren: () => import('./pages/registro-datos/registro-datos.module').then( m => m.RegistroDatosPageModule)
  },
  {
    path: 'agregar-editar-categoria',
    loadChildren: () => import('./modals/agregar-editar-categoria/agregar-editar-categoria.module').then( m => m.AgregarEditarCategoriaPageModule)
  },
  {
    path: 'subcategorias/:id',
    loadChildren: () => import('./pages/subcategorias/subcategorias.module').then( m => m.SubcategoriasPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'lista-usuarios-servicio/:id',
    loadChildren: () => import('./pages/lista-usuarios-servicio/lista-usuarios-servicio.module').then( m => m.ListaUsuariosServicioPageModule)
  },
  {
    path: 'perfil-usuario/:id',
    loadChildren: () => import('./pages/perfil-usuario/perfil-usuario.module').then( m => m.PerfilUsuarioPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
