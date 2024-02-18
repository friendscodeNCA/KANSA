import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoLoginGuard } from './guards/no-login.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
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
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [NoLoginGuard] 
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
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'resultados-busqueda/:target',
    loadChildren: () => import('./pages/resultados-busqueda/resultados-busqueda.module').then( m => m.ResultadosBusquedaPageModule),
  },
  {
    path: 'chats/:id',
    loadChildren: () => import('./tab3/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'modal-obtener-ubicacion',
    loadChildren: () => import('./modals/modal-obtener-ubicacion/modal-obtener-ubicacion.module').then( m => m.ModalObtenerUbicacionPageModule)
  },
  {
    path: 'info-app',
    loadChildren: () => import('./pages/info-app/info-app.module').then( m => m.InfoAppPageModule)
  },
  {
    path: 'editar-perfil/:celular',
    loadChildren: () => import('./modals/editar-perfil/editar-perfil.module').then( m => m.EditarPerfilPageModule)
  }






];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
