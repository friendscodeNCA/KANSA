import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-editar',
  templateUrl: './popover-editar.component.html',
  styleUrls: ['./popover-editar.component.scss'],
})
export class PopoverEditarComponent implements OnInit {

  @Input() exportar;
  @Input() importarProductosCompuestos;
  @Input() editarBorrar;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  popAction(valor: string) {
    this.popoverController.dismiss({
      action: valor
    });
  }

}
